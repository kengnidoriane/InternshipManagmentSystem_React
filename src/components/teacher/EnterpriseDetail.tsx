import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherHeader from '../TeacherHeader';
import { getEnterpriseById, getEnterpriseLogoById } from '../../api/enterpriseApi';
import { api } from '../../api/api';
import type { EnterpriseResponseDto } from '../../types/enterprise';

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Nettoyage de l'URL du logo lors du démontage du composant
  useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, []);

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
        
        const response = await getEnterpriseById(enterpriseId);
        const enterpriseData = response.data;
        setEnterprise(enterpriseData);
        
        // Charger le logo si disponible
        if (enterpriseData.hasLogo?.hasLogo) {
          try {
            const logoResponse = await getEnterpriseLogoById(enterpriseData.id);
            const newLogoUrl = URL.createObjectURL(logoResponse.data);
            setLogoUrl(newLogoUrl);
          } catch (logoErr) {
            console.warn(`Erreur lors du chargement du logo pour l'entreprise ${enterpriseData.id}`);
          }
        }
        
        // Charger les offres si l'entreprise est approuvée
        if (enterpriseData.inPartnership) {
          try {
            const offersResponse = await api.get('/api/teacher/offerToReview');
            const allOffers = offersResponse.data || [];
            const enterpriseOffers = allOffers.filter((offer: any) => offer.enterprise.id === enterpriseData.id);
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
              <div className="bg-[#e7e1e1be] rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start">
                  {/* Logo de l'entreprise */}
                  <div className="w-32 h-32 rounded-md flex items-center justify-center mr-6 overflow-hidden">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={`Logo ${enterprise.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-4xl">
                        {enterprise.name.substring(0, 2)}
                      </div>
                    )}
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
                <div className="bg-[[var(--color-neutre9)]] rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Demande de partenariat</h2>
                  <p className="mb-4">Cette entreprise a fait une demande de partenariat. Souhaitez-vous l'accepter ou la rejeter?</p>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleApprove(false)}
                      className="bg-[var(--color-rouge)] text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button 
                      onClick={() => handleApprove(true)}
                      className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              )}
              
              {/* Section des offres pour les entreprises approuvées */}
              {enterprise.inPartnership && offers.length > 0 && (
                <div className="bg-[var(--color-neutre9)] rounded-lg shadow-md p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Offres de stage de cette entreprise</h2>
                  <div className="flex flex-col gap-4">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex flex-row items-stretch bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:bg-[var(--color-light)] transition-colors cursor-pointer"
                        onClick={() => navigate(`/enseignant/offres/${offer.id}`)}
                      >
                        {/* Colonne gauche : logo, entreprise */}
                        <div className="flex flex-col items-center justify-center w-32 min-w-[175px] bg-[var(--color-light)] p-3">
                          <div className="h-12 w-12 rounded-full mb-2 border border-[#e1d3c1] bg-white flex items-center justify-center">
                            <span className="text-xs font-bold text-[var(--color-dark)]">
                              {offer.enterprise.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-[var(--color-dark)] font-semibold text-center">{offer.enterprise.name}</div>
                          <div className="text-[10px] text-[var(--color-dark)] mt-1">{enterprise.country} • {enterprise.city}</div>
                        </div>
                        
                        {/* Centre : titre, type, période, badges */}
                        <div className="flex-1 flex flex-col justify-between py-4">
                          <div className="flex flex-col pb-2">
                            <div className="font-semibold text-[var(--color-dark)] text-lg">{offer.title}</div>
                          </div>
                          <div className="flex flex-col mt-2 mb-2">
                            <div className="text-xs text-[var(--color-dark)]">Type de stage : <b>{offer.typeOfInternship}</b></div>
                            <div className="text-xs text-[var(--color-dark)]">Période du stage : <b>{offer.startDate} - {offer.endDate}</b></div>
                          </div>
                          <div className="flex flex-row flex-wrap gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              offer.status === 'PENDING' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              offer.status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {offer.status === 'PENDING' ? 'En attente' : 
                               offer.status === 'APPROVED' ? 'Approuvé' : 'Refusé'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Colonne droite : places, domaine */}
                        <div className="flex flex-col justify-between items-end max-w-[200px] bg-[var(--color-light)] p-4 border-l border-dashed border-[var(--color-neutre6-placeholder)]">
                          <div className="mb-2">
                            <div className="text-xs text-[var(--color-dark)]">Nombre de places <b>{offer.numberOfPlaces}</b></div>
                            <div className="text-xs text-[var(--color-dark)]">Domaine <b>{offer.domain}</b></div>
                          </div>
                        </div>
                      </div>
                    ))}
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