import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EtudiantHeader from './EtudiantHeader';
import { Link } from 'react-router-dom';
import { getPendingApplicationsOfStudent, getApplicationsApprovedOfStudent, updateStudentStatus } from '../api/studentApi';

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
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingApplication, setAcceptingApplication] = useState<number | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          getPendingApplicationsOfStudent(),
          getApplicationsApprovedOfStudent()
        ]);
        
        setPendingApplications(pendingRes.data || []);
        setApprovedApplications(approvedRes.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des candidatures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAcceptOffer = async (applicationId: number) => {
    setAcceptingApplication(applicationId);
    try {
      await updateStudentStatus(applicationId, true);
      // Recharger les candidatures
      const [pendingRes, approvedRes] = await Promise.all([
        getPendingApplicationsOfStudent(),
        getApplicationsApprovedOfStudent()
      ]);
      setPendingApplications(pendingRes.data || []);
      setApprovedApplications(approvedRes.data || []);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
      alert('Erreur lors de l\'acceptation de l\'offre');
    } finally {
      setAcceptingApplication(null);
    }
  };

  const handleRejectOffer = async (applicationId: number) => {
    try {
      await updateStudentStatus(applicationId, false);
      // Recharger les candidatures
      const [pendingRes, approvedRes] = await Promise.all([
        getPendingApplicationsOfStudent(),
        getApplicationsApprovedOfStudent()
      ]);
      setPendingApplications(pendingRes.data || []);
      setApprovedApplications(approvedRes.data || []);
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      alert('Erreur lors du refus de l\'offre');
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

  // Si l'étudiant a une candidature approuvée et acceptée, afficher seulement celle-ci
  const acceptedApplication = approvedApplications.find(app => app.state === 'ACCEPTED');
  
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
          <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Aucun stage</h2>
          <div className="mx-auto max-w-md border border-[#e1d3c1] rounded-lg py-7 px-6 bg-transparent flex flex-col items-center" style={{boxShadow: '0 0 0 2px #e1d3c1'}}>
            <div className="text-[var(--color-light)] text-sm text-left mb-6 w-full">
              Vous n’avez pas encore de stage.<br />
              Cliquez ci-dessous pour choisir un qui correspond à votre profil
            </div>
            <Link
              to="/etudiant/stages"
              className="w-full block bg-[var(--color-vert)] text-[var(--color-light)] text-base font-medium rounded px-4 py-2 mt-2 text-center hover:bg-[#6b7d4b] transition-colors"
            >
              Liste des offres
            </Link>
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
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      En attente
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Candidatures approuvées */}
          {approvedApplications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--color-light)] mb-4">Offres approuvées</h3>
              <div className="grid gap-4">
                {approvedApplications.map(app => (
                  <div key={app.id} className="bg-[#f5ede3] rounded-lg p-4 shadow-md">
                    <h4 className="font-semibold text-[#2d2d2d] mb-2">{app.offer.title}</h4>
                    <p className="text-gray-600 mb-1">Entreprise: {app.enterprise.name}</p>
                    <p className="text-gray-600 mb-4">Domaine: {app.offer.domain}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptOffer(app.id)}
                        disabled={acceptingApplication === app.id}
                        className="bg-[#4c7a4c] text-white px-4 py-2 rounded hover:bg-[#6a9a6a] transition-colors disabled:opacity-50"
                      >
                        {acceptingApplication === app.id ? 'Acceptation...' : 'Accepter'}
                      </button>
                      <button
                        onClick={() => handleRejectOffer(app.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
