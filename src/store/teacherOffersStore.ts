import { create } from 'zustand';

// Types pour les offres côté enseignant
export interface TeacherOffer {
  id: number;
  title: string;
  description: string;
  domain: string;
  job: string;
  typeOfInternship: string;
  startDate: string;
  endDate: string;
  numberOfPlaces: string;
  durationOfInternship: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  enterprise: {
    id: number;
    name: string;
    companyName?: string;
    sector?: string;
  };
}

export interface Application {
  id: number;
  studentName: string;
  studentEmail: string;
  cvUrl?: string;
  coverLetterUrl?: string;
  submittedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  offerId: number;
}

// Mock data pour les enseignants
const mockTeacherOffers: TeacherOffer[] = [
  {
    id: 1,
    title: 'Implémentation du paiement en ligne',
    description: 'Développement d\'une solution de paiement en ligne pour EG store.',
    domain: 'web dev',
    job: 'Développeur Full-Stack',
    typeOfInternship: 'Perfectionnement',
    startDate: '2025-06-10',
    endDate: '2025-09-10',
    numberOfPlaces: '2',
    durationOfInternship: 3,
    status: 'PENDING',
    enterprise: {
      id: 1,
      name: 'EG store',
      companyName: 'EG store Solutions',
      sector: 'Vente d\'appareils',
    },
  },
  {
    id: 2,
    title: 'Assistant marketing digital',
    description: 'Support dans la stratégie marketing digital et réseaux sociaux.',
    domain: 'marketing',
    job: 'Assistant Marketing',
    typeOfInternship: 'Initiation',
    startDate: '2025-07-01',
    endDate: '2025-10-01',
    numberOfPlaces: '1',
    durationOfInternship: 3,
    status: 'APPROVED',
    enterprise: {
      id: 2,
      name: 'Digital Corp',
      companyName: 'Digital Marketing Solutions',
      sector: 'Marketing digital',
    },
  },
  {
    id: 3,
    title: 'Développeur mobile React Native',
    description: 'Création d\'applications mobiles avec React Native.',
    domain: 'mobile dev',
    job: 'Développeur Mobile',
    typeOfInternship: 'Pré-emploi',
    startDate: '2025-08-01',
    endDate: '2025-12-01',
    numberOfPlaces: '3',
    durationOfInternship: 4,
    status: 'REJECTED',
    enterprise: {
      id: 3,
      name: 'MobileTech',
      companyName: 'MobileTech Innovation',
      sector: 'Technologie mobile',
    },
  },
];

// Mock applications
const mockApplications: Application[] = [
  { 
    id: 1, 
    studentName: 'Jean Dupont', 
    studentEmail: 'jean.dupont@univ.com', 
    submittedAt: '2025-03-01', 
    status: 'PENDING',
    offerId: 1
  },
  { 
    id: 2, 
    studentName: 'Marie Martin', 
    studentEmail: 'marie.martin@univ.com', 
    submittedAt: '2025-03-02', 
    status: 'PENDING',
    offerId: 1
  },
  { 
    id: 3, 
    studentName: 'Pierre Durand', 
    studentEmail: 'pierre.durand@univ.com', 
    submittedAt: '2025-03-03', 
    status: 'ACCEPTED',
    offerId: 1
  },
];

interface TeacherOffersState {
  // États
  offers: TeacherOffer[];
  applications: Application[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // Actions pour les offres
  fetchOffers: () => Promise<void>;
  getOfferById: (id: number) => TeacherOffer | undefined;
  approveOffer: (id: number) => Promise<void>;
  rejectOffer: (id: number) => Promise<void>;
  updateOfferStatus: (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  
  // Actions pour les candidatures
  fetchApplications: (offerId: number) => Promise<void>;
  getApplicationsByOfferId: (offerId: number) => Application[];
  acceptApplication: (applicationId: number) => Promise<void>;
  rejectApplication: (applicationId: number) => Promise<void>;
  
  // Actions pour les filtres et recherche
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  getFilteredOffers: () => TeacherOffer[];
  
  // Actions générales
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTeacherOffersStore = create<TeacherOffersState>((set, get) => ({
  // États initiaux
  offers: [],
  applications: [],
  loading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'ALL',
  
  // Actions pour les offres
  fetchOffers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/teacher/offerToReview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Erreur API');
      
      const offers = await response.json();
      set({ offers, loading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      set({ error: 'Erreur lors du chargement des offres', loading: false });
      // Fallback sur les données mock
      set({ offers: mockTeacherOffers });
    }
  },
  
  getOfferById: (id: number) => {
    return get().offers.find(offer => offer.id === id);
  },
  
  approveOffer: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/teacher/offers/${id}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offerApproved: true, conventionApproved: true })
      });
      
      if (!response.ok) throw new Error('Erreur API');
      
      get().updateOfferStatus(id, 'APPROVED');
      set({ loading: false });
    } catch (error) {
      set({ error: 'Erreur lors de l\'approbation de l\'offre', loading: false });
    }
  },
  
  rejectOffer: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/teacher/offers/${id}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offerApproved: false, conventionApproved: false })
      });
      
      if (!response.ok) throw new Error('Erreur API');
      
      get().updateOfferStatus(id, 'REJECTED');
      set({ loading: false });
    } catch (error) {
      set({ error: 'Erreur lors du refus de l\'offre', loading: false });
    }
  },
  
  updateOfferStatus: (id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    set(state => ({
      offers: state.offers.map(offer =>
        offer.id === id ? { ...offer, status } : offer
      )
    }));
  },
  
  // Actions pour les candidatures
  fetchApplications: async (offerId: number) => {
    set({ loading: true, error: null });
    try {
      // Simulation d'appel API
      // const response = await getApplicationsForOffer(offerId);
      // set({ applications: response.data, loading: false });
      
      // Mock pour l'instant
      setTimeout(() => {
        const filteredApplications = mockApplications.filter(app => app.offerId === offerId);
        set({ applications: filteredApplications, loading: false });
      }, 500);
    } catch (error) {
      set({ error: 'Erreur lors du chargement des candidatures', loading: false });
      set({ applications: mockApplications.filter(app => app.offerId === offerId) });
    }
  },
  
  getApplicationsByOfferId: (offerId: number) => {
    return get().applications.filter(app => app.offerId === offerId);
  },
  
  acceptApplication: async (applicationId: number) => {
    set({ loading: true, error: null });
    try {
      // Simulation d'appel API
      // await acceptApplicationAPI(applicationId);
      
      setTimeout(() => {
        set(state => ({
          applications: state.applications.map(app =>
            app.id === applicationId ? { ...app, status: 'ACCEPTED' } : app
          ),
          loading: false
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Erreur lors de l\'acceptation de la candidature', loading: false });
    }
  },
  
  rejectApplication: async (applicationId: number) => {
    set({ loading: true, error: null });
    try {
      // Simulation d'appel API
      // await rejectApplicationAPI(applicationId);
      
      setTimeout(() => {
        set(state => ({
          applications: state.applications.map(app =>
            app.id === applicationId ? { ...app, status: 'REJECTED' } : app
          ),
          loading: false
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Erreur lors du refus de la candidature', loading: false });
    }
  },
  
  // Actions pour les filtres et recherche
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },
  
  setStatusFilter: (filter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    set({ statusFilter: filter });
  },
  
  getFilteredOffers: () => {
    const { offers, searchTerm, statusFilter } = get();
    
    return offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.enterprise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  },
  
  // Actions générales
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
  
  reset: () => {
    set({
      offers: [],
      applications: [],
      loading: false,
      error: null,
      searchTerm: '',
      statusFilter: 'ALL',
    });
  },
}));
