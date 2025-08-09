import React, { useEffect, useState } from 'react';
import TeacherHeader from './TeacherHeader';
// import { getOffersToReviewByDepartment, ... } from '../api/teacherApi'; // à activer pour la connexion API

// TODO: Créer les interfaces/types pour les offres, stats, notifications, etc.

// Mock data pour visualisation
const mockOffers = [
  {
    id: 1,
    title: 'Développeur React',
    description: 'Développement d’une application web pour la gestion des stages.',
    domain: 'Informatique',
    typeOfInternship: 'Stage conventionné',
    status: 'PENDING',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
  },
  {
    id: 2,
    title: 'Assistant RH',
    description: 'Participation au recrutement et gestion administrative.',
    domain: 'Gestion',
    typeOfInternship: 'Stage classique',
    status: 'APPROVED',
    startDate: '2025-10-01',
    endDate: '2026-01-15',
  },
  {
    id: 3,
    title: 'Technicien maintenance',
    description: 'Maintenance préventive et curative sur équipements industriels.',
    domain: 'Mécanique',
    typeOfInternship: 'Stage ouvrier',
    status: 'REJECTED',
    startDate: '2025-08-15',
    endDate: '2025-11-15',
  },
];

const DashboardEnseignant: React.FC = () => {
  // States pour les données dynamiques (offres, stats, notifications...)
  // const [offers, setOffers] = useState<OfferToReviewDto[]>([]);
  // const [stats, setStats] = useState<StatsDto | null>(null);
  // const [notifications, setNotifications] = useState<NotificationDto[]>([]);

  // useEffect(() => {
  //   getOffersToReviewByDepartment().then(setOffers);
  //   // Charger stats et notifications ici
  // }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a1125] to-[#2e1447] flex flex-col">
      <TeacherHeader />
      <main className="flex flex-1 w-full max-w-[1280px] mx-auto pt-8">
        {/* Filtres à gauche */}
        <aside className="w-64 pr-8">
          {/* TODO: Filtres (switch, checkbox, etc.) */}
          <div className="bg-[#21182a] rounded-lg p-6 shadow-lg text-[var(--color-light)]">
            <div className="font-semibold mb-4 text-[var(--color-jaune)]">Filtrer</div>
            {/* Filtres UI statiques */}
            <form className="flex flex-col gap-6">
              {/* Switch: Afficher uniquement les offres avec convention */}
              <div className="flex items-center justify-between">
                <label htmlFor="withConvention" className="text-sm">Avec convention</label>
                <input
                  id="withConvention"
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[var(--color-jaune)] bg-[#2e1447] border-gray-400 rounded focus:ring-0"
                  disabled
                />
              </div>
              {/* Switch: Afficher uniquement les offres en attente */}
              <div className="flex items-center justify-between">
                <label htmlFor="pendingOnly" className="text-sm">En attente</label>
                <input
                  id="pendingOnly"
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[var(--color-jaune)] bg-[#2e1447] border-gray-400 rounded focus:ring-0"
                  disabled
                />
              </div>
              {/* Dropdown: Domaine */}
              <div className="flex flex-col gap-1">
                <label htmlFor="domaine" className="text-sm mb-1">Domaine</label>
                <select
                  id="domaine"
                  className="rounded bg-[#2e1447] border border-gray-400 py-1 px-2 text-[var(--color-light)] focus:outline-none"
                  disabled
                >
                  <option value="">Tous</option>
                  <option value="informatique">Informatique</option>
                  <option value="mécanique">Mécanique</option>
                  <option value="gestion">Gestion</option>
                  {/* ... autres domaines */}
                </select>
              </div>
              {/* Checkbox: Offres longues (> 3 mois) */}
              <div className="flex items-center justify-between">
                <label htmlFor="longDuration" className="text-sm">Stage &gt; 3 mois</label>
                <input
                  id="longDuration"
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[var(--color-jaune)] bg-[#2e1447] border-gray-400 rounded focus:ring-0"
                  disabled
                />
              </div>
            </form>
          </div>
        </aside>
        {/* Contenu principal */}
        <section className="flex-1 flex flex-col">
          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Saisir ici pour recherchez un stage"
            className="mb-8 px-6 py-2 rounded bg-white text-[var(--color-dark)] shadow focus:outline-none w-full max-w-xl self-center"
            // onChange={...}
          />
          {/* Liste des offres à valider (cards) */}
          <div className="flex flex-col gap-8">
            {mockOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#251b34] rounded-lg shadow-lg p-6 flex flex-col gap-2 border border-[#2e1447]"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xl font-semibold text-[var(--color-jaune)]">{offer.title}</div>
                  <span
                    className={
                      `px-3 py-1 rounded-full text-xs font-bold ` +
                      (offer.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : offer.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-800')
                    }
                  >
                    {offer.status === 'APPROVED'
                      ? 'Acceptée'
                      : offer.status === 'REJECTED'
                      ? 'Refusée'
                      : 'En attente'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 items-center text-sm text-[var(--color-light)]">
                  <div>
                    <span className="font-medium">Domaine :</span> {offer.domain}
                  </div>
                  <div>
                    <span className="font-medium">Type :</span> {offer.typeOfInternship}
                  </div>
                  <div>
                    <span className="font-medium">Début :</span> {offer.startDate}
                  </div>
                  <div>
                    <span className="font-medium">Fin :</span> {offer.endDate}
                  </div>
                </div>
                <div className="mt-2 text-[var(--color-light)] text-sm">
                  {offer.description}
                </div>
                {/* Actions à venir (valider/refuser) */}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardEnseignant;
