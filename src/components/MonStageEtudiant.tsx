import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EtudiantHeader from './EtudiantHeader';
import { Link } from 'react-router-dom';
import { updateStudentStatus, deleteApplication } from '../api/studentApi';
import { useStudentStatus } from '../hooks/useStudentStatus';

interface Application {
  id: number;
  offer: {
    id: number;
    title: string;
    description: string;
    domain: string;
  };
  enterprise: {
    id: number;
    name: string;
  };
  state: string;
}

export default function MonStageEtudiant() {
  const studentStatus = useStudentStatus();
  const { pendingApplications, approvedApplications, acceptedApplications, loading } = studentStatus;
  const [acceptingApplication, setAcceptingApplication] = useState<number | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);



  const handleAcceptOffer = async (applicationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir accepter cette offre de stage ? Cette action est irréversible.')) {
      return;
    }
    
    setAcceptingApplication(applicationId);
    try {
      await updateStudentStatus(applicationId, true);
      setShowCongratulations(true);
      
      // Après acceptation, l'étudiant est en stage - les listes seront vides
      // Pas besoin de recharger, le backend gère automatiquement
      setTimeout(() => {
        // Recharger pour voir l'état final (probablement vide car en stage)
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
      alert('Erreur lors de l\'acceptation de l\'offre');
      setAcceptingApplication(null);
    }
  };

  const handleRejectOffer = async (applicationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette offre ?')) {
      return;
    }
    
    try {
      await updateStudentStatus(applicationId, false);
      // Rafraîchir le statut après refus
      await studentStatus.refresh();
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      alert('Erreur lors du refus de l\'offre');
    }
  };

  const handleDeleteApplication = async (applicationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }
    try {
      await deleteApplication(applicationId);
      // Rafraîchir le statut après suppression
      await studentStatus.refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la candidature');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EtudiantHeader />
        <div className="flex justify-center items-center flex-1">
          <div className="text-lg text-[var(--color-jaune)]">Chargement...</div>
        </div>
      </div>
    );
  }

  // Si l'étudiant a une candidature acceptée, afficher seulement celle-ci
  const acceptedApplication = acceptedApplications.length > 0 ? acceptedApplications[0] : null;
  
  if (acceptedApplication) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EtudiantHeader />
        <main className="flex flex-col items-center flex-1 px-4 pb-12">
          <motion.div
            className="w-full max-w-2xl mt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Mon Stage</h2>
            <div className="bg-[#f5ede3] rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-[#2d2d2d] mb-2">{acceptedApplication.offer.title}</h3>
              <p className="text-gray-600 mb-2">Entreprise: {acceptedApplication.enterprise.name}</p>
              <p className="text-gray-600 mb-4">Domaine: {acceptedApplication.offer.domain}</p>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                Stage confirmé
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Si pas de candidatures du tout
  if (pendingApplications.length === 0 && approvedApplications.length === 0) {
    return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EtudiantHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <motion.div
          className="w-full max-w-xl mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Mes Candidatures</h2>
          <div className="mx-auto max-w-md border border-[#e1d3c1] rounded-lg py-7 px-6 bg-transparent flex flex-col items-center" style={{boxShadow: '0 0 0 2px #e1d3c1'}}>
            <div className="text-[var(--color-light)] text-sm text-center mb-6 w-full">
              Vous n'avez aucune candidature en cours.<br />
              <Link to="/stages" className="text-[var(--color-jaune)] hover:underline">
                Consultez les offres disponibles
              </Link> pour postuler à un stage.
            </div>
          </div>
        </motion.div>
      </main>
    </div>
    );
  }

  // Afficher les candidatures en attente et approuvées
  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EtudiantHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <motion.div
          className="w-full max-w-4xl mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Mes Candidatures</h2>
          
          {/* Candidatures en attente */}
          {pendingApplications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-light)] mb-4">En attente de réponse</h3>
              <div className="grid gap-4">
                {pendingApplications.map(app => (
                  <div key={app.id} className="bg-[#f5ede3] rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-[#2d2d2d] mb-2">{app.offer.title}</h4>
                    <p className="text-gray-600 mb-1">Entreprise: {app.enterprise.name}</p>
                    <p className="text-gray-600 mb-2">Domaine: {app.offer.domain}</p>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        En attente
                      </div>
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Candidatures approuvées */}
          {approvedApplications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-light)] mb-4">Offres approuvées par l'entreprise</h3>
              <div className="grid gap-4">
                {approvedApplications.map(app => (
                  <div key={app.id} className="bg-[#f5ede3] rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-[#2d2d2d] mb-2">{app.offer.title}</h4>
                    <p className="text-gray-600 mb-1">Entreprise: {app.enterprise.name}</p>
                    <p className="text-gray-600 mb-4">Domaine: {app.offer.domain}</p>
                    <div className="mb-3">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-3">
                        Approuvée par l'entreprise
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        L'entreprise a approuvé votre candidature. Souhaitez-vous accepter cette offre de stage ?
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptOffer(app.id)}
                        disabled={acceptingApplication === app.id}
                        className="bg-[#4c7a4c] text-white px-4 py-2 rounded hover:bg-[#6a9a6a] transition-colors disabled:opacity-50"
                      >
                        {acceptingApplication === app.id ? 'Acceptation...' : 'Accepter l\'offre'}
                      </button>
                      <button
                        onClick={() => handleRejectOffer(app.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Décliner l'offre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          

        </motion.div>
        
        {/* Popup de félicitations */}
        {showCongratulations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Félicitations !</h3>
              <p className="text-gray-600 mb-6">Vous avez accepté l'offre de stage avec succès. Votre stage est maintenant confirmé !</p>
              <p className="text-sm text-gray-500 mb-6">La page va se recharger automatiquement...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-vert)]"></div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}