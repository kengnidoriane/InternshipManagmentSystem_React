import { api, getAuthHeaders } from './api';
import type { OfferRequestDto } from '../types/offer';
import type { EnterpriseResponseDto } from '../types/enterprise';

// Créer une nouvelle offre (sans convention)
export const createOffer = async (offer: OfferRequestDto) => {
  try {
    if (!offer.title || !offer.description) {
      throw new Error('Titre et description requis');
    }
    const data = {
      title: offer.title || '',
      description: offer.description || '',
      domain: offer.domain || '',
      typeOfInternship: offer.typeOfInternship || '',
      job: offer.job || '',
      requirements: offer.requirements || '',
      numberOfPlaces: parseInt(offer.numberOfPlaces.toString()) || 1,
      paying: offer.paying || false,
      remote: offer.remote || false,
      startDate: offer.startDate || '',
      endDate: offer.endDate || ''
    };
    return await api.post('/api/enterprise/createOffer', data, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Ajouter la convention PDF à une offre existante
export const addConventionToOffer = async (offerId: number, pdfConvention: File) => {
  try {
    if (!offerId || offerId <= 0) {
      throw new Error('ID d\'offre invalide');
    }
    if (!pdfConvention) {
      throw new Error('Fichier PDF requis');
    }
    const formData = new FormData();
    formData.append('pdfConvention', pdfConvention);
    return await api.post(`/api/enterprise/${offerId}/convention`, formData, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer toutes les candidatures de l'entreprise
export const getEnterpriseApplications = () =>
  api.get('/api/enterprise/Applications', { headers: getAuthHeaders() });

// Récupérer les notifications de l'entreprise
export const getEnterpriseNotifications = () =>
  api.get('/api/enterprise/enterpriseNotifications', { headers: getAuthHeaders() });

// Récupérer la liste des offres de l'entreprise
export const getEnterpriseOffers = () =>
  api.get('/api/enterprise/listOfOffers', { headers: getAuthHeaders() });

// Récupérer le logo de l'entreprise
export const getEnterpriseLogo = () =>
  api.get('/profilePhoto/getEnterpriseLogo', { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Uploader une photo de profil
export const uploadProfilePhoto = async (photo: File) => {
  try {
    if (!photo) {
      throw new Error('Fichier photo requis');
    }
    const formData = new FormData();
    formData.append('photo', photo);
    return await api.post('/profilePhoto/upload-photo', formData, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Télécharger le CV d'un candidat
export const downloadCandidateCV = async (applicationId: number) => {
  try {
    if (!applicationId || applicationId <= 0) {
      throw new Error('ID de candidature invalide');
    }
    return await api.get(`/downloadFiles/cv/${applicationId}/download`, { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Télécharger la lettre de motivation d'un candidat
export const downloadCandidateCoverLetter = async (applicationId: number) => {
  try {
    if (!applicationId || applicationId <= 0) {
      throw new Error('ID de candidature invalide');
    }
    return await api.get(`/downloadFiles/coverLetter/${applicationId}/download`, { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Valider ou rejeter une candidature
export const validateApplication = async (applicationId: number, approved: boolean) => {
  try {
    if (!applicationId || applicationId <= 0) {
      throw new Error('ID de candidature invalide');
    }
    return await api.put(`/api/enterprise/application/${applicationId}/validate?approved=${approved}`, {}, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};





// Télécharger la convention d'une offre
export const downloadConvention = async (offerId: number) => {
  try {
    if (!offerId || offerId <= 0) {
      throw new Error('ID d\'offre invalide');
    }
    return await api.get(`/downloadFiles/downloadConvention/${offerId}`, { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Note: getEnterpriseById n'existe pas dans le backend
// Utiliser getPendingEnterprises ou getEnterpriseOffers selon le contexte

// Fonction utilitaire pour récupérer une entreprise par ID (via les offres)
export const getEnterpriseById = async (enterpriseId: number) => {
  try {
    if (!enterpriseId || enterpriseId <= 0) {
      throw new Error('ID d\'entreprise invalide');
    }
    // Cette fonction n'est pas disponible dans le backend
    // Retourner des données par défaut ou rediriger vers une autre méthode
    throw new Error('Endpoint non disponible - utiliser les endpoints spécifiques');
  } catch (error) {
    throw error;
  }
};

// Récupère les étudiants par département (pour les enseignants)
export const getStudentsByDepartment = () =>
  api.get('/api/teacher/listOfStudentByDepartment');

// Télécharger le CV d'un étudiant (pour les enseignants)
export const downloadStudentCV = async (studentId: number) => {
  try {
    if (!studentId || studentId <= 0 || !Number.isInteger(studentId)) {
      throw new Error('ID étudiant invalide');
    }
    const sanitizedId = Math.floor(Math.abs(studentId));
    return await api.get(`/downloadFiles/cv/${sanitizedId}/download`, { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};



