import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getEnterpriseOffers } from '../api/enterpriseApi';
import type { OfferResponseDto } from '../types/offer';
import EntrepriseHeader from './EnterpriseHeader';

const ListeOffresEntreprise: React.FC = () => {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getEnterpriseOffers()
      .then(setOffers)
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateOffer = () => {
    navigate('/entreprise/creer-offre');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EntrepriseHeader />
        <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EntrepriseHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <div className="w-full flex justify-center items-start mt-8">
          <div className="bg-[#e9dbc7] rounded-2xl border border-[#d2bfa3] shadow-lg p-8 max-w-2xl w-full relative">
            <h2 className="text-2xl font-semibold text-[var(--color-dark)] mb-6 flex items-center gap-2">
              <span className="material-icons text-lg align-middle cursor-pointer mr-2" onClick={() => navigate(-1)}>arrow_back</span>
              Creer une offre de stage
            </h2>
            {offers.length > 0 && (
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-light)]">Mes offres de stage</h1>
                <button
                  onClick={handleCreateOffer}
                  className="bg-[var(--color-vert)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition"
                >
                  Créer une offre
                </button>
              </div>
            )}

            {offers.length === 0 ? (
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
              <div className="grid gap-6">
                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--color-dark)] mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-[var(--color-dark)] mb-3 line-clamp-2">
                          {offer.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-dark)]">
                          <span>📅 {offer.startDate} - {offer.endDate}</span>
                          <span>🏢 {offer.domain}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            offer.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {offer.status === 'APPROVED' ? 'Approuvée' : 'En attente'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/entreprise/offres/${offer.id}`)}
                          className="px-4 py-2 bg-[var(--color-vert)] text-white rounded-lg hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => navigate(`/entreprise/offres/${offer.id}/edit`)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
  <div className="bg-[#e9dbc7] rounded-2xl border border-[#d2bfa3] shadow-lg p-8 max-w-2xl w-full relative">
    <h2 className="text-2xl font-semibold text-[var(--color-dark)] mb-6 flex items-center gap-2">
      <span className="material-icons text-lg align-middle cursor-pointer mr-2" onClick={() => navigate(-1)}>arrow_back</span>
      Creer une offre de stage
    </h2>
          {offers.length > 0 && (
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-light)]">Mes offres de stage</h1>
              <button
                onClick={handleCreateOffer}
                className="bg-[var(--color-vert)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition"
              >
                Créer une offre
              </button>
            </div>
          )}

          {offers.length === 0 ? (
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
            <div className="grid gap-6">
              {offers.map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[var(--color-dark)] mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-[var(--color-dark)] mb-3 line-clamp-2">
                        {offer.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--color-dark)]">
                        <span>📅 {offer.startDate} - {offer.endDate}</span>
                        <span>🏢 {offer.domain}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          offer.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.status === 'APPROVED' ? 'Approuvée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/entreprise/offres/${offer.id}`)}
                        className="px-4 py-2 bg-[var(--color-vert)] text-white rounded-lg hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => navigate(`/entreprise/offres/${offer.id}/edit`)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListeOffresEntreprise;