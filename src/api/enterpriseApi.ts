import { api, getAuthHeaders } from './api';
import type { OfferRequestDto } from '../types/offer';
import type { EnterpriseResponseDto } from '../types/enterprise';

// Créer une nouvelle offre (sans convention)
export const createOffer = async (offer: OfferRequestDto) => {
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
};

// Ajouter la convention PDF à une offre existante
export const addConventionToOffer = async (offerId: number, pdfConvention: File) => {
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

// Récupérer le logo de l'entreprise (courant)
export const getEnterpriseLogo = () =>
  api.get('/profilePhoto/getEnterpriseLogo', {
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Uploader une photo de profil
export const uploadProfilePhoto = async (photo: File) => {
  if (!photo) {
    throw new Error('Fichier photo requis');
  }
  const formData = new FormData();
  formData.append('photo', photo);
  return await api.post('/profilePhoto/upload-photo', formData, {
    headers: getAuthHeaders()
  });
};

// Télécharger le CV d'un candidat
export const downloadCandidateCV = async (applicationId: number) => {
  if (!applicationId || applicationId <= 0) {
    throw new Error('ID de candidature invalide');
  }
  return await api.get(`/downloadFiles/cv/${applicationId}/download`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });
};

// Télécharger la lettre de motivation d'un candidat
export const downloadCandidateCoverLetter = async (applicationId: number) => {
  if (!applicationId || applicationId <= 0) {
    throw new Error('ID de candidature invalide');
  }
  return await api.get(`/downloadFiles/coverLetter/${applicationId}/download`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });
};

// Valider ou rejeter une candidature
export const validateApplication = async (applicationId: number, approved: boolean) => {
  if (!applicationId || applicationId <= 0) {
    throw new Error('ID de candidature invalide');
  }
  return await api.put(`/api/enterprise/application/${applicationId}/validate?approved=${approved}`, {}, {
    headers: getAuthHeaders()
  });
};





// Télécharger la convention d'une offre
export const downloadConvention = async (offerId: number) => {
  if (!offerId || offerId <= 0) {
    throw new Error('ID d\'offre invalide');
  }
  return await api.get(`/downloadFiles/downloadConvention/${offerId}`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });
};

// Note: getEnterpriseById n'existe pas dans le backend
// Utiliser getPendingEnterprises ou getEnterpriseOffers selon le contexte

// Fonction utilitaire pour récupérer une entreprise par ID (via les offres)
export const getEnterpriseById = async (enterpriseId: number): Promise<{ data: EnterpriseResponseDto }> => {
  if (!enterpriseId || enterpriseId <= 0) {
    throw new Error('ID d\'entreprise invalide');
  }
  // Cette fonction n'est pas disponible dans le backend
  // On tape volontairement une réponse typée pour ne pas casser le code appelant,
  // mais on lance une erreur pour indiquer l'absence d'endpoint.
  throw new Error('Endpoint non disponible - utiliser les endpoints spécifiques');
};

// Récupère les étudiants par département (pour les enseignants)
export const getStudentsByDepartment = () =>
  api.get('/api/teacher/listOfStudentByDepartment');

// Télécharger le CV d'un étudiant (pour les enseignants)
export const downloadStudentCV = async (studentId: number) => {
  if (!studentId || studentId <= 0 || !Number.isInteger(studentId)) {
    throw new Error('ID étudiant invalide');
  }
  const sanitizedId = Math.floor(Math.abs(studentId));
  return await api.get(`/downloadFiles/cv/${sanitizedId}/download`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });
};

// === AJOUTS: Mocks pour la liste des entreprises et le logo par ID ===

// Retourne toutes les entreprises (mock si l'endpoint backend n'existe pas)
export const getAllEnterprises = async () => {
  try {
    // Si un endpoint existe plus tard, on pourra le remplacer ici
    // Exemple hypothétique: return await api.get('/api/admin/allEnterprises', { headers: getAuthHeaders() });
    throw new Error('Endpoint non disponible');
  } catch {
    const mockEnterprises: EnterpriseResponseDto[] = [
      {
        id: 1,
        name: 'Alpha Tech',
        email: 'contact@alphatech.com',
        sectorOfActivity: 'Informatique',
        inPartnership: true,
        matriculation: 'ALP-001',
        hasLogo: { hasLogo: false },
        country: 'Cameroun',
        city: 'Yaoundé'
      },
      {
        id: 2,
        name: 'Beta Industries',
        email: 'info@beta-industries.com',
        sectorOfActivity: 'Manufacture',
        inPartnership: false,
        matriculation: 'BET-002',
        hasLogo: { hasLogo: false },
        country: 'Cameroun',
        city: 'Douala'
      },
      {
        id: 3,
        name: 'Gamma Services',
        email: 'hello@gammaservices.com',
        sectorOfActivity: 'Services',
        inPartnership: true,
        matriculation: 'GAM-003',
        hasLogo: { hasLogo: false },
        country: 'Cameroun',
        city: 'Bafoussam'
      }
    ];
    return { data: mockEnterprises } as { data: EnterpriseResponseDto[] };
  }
};

// Récupère le logo d'une entreprise par ID (mock: blob vide pour ne pas casser l'UI)
export const getEnterpriseLogoById = async (enterpriseId: number) => {
  try {
    // Exemple futur si le backend ajoute un endpoint:
    // return await api.get(`/profilePhoto/getEnterpriseLogo/${enterpriseId}`, { responseType: 'blob', headers: getAuthHeaders() });
    throw new Error('Endpoint non disponible');
  } catch {
    const emptyPng = new Uint8Array([]);
    return { data: new Blob([emptyPng], { type: 'image/png' }) } as { data: Blob };
  }
};

// Récupérer les informations de l'entreprise connectée
export const getCurrentEnterpriseInfo = async () => {
  try {
    // Essayer d'abord avec un endpoint potentiel
    return await api.get('/api/enterprise/profile', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.log('Endpoint /api/enterprise/profile non disponible, utilisation des offres pour récupérer les infos');
    try {
      // Fallback: récupérer les infos via les offres de l'entreprise
      const offersResponse = await getEnterpriseOffers();
      if (offersResponse.data && offersResponse.data.length > 0) {
        const firstOffer = offersResponse.data[0];
        if (firstOffer.enterprise) {
          return { data: firstOffer.enterprise };
        }
      }
      throw new Error('Aucune offre trouvée pour récupérer les infos entreprise');
    } catch (fallbackError) {
      console.log('Fallback échoué, utilisation de données par défaut');
      // Données par défaut si aucun endpoint ne fonctionne
      return {
        data: {
          id: 1,
          name: 'Mon Entreprise',
          email: 'contact@monentreprise.com',
          sectorOfActivity: 'Secteur d\'activité',
          matriculation: 'ENT-001',
          country: 'Cameroun',
          city: 'Yaoundé',
          hasLogo: { hasLogo: false },
          inPartnership: true
        }
      };
    }
  }
};



