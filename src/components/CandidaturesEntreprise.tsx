import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getEnterpriseOffers } from '../api/enterpriseApi';
import EntrepriseHeader from './EnterpriseHeader';
import type { OfferResponseDto } from '../types/offer';

// API à ajouter dans enterpriseApi.ts : getOfferApplications(offerId)
// (voir étape suivante pour l'implémentation API)
import { getOfferApplications } from '../api/enterpriseApi';

type Application = {
  id: number;
  student: {
    id: number;
    name: string;
    email: string;
    cvUrl?: string;
    coverLetterUrl?: string;
    avatarUrl?: string;
  };
  status: string;
  createdAt: string;
};

const CandidaturesEntreprise: React.FC = () => {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<Record<number, Application[]>>({});
  const [appsLoading, setAppsLoading] = useState<Record<number, boolean>>({});
  const [appsError, setAppsError] = useState<Record<number, string | null>>({});

  useEffect(() => {
    setLoading(true);
    getEnterpriseOffers()
      .then(setOffers)
      .catch(() => setError('Erreur lors du chargement des offres'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Pour chaque offre, charger les candidatures
    offers.forEach((offer) => {
      setAppsLoading((prev) => ({ ...prev, [offer.id]: true }));
      getOfferApplications(offer.id)
        .then((apps) => {
          setApplications((prev) => ({ ...prev, [offer.id]: apps }));
          setAppsError((prev) => ({ ...prev, [offer.id]: null }));
        })
        .catch(() => {
          setAppsError((prev) => ({ ...prev, [offer.id]: 'Erreur lors du chargement des candidatures' }));
        })
        .finally(() => {
          setAppsLoading((prev) => ({ ...prev, [offer.id]: false }));
        });
    });
  }, [offers]);

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EntrepriseHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <div className="w-full flex justify-center items-start mt-8">
          <div className="bg-[#e9dbc7] rounded-2xl border border-[#d2bfa3] shadow-lg p-8 max-w-3xl w-full relative">
            <h2 className="text-2xl font-semibold text-[var(--color-dark)] mb-6">Candidatures reçues</h2>
            {loading ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement...</div>
            ) : error ? (
              <div className="text-center text-red-600 font-medium">{error}</div>
            ) : offers.length === 0 ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre publiée</div>
            ) : (
              <div className="flex flex-col gap-8">
                {offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] p-6"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-[var(--color-dark)]">{offer.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-jaune)] text-[var(--color-dark)]">
                        {offer.domain}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--color-dark)] mb-4">{offer.description}</div>
                    <div className="mt-2">
                      <h4 className="font-semibold mb-2">Candidatures&nbsp;:</h4>
                      {appsLoading[offer.id] ? (
                        <div className="text-xs text-gray-500">Chargement des candidatures...</div>
                      ) : appsError[offer.id] ? (
                        <div className="text-xs text-red-600">{appsError[offer.id]}</div>
                      ) : (applications[offer.id]?.length ?? 0) === 0 ? (
                        <div className="text-xs text-gray-600">Aucune candidature reçue pour cette offre.</div>
                      ) : (
                        <ul className="flex flex-col gap-3">
                          {applications[offer.id].map((app) => (
                            <li key={app.id} className="flex items-center gap-4 bg-[#f5ede3] rounded p-3 border border-[#e1d3c1]">
                              <img
                                src={app.student.avatarUrl || '/avatar-placeholder.png'}
                                alt={app.student.name}
                                className="w-10 h-10 rounded-full object-cover border"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{app.student.name}</div>
                                <div className="text-xs text-gray-500">{app.student.email}</div>
                              </div>
                              <div className="flex gap-2">
                                {app.student.cvUrl && (
                                  <a href={app.student.cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-vert)] underline">CV</a>
                                )}
                                {app.student.coverLetterUrl && (
                                  <a href={app.student.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-jaune)] underline">Lettre</a>
                                )}
                              </div>
                              <span className="text-xs px-2 py-1 rounded bg-gray-200 ml-3">{app.status}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidaturesEntreprise;
