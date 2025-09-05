import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getEnterpriseOffers, getEnterpriseApplications, getCurrentEnterpriseInfo } from '../../api/enterpriseApi';
import { useApplicationsStore } from '../../store/applicationsStore';
import type { OfferResponseDto } from '../../types/offer';
import EntrepriseHeader from './EnterpriseHeader';
import OfferCard from '../OfferCard';
import ConfirmationModal from '../admin/ConfirmationModal';

const ListeOffresEntreprise: React.FC = () => {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPartner, setIsPartner] = useState(false);
  const [partnershipLoading, setPartnershipLoading] = useState(true);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const navigate = useNavigate();
  const setApplicationsCount = useApplicationsStore((state) => state.setApplicationsCount);

  const refreshData = async () => {
    try {
      const enterpriseInfo = await getCurrentEnterpriseInfo();
      const partnershipStatus = enterpriseInfo.data?.inPartnership === true;
      setIsPartner(partnershipStatus);
      setPartnershipLoading(false);
      console.log('Statut de partenariat rafraêchi:', partnershipStatus);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setPartnershipLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [offersResponse, applicationsResponse, enterpriseInfo] = await Promise.all([
          getEnterpriseOffers(),
          getEnterpriseApplications(),
          getCurrentEnterpriseInfo()
        ]);
        
        const offersData = offersResponse.data || offersResponse;
        setOffers(Array.isArray(offersData) ? offersData : []);
        
        // Vérifier le statut de partenariat
        setIsPartner(enterpriseInfo.data?.inPartnership === true);
        setPartnershipLoading(false);
        
        // Compter les candidatures par offre
        const applicationsData = applicationsResponse.data || [];
        const counts: Record<number, number> = {};
        applicationsData.forEach((app: any) => {
          const offerId = app.offer?.id;
          if (offerId) {
            counts[offerId] = (counts[offerId] || 0) + 1;
          }
        });
        
        // Stocker dans Zustand
        Object.entries(counts).forEach(([offerId, count]) => {
          setApplicationsCount(parseInt(offerId), count);
        });
        
      } catch (error) {
        setOffers([]);
        setPartnershipLoading(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Polling automatique toutes les 5 secondes
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [setApplicationsCount]);

  const handleCreateOffer = () => {
    if (!isPartner) {
      setShowPartnerModal(true);
      return;
    }
    navigate('/entreprise/creer-offre');
  };

  // Recherche sur le titre ou le domaine
  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(search.toLowerCase()) ||
    offer.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-login-gradient flex gap-4 flex-col">
      <EntrepriseHeader />
      <main className="mt-5 flex flex-col items-center flex-1 px-4 pb-12">
        <div className="w-full max-w-3xl mt-8">
          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-[var(--color-light)]">Mes offres de stage</h1>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateOffer}
                  disabled={partnershipLoading || !isPartner}
                  className={`px-2 py-1 rounded-lg font-semibold transition ${
                    !partnershipLoading && isPartner 
                      ? 'bg-[var(--color-vert)] text-white hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] cursor-pointer'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                  title={partnershipLoading ? 'Vérification...' : !isPartner ? 'Entreprise non partenaire' : ''}
                >
                  {partnershipLoading ? 'Vérification...' : 'Créer une offre'}
                </button>
                {!isPartner && !partnershipLoading && (
                  <button
                    onClick={refreshData}
                    className="px-4 py-3 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                    title="Rafraîchir le statut de partenariat"
                  >
                    ⟳
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              placeholder="Rechercher une offre par titre ou domaine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-2 py-2 border-none bg-[var(--color-neutre95)] text-[var(--color-neutre2-paragraphe)] text-base shadow focus:outline-none focus:ring-2 focus:ring-[#b79056] placeholder-[var(--color-neutre2-paragraphe)] rounded-lg"
            />
          </motion.div>

          {/* Liste des offres */}
          {loading ? (
            <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement...</div>
          ) : filteredOffers.length === 0 ? (
            offers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-full max-w-md mx-auto bg-[var(--color-dark)] rounded-lg border-2 border-dashed border-[var(--color-jaune)] p-8 text-center">
                  <h2 className="text-2xl font-light text-[var(--color-jaune)] mb-6">Aucune offre</h2>
                  <div className="bg-[var(--color-jaune)] bg-opacity-20 border border-[var(--color-jaune)] rounded-lg p-6 mb-6">
                    <p className="text-[var(--color-light)] text-sm mb-4">
                      Vous n'avez pas encore créé d'offre de stage.
                      <br />Cliquez ci-dessous pour en créer
                    </p>
                    <button
                      onClick={handleCreateOffer}
                      className="w-full bg-[var(--color-vert)] text-white py-3 rounded-lg font-medium hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition"
                    >
                      Créer
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre trouvée pour cette recherche.</div>
            )
          ) : (
            <div className="space-y-4">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onClick={() => navigate(`/entreprise/offres/${offer.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <ConfirmationModal
        isOpen={showPartnerModal}
        title="Partenariat requis"
        message="Votre entreprise doit être approuvée comme partenaire pour créer des offres de stage. Veuillez attendre l'approbation de l'administration."
        confirmText="Compris"
        onConfirm={() => setShowPartnerModal(false)}
        onCancel={() => setShowPartnerModal(false)}
        type="info"
      />
    </div>
  );
};

export default ListeOffresEntreprise;