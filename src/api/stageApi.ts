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

// Recherche le détail d'offre en parcourant les listes disponibles selon le rôle
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
        if (found) {

          return found as OfferResponseDto;
        }
      }
    } catch (error) {
      console.log('Erreur endpoint:', error);
    }
  }

  throw new Error(`Offre avec l'ID ${offerId} non trouvée`);
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

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('coverLetter', coverLetterFile);

    console.log('Submitting application:', {
      offerId,
      cvFile: cvFile.name,
      coverLetterFile: coverLetterFile.name,
      cvSize: cvFile.size,
      coverLetterSize: coverLetterFile.size
    });

    await api.post(`/api/student/${offerId}/createApplication`, formData, {
      headers: {
        ...getAuthHeaders()
        // Ne pas définir Content-Type manuellement pour multipart/form-data
      },
    });
  } catch (error: any) {
    console.error('Application submission error:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error(error.response?.data || 'Données de candidature invalides');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 403) {
      throw new Error('Vous ne pouvez plus candidater car vous êtes déjà en stage.');
    }
    if (error.response?.status === 409) {
      throw new Error('Vous avez déjà postulé pour cette offre');
    }
    if (error.response?.status === 500) {
      throw new Error(error.response?.data || 'Erreur serveur lors de la soumission');
    }
    throw new Error(error.response?.data || error.message || 'Erreur lors de la soumission de la candidature');
  }
}