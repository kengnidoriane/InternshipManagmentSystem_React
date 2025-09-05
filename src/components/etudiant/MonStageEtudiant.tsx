import { useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import EtudiantHeader from '../EtudiantHeader';
import ConfirmationModal from '../admin/ConfirmationModal';
import { updateStudentStatus, deleteApplication, getStudentStatus } from '../../api';
import { useStudentStatus } from '../../hooks/useStudentStatus';
import EnterpriseLogo from '../entreprise/EnterpriseLogo';
import { Link } from 'react-router-dom';

export default function MonStageEtudiant() {
  const studentStatus = useStudentStatus();
  const { pendingApplications, approvedApplications, loading } = studentStatus;
  const [acceptingApplication, setAcceptingApplication] = useState<number | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [internshipStatus, setInternshipStatus] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [currentInternship, setCurrentInternship] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'accept' | 'reject' | 'delete';
    applicationId: number | null;
    title: string;
    message: string;
  }>({ isOpen: false, type: 'accept', applicationId: null, title: '', message: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statusResponse = await getStudentStatus();
        setInternshipStatus(statusResponse.data);
        
        console.log('Student status from backend:', statusResponse.data);
        
        // Si l'étudiant est en stage, récupérer les infos depuis localStorage
        const savedInternship = localStorage.getItem('currentInternship');
        if ((statusResponse.data.onInternship || statusResponse.data.inInternship) && savedInternship) {
          try {
            const parsedInternship = JSON.parse(savedInternship);
            setCurrentInternship(parsedInternship);
            console.log('Loaded internship from localStorage:', parsedInternship);
          } catch (e) {
            console.error('Error parsing saved internship:', e);
            localStorage.removeItem('currentInternship');
          }
        } else if (statusResponse.data.onInternship || statusResponse.data.inInternship) {
          // Si en stage mais pas d'infos sauvegardées, essayer de récupérer depuis les candidatures approuvées
          console.log('Student is in internship but no saved data, checking approved applications...');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
      } finally {
        setStatusLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleAcceptOffer = (applicationId: number) => {
    setConfirmModal({
      isOpen: true,
      type: 'accept',
      applicationId,
      title: 'Accepter l\'offre de stage',
      message: 'Êtes-vous sûr de vouloir accepter cette offre de stage ? Cette action est irréversible.'
    });
  };

  const confirmAcceptOffer = async () => {
    const applicationId = confirmModal.applicationId!;
    setAcceptingApplication(applicationId);
    setConfirmModal({ isOpen: false, type: 'accept', applicationId: null, title: '', message: '' });
    try {
      const response = await updateStudentStatus(applicationId, true);
      // Stocker les informations du stage accepté
      setCurrentInternship(response.data);
      localStorage.setItem('currentInternship', JSON.stringify(response.data));
      
      // Mettre à jour le statut local
      setInternshipStatus({ 
        inInternship: true, 
        onInternship: true,
        message: 'Vous êtes en stage', 
        canApply: false 
      });
      
      setShowCongratulations(true);
      
      // Rafraîchir le statut après un délai
      setTimeout(async () => {
        setShowCongratulations(false);
        await studentStatus.refresh();
        // Recharger le statut depuis le serveur
        const newStatus = await getStudentStatus();
        setInternshipStatus(newStatus.data);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
      setAcceptingApplication(null);
    }
  };

  const handleRejectOffer = (applicationId: number) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      applicationId,
      title: 'Refuser l\'offre',
      message: 'Êtes-vous sûr de vouloir refuser cette offre ?'
    });
  };

  const confirmRejectOffer = async () => {
    const applicationId = confirmModal.applicationId!;
    setConfirmModal({ isOpen: false, type: 'reject', applicationId: null, title: '', message: '' });
    
    try {
      await updateStudentStatus(applicationId, false);
      // Rafraîchir le statut après refus
      await studentStatus.refresh();
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const handleDeleteApplication = (applicationId: number) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      applicationId,
      title: 'Supprimer la candidature',
      message: 'Êtes-vous sûr de vouloir supprimer cette candidature ?'
    });
  };

  const confirmDeleteApplication = async () => {
    const applicationId = confirmModal.applicationId!;
    setConfirmModal({ isOpen: false, type: 'delete', applicationId: null, title: '', message: '' });
    
    try {
      await deleteApplication(applicationId);
      // Rafraîchir le statut après suppression
      await studentStatus.refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading || statusLoading) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EtudiantHeader />
        <div className="flex justify-center items-center flex-1">
          <div className="text-lg text-[var(--color-jaune)]">Chargement...</div>
        </div>
      </div>
    );
  }

  // Si l'étudiant est en stage, afficher les informations du stage
  if ((internshipStatus?.inInternship || internshipStatus?.onInternship || studentStatus.isOnInternship) && currentInternship) {
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
            <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Mon Stage</h2>
            
            <div className="bg-[#f5ede3] rounded-lg shadow-lg border border-[#e1d3c1] p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Informations principales du stage */}
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[var(--color-vert)] rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--color-dark)]">{currentInternship.offer.title}</h3>
                      <p className="text-[var(--color-vert)] font-medium">Stage confirmé</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[var(--color-dark)] mb-2">Description</h4>
                      <p className="text-[var(--color-dark)] text-sm">{currentInternship.offer.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[var(--color-dark)] mb-2">Domaine</h4>
                      <span className="px-3 py-1 bg-[var(--color-vert)] text-white rounded-full text-sm">
                        {currentInternship.offer.domain}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Informations de l'entreprise */}
                <div className="lg:w-80">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="text-center mb-4">
                      <EnterpriseLogo 
                        enterpriseName={currentInternship.enterprise.name}
                        enterpriseId={currentInternship.enterprise.id}
                        hasLogo={false}
                        size="lg"
                        className="mb-3 mx-auto"
                      />
                      <h4 className="font-bold text-[var(--color-dark)] text-lg">{currentInternship.enterprise.name}</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-[var(--color-dark)]">Statut :</span>
                        <span className="text-[var(--color-vert)] font-medium">En stage</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-[var(--color-dark)]">Candidature :</span>
                        <span className="text-green-600 font-medium">Acceptée</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 text-center">
                        Félicitations ! Votre stage a été confirmé avec succès.
                      </p>
                    </div>
                  </div>
                </div>
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
          {pendingApplications.filter(app => app.state === 'PENDING').length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-light)] mb-4">En attente de réponse de l'entreprise</h3>
              <div className="grid gap-4">
                {pendingApplications.filter(app => app.state === 'PENDING').map(app => (
                  <div key={app.id} className="bg-[#f5ede3] rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-[#2d2d2d] mb-2">{app.offer.title}</h4>
                    <p className="text-gray-600 mb-1">Entreprise: {app.enterprise.name}</p>
                    <p className="text-gray-600 mb-2">Domaine: {app.offer.domain}</p>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        En attente de validation
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
          {approvedApplications.filter(app => app.state === 'APPROVED').length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-light)] mb-4">Offres approuvées par l'entreprise</h3>
              <div className="grid gap-4">
                {approvedApplications.filter(app => app.state === 'APPROVED').map(app => (
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

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'accept', applicationId: null, title: '', message: '' })}
        onConfirm={() => {
          if (confirmModal.type === 'accept') confirmAcceptOffer();
          else if (confirmModal.type === 'reject') confirmRejectOffer();
          else if (confirmModal.type === 'delete') confirmDeleteApplication();
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
}