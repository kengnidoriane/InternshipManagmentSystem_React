import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnterpriseApplications, getEnterpriseOffers, downloadCandidateCV } from '../../api/enterpriseApi';
import EnterpriseHeader from './EnterpriseHeader';
interface Application {
  id: number;
  student: {
    firstName: string;
    name: string;
    email: string;
  };
  offer: {
    title: string;
    description: string;
    domain: string;
    status: string;
  };
  enterprise: {
    id: number;
    name: string;
  };
  state: string;
  hasFiles: {
    hasCV: boolean;
    hasCoverLetter: boolean;
  };
}

const CandidaturesEntreprise: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer d'abord les offres de l'entreprise
        const offersResponse = await getEnterpriseOffers();
        const enterpriseOffers = offersResponse.data || [];
        setOffers(enterpriseOffers);
        
        // Récupérer toutes les candidatures de l'entreprise
        const applicationsResponse = await getEnterpriseApplications();
        console.log('Candidatures - réponse complète:', applicationsResponse);
        console.log('Candidatures - données:', applicationsResponse.data);
        const allApplications = applicationsResponse.data || [];
        console.log('Candidatures - après traitement:', allApplications);
        
        // Les candidatures sont déjà filtrées par entreprise par l'API
        const filteredApplications = allApplications;
        
        setApplications(filteredApplications);
        console.log('Candidatures filtrées pour cette entreprise:', filteredApplications);
        console.log('Nombre de candidatures:', filteredApplications.length);
        console.log('Nombre d\'offres:', enterpriseOffers.length);
      } catch (err: any) {
        console.error('Erreur lors du chargement:', err);
        setError(err?.response?.data?.message || 'Erreur lors du chargement des candidatures');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInitials = (firstName: string, name: string) => {
    return `${firstName.charAt(0)}${name.charAt(0)}`.toUpperCase();
  };

  const handleDownloadCV = async (applicationId: number) => {
    try {
      const response = await downloadCandidateCV(applicationId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_candidat_${applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement du CV:', err);
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

  // État 1: Aucune offre créée
  if (offers.length === 0) {
    return (
      <div className="min-h-screen w-full bg-login-gradient">
        <EnterpriseHeader />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-[#f5ede3] rounded-lg shadow-lg p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-[#2d2d2d] mb-4">
              Aucune candidature disponible
            </h2>
            <p className="text-[#2d2d2d] mb-6">
              Vous devez d'abord créer une offre de stage pour pouvoir voir les candidatures.
            </p>
            <button
              onClick={() => navigate('/entreprise/creer-offre')}
              className="bg-[#4c7a4c] text-white px-6 py-3 rounded hover:bg-[#6a9a6a] transition-colors"
            >
              Créer une offre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // État 2: Des offres existent mais aucune candidature
  if (applications.length === 0) {
    return (
      <div className="min-h-screen w-full bg-login-gradient">
        <EnterpriseHeader />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-[#f5ede3] rounded-lg shadow-lg p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-[#2d2d2d] mb-4">
              Aucune candidature reçue
            </h2>
            <p className="text-[#2d2d2d]">
              Vous n'avez pas encore reçu de candidatures pour vos offres de stage.
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendu - offers.length:', offers.length);
  console.log('Rendu - applications.length:', applications.length);
  console.log('Rendu - loading:', loading);
  console.log('Rendu - error:', error);

  // État 3: Affichage des candidatures
  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <EnterpriseHeader />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-[#2d2d2d] mb-2">Voir les candidatures</h1>
          
          {/* Grouper par offre */}
          {offers.map(offer => {
            const offerApplications = applications.filter(app => app.offer.title === offer.title);
            console.log(`Offre "${offer.title}" - candidatures trouvées:`, offerApplications.length);
            if (offerApplications.length === 0) return null;

            return (
              <div key={offer.id} className="mb-8">
                <div className="bg-[#f5ede3] rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-[#2d2d2d] mb-2">{offer.title}</h2>
                  <p className="text-sm text-[#2d2d2d] mb-4">
                    Liste des candidats ({offerApplications.length} profils pour {offer.numberOfPlaces || 1} places)
                  </p>
                  <button className="bg-[#6a9a6a] text-white px-4 py-2 rounded text-sm mb-6">
                    Télécharger Toutes candidatures
                  </button>

                  {/* Grille des candidatures */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offerApplications.map(application => (
                      <div 
                        key={application.id} 
                        className="bg-white rounded-lg p-4 border border-[#d2bfa3] cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/entreprise/candidatures/${application.id}`, { state: { application } })}
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar avec initiales */}
                          <div className="w-16 h-16 bg-[#4c7a4c] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {getInitials(application.student.firstName, application.student.name)}
                          </div>
                          
                          {/* Informations du candidat */}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-[#2d2d2d] mb-1">
                              {application.student.firstName} {application.student.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">{application.offer.title}</p>
                            <p className="text-sm text-gray-600 mb-1">Domaine: {application.offer.domain}</p>
                            <div className="mb-2">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                application.state === 'PENDING' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : application.state === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {application.state === 'PENDING' ? 'En attente' : 
                                 application.state === 'APPROVED' ? 'Approuvée' : 'Refusée'}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadCV(application.id);
                              }}
                              className="bg-[#6a9a6a] text-white px-3 py-1 rounded text-sm hover:bg-[#4c7a4c] transition-colors"
                            >
                              Télécharger CV
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CandidaturesEntreprise;