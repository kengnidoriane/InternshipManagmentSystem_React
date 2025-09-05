import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from './TeacherHeader';
import { getOffersToReviewByDepartment } from '../../api/teacherApi';
import TeacherOfferCard from './TeacherOfferCard';
import type { OfferResponseDto } from '../../types/offer';

export default function OffersList() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'REMOTE' | 'ONSITE'>('ALL');
  const [payingFilter, setPayingFilter] = useState<'ALL' | 'PAYING' | 'NON_PAYING'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Initiation' | 'Perfectionnement' | 'Pré-emploi'>('ALL');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await getOffersToReviewByDepartment();
        console.log('=== OFFERS RESPONSE ===');
        console.log('Response:', response);
        console.log('Data:', response.data);
        setOffers(response.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
    
    // Recharger les offres quand on revient sur la page
    const handleFocus = () => fetchOffers();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.enterprise?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
    const matchesLocation = locationFilter === 'ALL' || 
      (locationFilter === 'REMOTE' && offer.remote) ||
      (locationFilter === 'ONSITE' && !offer.remote);
    const matchesPaying = payingFilter === 'ALL' ||
      (payingFilter === 'PAYING' && offer.paying) ||
      (payingFilter === 'NON_PAYING' && !offer.paying);
    const matchesType = typeFilter === 'ALL' || offer.typeOfInternship === typeFilter;
    return matchesSearch && matchesStatus && matchesLocation && matchesPaying && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200';
      case 'APPROVED':
        return 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200';
      case 'REJECTED':
        return 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200';
      default:
        return 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvé';
      case 'REJECTED': return 'Refusé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col gap-5">
      <TeacherHeader />
      <main className="flex flex-row items-start justify-center flex-1 px-4 pb-12 gap-8">
        {/* Sidebar de filtres */}
        <aside className="hidden md:flex flex-col items-start min-w-[210px] max-w-[260px] mr-4 rounded-xl shadow-lg px-7 py-8 gap-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--color-neutre9)] text-base">Filter</span>
            {/* <label className="inline-flex relative items-center cursor-pointer ml-2">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-7 h-3 bg-gray-200 rounded-full peer peer-focus:ring-1 peer-focus:ring-[#b79056] dark:bg-gray-700 peer-checked:bg-[#b79056] after:content-[''] after:absolute after:top-0.8 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-[#b79056]" />
            </label> */}
          </div>
          
          {/* Filtre par statut */}
          {/* <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Statut</div>
            <div className="flex flex-col gap-1">
              {[
                { key: 'ALL', label: 'Toutes' },
                { key: 'PENDING', label: 'En attente' },
                { key: 'APPROVED', label: 'Approuvées' },
                { key: 'REJECTED', label: 'Refusées' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={statusFilter === key}
                    onChange={() => setStatusFilter(key as any)}
                    className="accent-[#b79056]" 
                  />
                  {label}
                </label>
              ))}
            </div>
          </div> */}

          <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Location</div>
            <div className="flex flex-col gap-1">
              {[
                { key: 'ALL', label: 'Toutes' },
                { key: 'REMOTE', label: 'En remote' },
                { key: 'ONSITE', label: 'Sur site' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]">
                  <input 
                    type="radio" 
                    name="location" 
                    checked={locationFilter === key}
                    onChange={() => setLocationFilter(key as any)}
                    className="accent-[#b79056]" 
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Payant</div>
            <div className="flex flex-col gap-1">
              {[
                { key: 'ALL', label: 'Toutes' },
                { key: 'NON_PAYING', label: 'Non payant' },
                { key: 'PAYING', label: 'Payant' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]">
                  <input 
                    type="radio" 
                    name="paying" 
                    checked={payingFilter === key}
                    onChange={() => setPayingFilter(key as any)}
                    className="accent-[#b79056]" 
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Type de stage</div>
            <div className="flex flex-col gap-1">
              {[
                { key: 'ALL', label: 'Tous' },
                { key: 'Initiation', label: 'Initiation' },
                { key: 'Perfectionnement', label: 'Perfectionnement' },
                { key: 'Pré-emploi', label: 'Pré-emploi' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]">
                  <input 
                    type="radio" 
                    name="internshipType" 
                    checked={typeFilter === key}
                    onChange={() => setTypeFilter(key as any)}
                    className="accent-[#b79056]" 
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Section recherche + offres */}
        <section className="flex-1 w-full max-w-[800px] mt-8">
          <input
            type="text"
            placeholder="Saisir ici pour rechercher une offre"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full mb-5 px-2 py-2 border-none bg-[var(--color-neutre95)] text-[var(--color-neutre2-paragraphe)] text-base text-center shadow focus:outline-none focus:ring-2 focus:ring-[#b79056] placeholder-[var(--color-neutre2-paragraphe)] rounded-lg"
            style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
          />
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement des offres...</div>
            ) : filteredOffers.length === 0 ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre trouvée.</div>
            ) : (
              filteredOffers.map((offer) => (
                <TeacherOfferCard
                  key={offer.id}
                  offer={offer}
                  onClick={() => navigate(`/enseignant/offres/${offer.id}`)}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
