import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherHeader from '../TeacherHeader';
import { getPendingEnterprises, getPartnerEnterprises, approveEnterprise } from '../../api/enterpriseApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données fictives pour les tests
  const mockEnterprises = [
    {
      id: 1,
      name: "L'Z customs",
      email: "lz@example.com",
      sectorOfActivity: "Informatique & Réseaux",
      inPartnership: false,
      matriculation: "LZ123",
      hasLogo: { hasLogo: true },
      country: "Cameroun",
      city: "Douala"
    },
    {
      id: 2,
      name: "EG Share",
      email: "egshare@example.com",
      sectorOfActivity: "Réseaux & Cyber",
      inPartnership: false,
      matriculation: "EG456",
      hasLogo: { hasLogo: true },
      country: "Nigeria",
      city: "Lagos"
    },
    {
      id: 3,
      name: "Cisco",
      email: "cisco@example.com",
      sectorOfActivity: "CCNA & Cybersécurité",
      inPartnership: false,
      matriculation: "CS789",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Francisco"
    },
    {
      id: 4,
      name: "Cisco",
      email: "cisco@example.com",
      sectorOfActivity: "Réseaux de données",
      inPartnership: true,
      matriculation: "CS001",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Jose"
    },
    {
      id: 5,
      name: "L'Z customs",
      email: "lz@example.com",
      sectorOfActivity: "Informatique & Réseaux",
      inPartnership: true,
      matriculation: "LZ002",
      hasLogo: { hasLogo: true },
      country: "Cameroun",
      city: "Yaoundé"
    }
  ];

  useEffect(() => {
    const fetchEnterpriseDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Essayer de récupérer les données réelles
        try {
          // Rechercher dans les entreprises en attente
          const pendingData = await getPendingEnterprises();
          const pendingEnterprise = pendingData.find(e => e.id === parseInt(id));
          
          if (pendingEnterprise) {
            setEnterprise(pendingEnterprise);
            setLoading(false);
            return;
          }
          
          // Rechercher dans les entreprises partenaires
          const partnerData = await getPartnerEnterprises();
          const partnerEnterprise = partnerData.find(e => e.id === parseInt(id));
          
          if (partnerEnterprise) {
            setEnterprise(partnerEnterprise);
            setLoading(false);
            return;
          }
          
          // Si on arrive ici, l'entreprise n'a pas été trouvée
          setError('Entreprise non trouvée');
        } catch (err) {
          console.warn('Utilisation des données fictives pour les détails de l\'entreprise');
          // Utiliser les données fictives
          const mockEnterprise = mockEnterprises.find(e => e.id === parseInt(id));
          
          if (mockEnterprise) {
            setEnterprise(mockEnterprise);
          } else {
            setError('Entreprise non trouvée');
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'entreprise');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterpriseDetails();
  }, [id]);

  const handleApprove = async (approved: boolean) => {
    if (!enterprise) return;
    
    try {
      await approveEnterprise(enterprise.id, approved);
      // Rediriger vers la liste des entreprises après approbation/rejet
      navigate('/enseignant/entreprises');
    } catch (err) {
      setError('Erreur lors de l\'approbation de l\'entreprise');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <TeacherHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          {/* Bouton retour */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/enseignant/entreprises')}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-xl font-medium">Retour aux entreprises</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : enterprise ? (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start">
                  {/* Logo de l'entreprise */}
                  <div className="w-32 h-32 bg-blue-500 text-white rounded-md flex items-center justify-center text-4xl mr-6">
                    {enterprise.name.substring(0, 2)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{enterprise.name}</h1>
                        {!enterprise.inPartnership && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                            En attente
                          </span>
                        )}
                        <p className="text-gray-600 mb-1">{enterprise.country} • {enterprise.city}</p>
                        <p className="text-gray-700">{enterprise.sectorOfActivity}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold mb-2">Informations de contact</h2>
                      <p className="text-gray-700">Email: {enterprise.email}</p>
                      <p className="text-gray-700">Matriculation: {enterprise.matriculation}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section demande de partenariat (uniquement pour les entreprises en attente) */}
              {!enterprise.inPartnership && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Demande de partenariat</h2>
                  <p className="mb-4">Cette entreprise a fait une demande de partenariat. Souhaitez-vous l'accepter ou la rejeter?</p>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleApprove(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Accepter
                    </button>
                    <button 
                      onClick={() => handleApprove(false)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4">Aucune information disponible pour cette entreprise.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EnterpriseDetail;