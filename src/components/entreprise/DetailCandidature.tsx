import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getEnterpriseApplications, downloadCandidateCV, downloadCandidateCoverLetter, validateApplication } from '../../api/enterpriseApi';
import EnterpriseHeader from './EnterpriseHeader';
import ConfirmationModal from '../admin/ConfirmationModal';

interface ApplicationDetail {
  id: number;
  student: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    languages?: string[];
    linkedin?: string;
    github?: string;
    website?: string;
  };
  offer: {
    id: number;
    title: string;
    job: string;
  };
  applicationDate: string;
  status: string;
}

const DetailCandidature: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'info' | 'danger' | 'warning';
    onConfirm: () => void;
  } | null>(null);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // Récupérer depuis le state de navigation
        const stateAny = location.state as unknown as { application?: ApplicationDetail } | undefined;
        if (stateAny && stateAny.application) {
          setApplication(stateAny.application);
          setLoading(false);
          return;
        }
        
        // Fallback: chercher dans toutes les candidatures
        const response = await getEnterpriseApplications();
        const app = response.data.find((a: ApplicationDetail) => a.id === parseInt(applicationId!));
        setApplication(app);
      } catch (err) {
        console.error('Erreur lors du chargement de la candidature:', err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId, location.state]);

  const getInitials = (firstName: string, name: string) => {
    return `${firstName.charAt(0)}${name.charAt(0)}`.toUpperCase();
  };

  const handleDownloadCV = async () => {
    if (!application) return;
    try {
      const response = await downloadCandidateCV(application.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${application.student.firstName}_${application.student.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement du CV:', err);
    }
  };

  const handleDownloadCoverLetter = async () => {
    if (!application) return;
    try {
      const response = await downloadCandidateCoverLetter(application.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LettreMotivation_${application.student.firstName}_${application.student.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement de la lettre:', err);
    }
  };

  const handleValidateApplication = async (approved: boolean) => {
    if (!application) return;
    setProcessing(true);
    try {
      await validateApplication(application.id, approved);
      const message = approved ? 'Candidature acceptée avec succès!' : 'Candidature refusée.';
      setModalConfig({
        title: approved ? 'Candidature acceptée' : 'Candidature refusée',
        message,
        type: 'info',
        onConfirm: () => {
          setShowModal(false);
          navigate('/entreprise/candidatures');
        }
      });
      setShowModal(true);
    } catch (err: any) {
      console.error('Erreur lors de la validation:', err);
      const errorMessage = err?.response?.data?.message || 'Erreur lors de la validation de la candidature';
      setModalConfig({
        title: 'Erreur',
        message: errorMessage,
        type: 'danger',
        onConfirm: () => setShowModal(false)
      });
      setShowModal(true);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-login-gradient">
        <EnterpriseHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen w-full bg-login-gradient">
        <EnterpriseHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Candidature non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <EnterpriseHeader />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header avec bouton retour */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/entreprise/candidatures')}
              className="mr-4 text-[#2d2d2d] hover:text-[#4c7a4c]"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-2xl font-bold text-[#2d2d2d]">Détail de candidature</h1>
          </div>

          {/* Titre de l'offre */}
          <h2 className="text-xl font-semibold text-[#2d2d2d] mb-6">{application.offer.title}</h2>

          <div className="bg-[#f5ede3] rounded-lg p-8">
            {/* Section Profil du candidat */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">Profil du candidat</h3>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleDownloadCV}
                  className="bg-[#6a9a6a] text-white px-4 py-2 rounded text-sm hover:bg-[#4c7a4c] transition-colors"
                >
                  CV
                </button>
                <button
                  onClick={handleDownloadCoverLetter}
                  className="bg-[#6a9a6a] text-white px-4 py-2 rounded text-sm hover:bg-[#4c7a4c] transition-colors"
                >
                  Lettre de motivation
                </button>
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex items-start gap-8 mb-8">
              <div className="flex-grow">
                <h4 className="text-2xl font-light text-[#2d2d2d] mb-2 italic">
                  {application.offer.title}
                </h4>
                <h3 className="text-xl font-bold text-[#2d2d2d] mb-6">
                  {application.student.firstName} {application.student.name}
                </h3>

                {/* Langues */}
                <div className="mb-4">
                  <span className="font-semibold text-[#2d2d2d]">Langues : </span>
                  <span className="text-[#2d2d2d]">
                    {application.student.languages?.join(', ') || 'Anglais, Français'}
                  </span>
                </div>

                {/* Réseaux */}
                <div className="space-y-1">
                  <span className="font-semibold text-[#2d2d2d]">Réseaux : </span>
                  <div className="space-y-1">
                    {application.student.linkedin && (
                      <div>
                        <a 
                          href={application.student.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          linkedin
                        </a>
                      </div>
                    )}
                    {application.student.github && (
                      <div>
                        <a 
                          href={application.student.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          github
                        </a>
                      </div>
                    )}
                    {application.student.website && (
                      <div>
                        <a 
                          href={application.student.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Site web
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="w-32 h-32 bg-[#4c7a4c] rounded flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                {getInitials(application.student.firstName, application.student.name)}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                onClick={() => handleValidateApplication(false)}
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {processing ? 'Traitement...' : 'Refuser'}
              </button>
              <button
                onClick={() => handleValidateApplication(true)}
                disabled={processing}
                className="flex-1 bg-[#4c7a4c] text-white py-3 rounded font-semibold hover:bg-[#6a9a6a] transition-colors disabled:opacity-60"
              >
                {processing ? 'Traitement...' : 'Accepter'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {modalConfig && (
        <ConfirmationModal
          isOpen={showModal}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          confirmText="OK"
          onConfirm={modalConfig.onConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DetailCandidature;