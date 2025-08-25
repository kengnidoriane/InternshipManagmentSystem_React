import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getEnterpriseOffers, getEnterpriseApplications } from '../api/enterpriseApi';
import { useApplicationsStore } from '../store/applicationsStore';
import type { OfferResponseDto } from '../types/offer';
import EntrepriseHeader from './EnterpriseHeader';
import OfferCard from './OfferCard';

const ListeOffresEntreprise: React.FC = () => {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const setApplicationsCount = useApplicationsStore((state) => state.setApplicationsCount);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [offersResponse, applicationsResponse] = await Promise.all([
          getEnterpriseOffers(),
          getEnterpriseApplications()
        ]);
        
        const offersData = offersResponse.data || offersResponse;
        setOffers(Array.isArray(offersData) ? offersData : []);
        
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [setApplicationsCount]);

  const handleCreateOffer = () => {
    navigate('/entreprise/creer-offre');
  };

  // Recherche sur le titre ou le domaine
  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(search.toLowerCase()) ||
    offer.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EntrepriseHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <div className="w-full max-w-3xl mt-8">
          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-[var(--color-light)]">Mes offres de stage</h1>
              <button
                onClick={handleCreateOffer}
                className="bg-[var(--color-vert)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition"
              >
                Créer une offre
              </button>
            </div>
            <input
              type="text"
              placeholder="Rechercher une offre par titre ou domaine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[var(--color-neutre95)] text-[var(--color-neutre2-paragraphe)] text-base shadow focus:outline-none focus:ring-2 focus:ring-[#b79056] placeholder-[var(--color-neutre2-paragraphe)] rounded-lg"
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
    </div>
  );
};

export default ListeOffresEntreprise;