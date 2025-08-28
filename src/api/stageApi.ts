import { api, getAuthHeaders } from './api';
import type { OfferResponseDto } from '../types/offer';

// Note: Les endpoints /offers/{id} ne sont pas disponibles dans le backend
// Utiliser les endpoints spécifiques par rôle à la place

// Récupère le détail d'une offre (endpoint non disponible)
export async function getOfferDetail(offerId: number): Promise<OfferResponseDto> {
  if (!Number.isInteger(offerId) || offerId <= 0) {
    throw new Error('ID d\'offre invalide - doit être un entier positif');
  }
  // Endpoint non disponible dans le backend
  throw new Error('Endpoint non disponible - utiliser les endpoints spécifiques par rôle');
}

// Ajout: recherche le détail d'offre en parcourant les listes disponibles selon le rôle
export async function getStageDetail(offerId: number): Promise<OfferResponseDto> {
  if (!Number.isInteger(offerId) || offerId <= 0) {
    throw new Error('ID d\'offre invalide - doit être un entier positif');
  }

  const tryEndpoints = [
    () => api.get('/api/student/offersByApprovedStatus', { headers: getAuthHeaders() }),
    () => api.get('/api/teacher/offerToReview', { headers: getAuthHeaders() }),
    () => api.get('/api/enterprise/listOfOffers', { headers: getAuthHeaders() })
  ];

  for (const fetcher of tryEndpoints) {
    try {
      const { data } = await fetcher();
      if (Array.isArray(data)) {
        const found = data.find((o: OfferResponseDto) => Number(o.id) === Number(offerId));
        if (found) return found as OfferResponseDto;
      }
    } catch {
      // ignore and try next
    }
  }

  return {
    id: offerId,
    title: 'Offre de stage (mock)',
    description: 'Description indisponible. Données mock en attendant l\'API.',
    domain: 'Général',
    typeOfInternship: 'Perfectionnement',
    job: 'Stagiaire',
    requirements: 'Aucun',
    numberOfPlaces: '1',
    durationOfInternship: 3,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    status: 'APPROVED',
    paying: false,
    remote: false,
    enterprise: {
      id: 0,
      name: 'Entreprise (mock)',
      email: 'mock@example.com',
      sectorOfActivity: 'Services',
      inPartnership: true,
      matriculation: 'MOCK-000',
      country: 'Cameroun',
      city: 'Yaoundé',
      hasLogo: { hasLogo: false }
    },
    convention: undefined
  } as OfferResponseDto;
}

// Télécharge la convention de stage (utilise l'endpoint existant)
export async function downloadConvention(offerId: number): Promise<Blob> {
  try {
    if (!Number.isInteger(offerId) || offerId <= 0) {
      throw new Error('ID d\'offre invalide - doit être un entier positif');
    }
    const { data } = await api.get(`/downloadFiles/downloadConvention/${offerId}`, {
      responseType: 'blob',
      headers: getAuthHeaders()
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Convention non trouvée pour cette offre');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 403) {
      throw new Error('Accès non autorisé à cette convention');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de la convention');
  }
}

// Soumet une candidature avec CV et lettre de motivation
export async function submitApplication(offerId: number, cvFile: File, coverLetterFile: File): Promise<void> {
  try {
    if (!Number.isInteger(offerId) || offerId <= 0) {
      throw new Error('ID d\'offre invalide - doit être un entier positif');
    }
    if (!cvFile || cvFile.size === 0) {
      throw new Error('Fichier CV requis et non vide');
    }
    if (!coverLetterFile || coverLetterFile.size === 0) {
      throw new Error('Fichier lettre de motivation requis et non vide');
    }
    if (cvFile.type !== 'application/pdf') {
      throw new Error('Le CV doit être au format PDF');
    }
    if (coverLetterFile.type !== 'application/pdf') {
      throw new Error('La lettre de motivation doit être au format PDF');
    }

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('coverLetter', coverLetterFile);

    await api.post(`/api/student/${offerId}/createApplication`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders()
      },
    });
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Données de candidature invalides');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 409) {
      throw new Error('Vous avez déjà postulé pour cette offre');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la soumission de la candidature');
  }
}