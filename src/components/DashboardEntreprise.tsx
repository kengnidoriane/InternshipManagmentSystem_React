import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOffers } from '../api/enterpriseApi';
import type { OfferResponseDto } from '../types/offer';
import EnterpriseHeader from './EnterpriseHeader';

const DashboardEntreprise: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyOffers()
      .then((res) => setOffers(res.data))
      .catch(() => setError('Erreur lors du chargement des offres'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-login-gradient"
    >
      <EnterpriseHeader />
      <main className="">
        <div className="box">
          <h2>Gérez vos offres de stage</h2>
          <p>
            Retrouvez ici toutes vos offres de stage, vos candidatures reçues et créez de nouvelles opportunités pour les étudiants.
          </p>
          <button
            className="create-btn"
            onClick={() => navigate('/entreprise/creer-offre')}
          >
            Créer une offre
          </button>
          <div className="offers-list">
            <h3>Vos offres publiées</h3>
            {loading ? (
              <div>Chargement...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : offers.length === 0 ? (
              <div>Aucune offre publiée pour le moment.</div>
            ) : (
              <ul>
                {offers.map((offer) => (
                  <li key={offer.id} className="offer-item">
                    <strong>{offer.title}</strong> — {offer.domain} <br />
                    <span>{offer.startDate} → {offer.endDate}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardEntreprise;
