import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from '../TeacherHeader';
import { getOffersToReviewByDepartment } from '../../api/teacherApi';

interface Offer {
  id: number;
  title: string;
  description: string;
  domain: string;
  job: string;
  typeOfInternship: string;
  startDate: string;
  endDate: string;
  numberOfPlaces: string;
  paying: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  enterprise: {
    id: number;
    name: string;
  };
}

export default function OffersList() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

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
      offer.enterprise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <TeacherHeader />
      <main className="flex flex-row items-start justify-center flex-1 px-4 pb-12 gap-8">
        {/* Sidebar de filtres */}
        <aside className="hidden md:flex flex-col items-start min-w-[210px] max-w-[260px] mt-12 mr-4 rounded-xl shadow-lg px-7 py-8 gap-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--color-neutre9)] text-base">Filter</span>
            <label className="inline-flex relative items-center cursor-pointer ml-2">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-7 h-3 bg-gray-200 rounded-full peer peer-focus:ring-1 peer-focus:ring-[#b79056] dark:bg-gray-700 peer-checked:bg-[#b79056] after:content-[''] after:absolute after:top-0.8 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-[#b79056]" />
            </label>
          </div>
          
          {/* Filtre par statut */}
          <div className="mb-4">
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
          </div>

          <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Location</div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="checkbox" disabled className="accent-[#b79056]" />En remote</label>
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="checkbox" disabled className="accent-[#b79056]" />Sur site</label>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Payant</div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="radio" name="payant" disabled className="accent-[#b79056]" />Non</label>
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="radio" name="payant" disabled className="accent-[#b79056]" />Oui</label>
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-neutre9)] font-semibold mb-2">Type de stage</div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="checkbox" disabled className="accent-[#b79056]" />Initiation</label>
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="checkbox" disabled className="accent-[#b79056]" />Perfectionnement</label>
              <label className="flex items-center gap-2 text-xs text-[var(--color-neutre9)]"><input type="checkbox" disabled className="accent-[#b79056]" />Pré-emploi</label>
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
            className="w-full mb-5 px-4 py-2 border-none bg-[var(--color-neutre95)] text-[var(--color-neutre2-paragraphe)] text-base text-center shadow focus:outline-none focus:ring-2 focus:ring-[#b79056] placeholder-[var(--color-neutre2-paragraphe)]"
            style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
          />
          <div className="flex flex-col gap-7">
            {loading ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement des offres...</div>
            ) : filteredOffers.length === 0 ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre trouvée.</div>
            ) : (
              filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex flex-row items-stretch bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:bg-[var(--color-light)] transition-colors cursor-pointer"
                  onClick={() => navigate(`/enseignant/offres/${offer.id}`)}
                >
                  {/* Colonne gauche : logo, entreprise, pays, ville, secteur */}
                  <div className="flex flex-col items-center justify-center w-32 min-w-[175px] bg-[var(--color-light)] border-l-[var(--color-emraude)] p-3">
                    <div className="h-12 w-12 rounded-full mb-2 border border-[#e1d3c1] bg-white flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--color-dark)]">
                        {offer.enterprise.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-dark)] font-semibold text-center">{offer.enterprise.name}</div>
                    <div className="text-[10px] text-[var(--color-dark)] mt-1">Nigeria · Lagos</div>
                    <div className="text-[10px] text-[var(--color-dark)] mt-1">{offer.enterprise.sector}</div>
                  </div>
                  {/* Centre : titre, deadline, type, période, badges */}
                  <div className="flex-1 flex flex-col justify-between py-4">
                    <div className="flex flex-col pb-2">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-semibold text-[var(--color-dark)] text-lg md:text-lg">{offer.title}</div>
                        <span className={getStatusBadge(offer.status)}>
                          {getStatusText(offer.status)}
                        </span>
                      </div>
                      <span className="ml-2 text-xs text-[var(--color-dark)]">Délai de candidature <b>2 mars 2025</b></span>
                    </div>
                    <div className="flex flex-col mt-2 mb-2 flex-wrap">
                      <div className="text-xs text-[var(--color-dark)]">Type de stage : <b>{offer.typeOfInternship}</b></div>
                      <div className="text-xs text-[var(--color-dark)]">Stage payant : <b>OUI</b></div>
                      <div className="text-xs text-[var(--color-dark)]">Période du stage : <b>{offer.startDate} - {offer.endDate}</b></div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 mt-1 ">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        offer.paying 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {offer.paying ? 'Payant' : 'Non payant'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">. En remote</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">.Après interview</span>
                    </div>
                  </div>
                  {/* Colonne droite : places, postulants, domaine, tags */}
                  <div className="flex flex-col justify-between items-end max-w-[243px] bg-[var(--color-light)] p-4 border-l border-dashed border-[var(--color-neutre6-placeholder)]">
                    <div className="mb-2">
                      <div className="text-xs text-[var(--color-dark)]">Nombre de place <b>{offer.numberOfPlaces}</b></div>
                      <div className="text-xs text-[var(--color-dark)]">Nombre de postulants <b>5</b></div>
                      <div className="text-xs text-[var(--color-dark)]">Domaine <b>{offer.domain}</b></div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
        </section>
      </main>
    </div>
  );
}
