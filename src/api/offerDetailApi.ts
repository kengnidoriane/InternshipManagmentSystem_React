import { api, getAuthHeaders } from './api';
import type { OfferResponseDto } from '../types/offer';

// Note: Endpoint générique pour récupérer les détails d'une offre
// Utilise les endpoints spécifiques par rôle selon le contexte

// Récupérer les détails d'une offre (via les endpoints existants)
export const getOfferById = async (offerId: number): Promise<OfferResponseDto> => {
  try {
    if (!Number.isInteger(offerId) || offerId <= 0) {
      throw new Error('ID d\'offre invalide - doit être un entier positif');
    }
    
    // Cette fonction doit être utilisée avec les endpoints spécifiques :
    // - Pour les étudiants: /api/student/offersByApprovedStatus
    // - Pour les entreprises: /api/enterprise/listOfOffers  
    // - Pour les enseignants: /api/teacher/offerToReview
    
    throw new Error('Utiliser les endpoints spécifiques par rôle pour récupérer les offres');
  } catch (error) {
    throw error;
  }
};

// Télécharger la convention d'une offre
export const downloadConvention = async (offerId: number) => {
  try {
    if (!Number.isInteger(offerId) || offerId <= 0) {
      throw new Error('ID d\'offre invalide - doit être un entier positif');
    }
    return await api.get(`/downloadFiles/downloadConvention/${offerId}`, {
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Convention non trouvée pour cette offre');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de la convention');
  }
};