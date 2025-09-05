import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherHeader from './TeacherHeader';
import { approveEnterprise, getEnterpriseInPartnership } from '../../api/teacherApi';
import { api } from '../../api/api';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import EnterpriseLogo from '../entreprise/EnterpriseLogo';

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchEnterpriseDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Valider et récupérer les détails de l'entreprise
        const enterpriseId = Number(id);
        if (isNaN(enterpriseId) || enterpriseId <= 0) {
          setError('ID d\'entreprise invalide');
          return;
        }
        
        // Récupérer l'entreprise depuis la liste des partenaires
        const response = await getEnterpriseInPartnership();
        const enterprises = response.data || [];
        const enterpriseData = enterprises.find((ent: any) => ent.id === enterpriseId);
        
        if (!enterpriseData) {
          setError('Entreprise introuvable');
          return;
        }
        
        setEnterprise(enterpriseData);
        

        
        // Charger les offres si l'entreprise est approuvée
        if (enterpriseData.inPartnership) {
          try {
            const offersResponse = await api.get('/api/teacher/offerToReview', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const allOffers = offersResponse.data || [];
            const enterpriseOffers = allOffers.filter((offer: any) => offer.enterprise?.id === enterpriseData.id);
            setOffers(enterpriseOffers);
          } catch (offersErr) {
            console.error('Erreur lors du chargement des offres:', offersErr);
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
                  <div className="mr-6">
                    <EnterpriseLogo 
                      enterpriseName={enterprise.name}
                      enterpriseId={enterprise.id}
                      hasLogo={enterprise.hasLogo?.hasLogo}
                      size="3xl"
                      className=""
                    />
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
                        <p className="text-gray-700">Seteur: {enterprise.sectorOfActivity}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold mb-2">Informations de contact</h2>
                      <p className="text-gray-700">Email: {enterprise.email}</p>
                      <p className="text-gray-700">Telephone: {enterprise.contact}</p>
                      <p className="text-gray-700">Immatriculation: {enterprise.matriculation}</p>
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
                      onClick={() => handleApprove(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button 
                      onClick={() => handleApprove(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              )}
              
              {/* Section des offres pour les entreprises approuvées */}
              {enterprise.inPartnership && offers.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Offres de stage de cette entreprise</h2>
                  <div className="flex flex-col gap-4">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex flex-row items-stretch bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => navigate(`/enseignant/offres/${offer.id}`)}
                      >
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{offer.domain}</p>
                          <p className="text-xs text-gray-500">Places: {offer.numberOfPlaces} • {offer.paying ? 'Payant' : 'Non payant'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4">Entreprise introuvable.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EnterpriseDetail;