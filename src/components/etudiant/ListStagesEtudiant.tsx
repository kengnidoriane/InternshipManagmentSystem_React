import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EtudiantHeader from '../EtudiantHeader';
import EnterpriseLogo from '../entreprise/EnterpriseLogo';
import { useStudentStatus } from '../../hooks/useStudentStatus';

import { getApprovedOffers } from '../../api/studentApi';
import type { OfferResponseDto } from '../../types/offer';

// Mock data au format backend (fallback si API vide)
const mockOffers: OfferResponseDto[] = [
  {
    id: 1,
    title: 'Implémentation du paiement en ligne',
    description: 'Développement d’une solution de paiement en ligne pour EG store.',
    domain: 'web dev',
    startDate: '2025-06-10',
    endDate: '2025-09-10',
    status: 'Ouvert',
    enterprise: {
      id: 1,
      name: 'EG store',
      email: 'eg@store.com',
      sectorOfActivity: 'Vente d’appareils',
      matriculation: 'EG12345',
      country: 'Nigeria',
      city: 'Lagos',
      hasLogo: { hasLogo: false },
      inPartnership: true,
    },
    convention: undefined,
    typeOfInternship: 'Perfectionnement',
    job: 'Développeur',
    requirements: 'Avoir un PC',
    numberOfPlaces: '2',
    durationOfInternship: 3,
    paying: true,
    remote: false,
  },
];



export default function ListStagesEtudiant() {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnInternship } = useStudentStatus();
  const [filters, setFilters] = useState({
    remote: null as boolean | null,
    paying: null as boolean | null,
    typeOfInternship: [] as string[]
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getApprovedOffers();
        const apiOffers = response?.data as OfferResponseDto[] | undefined;
        setOffers(apiOffers || []);
        setError(null);
      } catch (err: any) {
        console.error('Erreur lors du chargement des offres:', err);
        setError('Erreur lors du chargement des offres. Veuillez réessayer.');
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrage complet
  const filteredOffers = offers.filter(offer => {
    // Filtre de recherche
    const matchesSearch = offer.title.toLowerCase().includes(search.toLowerCase()) ||
      offer.enterprise.name.toLowerCase().includes(search.toLowerCase());
    
    // Filtre remote
    const matchesRemote = filters.remote === null || offer.remote === filters.remote;
    
    // Filtre payant
    const matchesPaying = filters.paying === null || offer.paying === filters.paying;
    
    // Filtre type de stage
    const matchesType = filters.typeOfInternship.length === 0 || 
      filters.typeOfInternship.includes(offer.typeOfInternship || '');
    
    return matchesSearch && matchesRemote && matchesPaying && matchesType;
  });

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EtudiantHeader />
      <main className="mt-5 flex flex-row items-start justify-center flex-1 px-4 gap-8">
        {/* Sidebar de filtres */}
        <aside className="hidden md:flex flex-col items-start min-w-[210px] max-w-[260px] mt-12 mr-4 rounded-xl shadow-lg px-7 py-8 gap-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--color-neutre9)] text-base">Filtres</span>
            <button 
              onClick={() => setFilters({ remote: null, paying: null, typeOfInternship: [] })}
              className="text-xs text-[#b79056] hover:underline ml-auto"
            >
              Réinitialiser
            </button>
          </div>
          <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Location</div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)] cursor-pointer">
                <input 
                  type="radio" 
                  name="remote" 
                  checked={filters.remote === true}
                  onChange={() => setFilters(prev => ({ ...prev, remote: prev.remote === true ? null : true }))}
                  className="accent-[#b79056]" 
                />
                En remote
              </label>
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)] cursor-pointer">
                <input 
                  type="radio" 
                  name="remote" 
                  checked={filters.remote === false}
                  onChange={() => setFilters(prev => ({ ...prev, remote: prev.remote === false ? null : false }))}
                  className="accent-[#b79056]" 
                />
                Sur site
              </label>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Payant</div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)] cursor-pointer">
                <input 
                  type="radio" 
                  name="paying" 
                  checked={filters.paying === false}
                  onChange={() => setFilters(prev => ({ ...prev, paying: prev.paying === false ? null : false }))}
                  className="accent-[#b79056]" 
                />
                Non
              </label>
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)] cursor-pointer">
                <input 
                  type="radio" 
                  name="paying" 
                  checked={filters.paying === true}
                  onChange={() => setFilters(prev => ({ ...prev, paying: prev.paying === true ? null : true }))}
                  className="accent-[#b79056]" 
                />
                Oui
              </label>
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Type de stage</div>
            <div className="flex flex-col gap-1">
              {['Initiation', 'Perfectionnement', 'Pré-emploi'].map(type => (
                <label key={type} className="flex items-center gap-2 text-xs text-[var(--color-neutre9)] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={filters.typeOfInternship.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, typeOfInternship: [...prev.typeOfInternship, type] }));
                      } else {
                        setFilters(prev => ({ ...prev, typeOfInternship: prev.typeOfInternship.filter(t => t !== type) }));
                      }
                    }}
                    className="accent-[#b79056]" 
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </aside>
        {/* Section recherche + offres */}
        <section className="flex-1 w-full max-w-[800px] mt-8">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Saisir ici pour rechercher un stage"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full mb-5 px-2 py-1 border-none bg-[var(--color-neutre95)] text-[var(--color-neutre2-paragraphe)] text-base text-center shadow focus:outline-none focus:ring-2 focus:ring-[#b79056] placeholder-[var(--color-neutre2-paragraphe)]"
              style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
            />
            <div className="flex flex-col gap-7">
              {loading ? (
                <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement des offres...</div>
              ) : isOnInternship ? (
                <div className="py-16 text-center text-[var(--color-jaune)] text-lg">
                  Vous êtes déjà en stage. Vous ne pouvez plus consulter les offres disponibles.
                </div>
              ) : error ? (
                <div className="py-16 text-center text-red-500 text-lg">{error}</div>
              ) : offers.length === 0 ? (
                <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre disponible pour le moment.</div>
              ) : filteredOffers.length === 0 ? (
                <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre trouvée pour votre recherche.</div>
              ) : (
                filteredOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    className="flex flex-row items-stretch bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:bg-[var(--color-light)] transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate(`/stage/${offer.id}`)}
                  >
                  {/* Colonne gauche : logo, entreprise, pays, ville, secteur */}
                  <div className="flex flex-col items-center justify-center w-32 min-w-[175px] bg-[var(--color-light)] border-l-[var(--color-emraude)] p-3">
                    <EnterpriseLogo 
                      enterpriseName={offer.enterprise.name}
                      enterpriseId={offer.enterprise.id}
                      hasLogo={offer.enterprise.hasLogo?.hasLogo}
                      size="xl"
                      className="mb-2"
                    />
                    <div className="text-xs text-[var(--color-dark)] font-semibold text-center">{offer.enterprise?.name || 'Entreprise'}</div>
                    <div className="text-[10px] text-[var(--color-dark)] mt-1">{offer.enterprise?.country || 'Pays'} · {offer.enterprise?.city || 'Ville'}</div>
                    <div className="text-[10px] text-[var(--color-dark)] mt-1">{offer.enterprise?.sectorOfActivity || 'Secteur'}</div>
                  </div>
                  {/* Centre : titre, deadline, type, période, badges */}
                  <div className="flex-1 flex flex-col justify-between py-4">
                    <div className="flex flex-col pb-2">
                      <div className="font-semibold text-[var(--color-dark)] text-lg md:text-lg">{offer.title}</div>
                      {/* <span className="ml-2 text-xs text-[var(--color-dark)]">Délai de candidature <b>2 mars 2025</b></span> */}
                    </div>
                    <div className="flex flex-col gap-1 mt-2 mb-2 flex-wrap">
                      <div className="text-xs text-[var(--color-dark)]">Type de stage : <b>{offer.typeOfInternship || 'Non spécifié'}</b></div>
                      <div className="text-xs text-[var(--color-dark)]">Stage payant : <b>{offer.paying ? 'OUI' : 'NON'}</b></div>
                      <div className="text-xs text-[var(--color-dark)]">Période du stage : <b>{offer.startDate} - {offer.endDate}</b></div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 mt-1 ">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">
                        {offer.remote ? 'En remote' : 'Sur site'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">
                        {offer.paying ? 'Payant' : 'Non payant'}
                      </span>
                    </div>
                  </div>
                  {/* Colonne droite : places, postulants, domaine, tags */}
                  <div className="flex flex-col max-w-[243px] bg-[var(--color-light)] p-4 border-l border-dashed border-[var(--color-neutre6-placeholder)]">
              
                      <div className="text-xs text-[var(--color-dark)] mb-1">Nombre de place: <b>{offer.numberOfPlaces}</b></div>
                      <div className="text-xs text-[var(--color-dark)] mb-1">Domaine: <b>{offer.domain}</b></div>
                    
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
