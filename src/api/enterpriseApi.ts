import { api, getAuthHeaders } from './api';
import type { OfferRequestDto } from '../types/offer';
import type { EnterpriseResponseDto } from '../types/enterprise';

// Créer une nouvelle offre
export const createOffer = (offer: OfferRequestDto & { pdfConvention?: File | null }) => {
  const formData = new FormData();
  formData.append('title', offer.title || '');
  formData.append('description', offer.description || '');
  formData.append('domain', offer.domain || '');
  formData.append('typeOfInternship', offer.typeOfInternship || '');
  formData.append('job', offer.job || '');
  formData.append('requirements', offer.requirements || '');
  formData.append('numberOfPlaces', offer.numberOfPlaces || '1');
  formData.append('paying', offer.paying ? 'true' : 'false');
  formData.append('remote', offer.remote ? 'true' : 'false');
  formData.append('startDate', offer.startDate || '');
  formData.append('endDate', offer.endDate || '');
  if (offer.pdfConvention) {
    formData.append('pdfConvention', offer.pdfConvention);
  }
  return api.post('/api/enterprise/createOffer', formData, {
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

// Récupérer le logo de l'entreprise
export const getEnterpriseLogo = () =>
  api.get('/api/enterprise/getEnterpriseLogo', { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Télécharger le CV d'un candidat
export const downloadCandidateCV = (applicationId: number) =>
  api.get(`/api/enterprise/cv/${applicationId}/download`, { responseType: 'blob' });

// Télécharger la lettre de motivation d'un candidat
export const downloadCandidateCoverLetter = (applicationId: number) =>
  api.get(`/api/enterprise/coverLetter/${applicationId}/download`, { responseType: 'blob' });

// Valider ou rejeter une candidature
export const validateApplication = (applicationId: number, approved: boolean) =>
  api.put(`/api/enterprise/application/${applicationId}/validate?approved=${approved}`, {}, {
    headers: getAuthHeaders()
  });

// Mettre à jour le mot de passe
export const updateEnterprisePassword = (passwordData: { password: string }) =>
  api.patch('/api/enterprise/updatePassword', passwordData, {
    headers: getAuthHeaders()
  });

// Mettre à jour l'email
export const updateEnterpriseEmail = (emailData: { email: string }) =>
  api.patch('/api/enterprise/updateEmail', emailData, {
    headers: getAuthHeaders()
  });

// Supprimer le compte entreprise
export const deleteEnterpriseAccount = () =>
  api.delete('/api/enterprise/deleteEnterpriseAccount', {
    headers: getAuthHeaders()
  });

// Récupère les entreprises en attente de validation (pour les enseignants)
export const getPendingEnterprises = () =>
  api.get<EnterpriseResponseDto[]>('/api/teacher/approvalPendingEnterprise');

// Récupère toutes les entreprises (en attente et partenaires)
export const getAllEnterprises = () =>
  api.get<EnterpriseResponseDto[]>('/api/teacher/allEnterprises');

// Récupère le logo d'une entreprise par son ID
export const getEnterpriseLogoById = (enterpriseId: number) =>
  api.get(`/api/teacher/enterprise/${enterpriseId}/logo`, { responseType: 'blob' });

// Récupère les détails d'une entreprise par son ID
export const getEnterpriseById = (enterpriseId: number) =>
  api.get<EnterpriseResponseDto>(`/api/teacher/enterprise/${enterpriseId}`);

// Récupère les infos de l'entreprise connectée
export const getEnterpriseInfo = () =>
  api.get('/api/enterprise/me');

// Récupère une offre spécifique par ID
export const getOfferById = (offerId: number) =>
  api.get(`/api/enterprise/offer/${offerId}`);

// Télécharger la convention d'une offre
export const downloadConvention = (offerId: number) =>
  api.get(`/api/enterprise/downloadConvention/${offerId}`, { responseType: 'blob' });

// Récupère les étudiants par département (pour les enseignants)
export const getStudentsByDepartment = () =>
  api.get('/api/teacher/listOfStudentByDepartment');

// Télécharger le CV d'un étudiant (pour les enseignants)
export const downloadStudentCV = (studentId: number) =>
  api.get(`/api/teacher/cv/${studentId}/download`, { responseType: 'blob' });

// Approuve ou rejette une entreprise
export const approveEnterprise = (enterpriseId: number, approved: boolean) =>
  api.put<EnterpriseResponseDto>(`/api/teacher/Enterprise/${enterpriseId}/approve?approved=${approved}`);

// Mettre à jour le profil de l'entreprise
export const updateEnterpriseProfile = (profileData: {
  country?: string;
  city?: string;
  sectorOfActivity?: string;
  contact?: string;
  location?: string;
}) => api.patch('/api/enterprise/updateProfile', profileData);

// Uploader le logo de l'entreprise
export const uploadEnterpriseLogo = (logoFile: File) => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  return api.post('/api/enterprise/uploadLogo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Mettre à jour une offre existante
export const updateOffer = (offerId: number, offer: OfferRequestDto & { pdfConvention?: File | null }) => {
  console.log('Sending update data:', offer);
  
  // Vérifier et formater les dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };
  
  // Si pas de fichier, envoyer en JSON simple
  if (!offer.pdfConvention) {
    const data = {
      title: offer.title || '',
      description: offer.description || '',
      domain: offer.domain || '',
      typeOfInternship: offer.typeOfInternship || '',
      job: offer.job || '',
      requirements: offer.requirements || '',
      numberOfPlaces: offer.numberOfPlaces || '1',
      paying: offer.paying || false,
      remote: offer.remote || false,
      startDate: formatDate(offer.startDate || ''),
      endDate: formatDate(offer.endDate || '')
    };
    
    console.log('Sending JSON data:', data);
    return api.put(`/api/enterprise/updateOffer/${offerId}`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Sinon utiliser FormData pour le fichier
  const formData = new FormData();
  formData.append('title', offer.title || '');
  formData.append('description', offer.description || '');
  formData.append('domain', offer.domain || '');
  formData.append('typeOfInternship', offer.typeOfInternship || '');
  formData.append('job', offer.job || '');
  formData.append('requirements', offer.requirements || '');
  formData.append('numberOfPlaces', offer.numberOfPlaces || '1');
  formData.append('paying', offer.paying ? 'true' : 'false');
  formData.append('remote', offer.remote ? 'true' : 'false');
  formData.append('startDate', formatDate(offer.startDate || ''));
  formData.append('endDate', formatDate(offer.endDate || ''));
  formData.append('pdfConvention', offer.pdfConvention);
  
  return api.put(`/api/enterprise/updateOffer/${offerId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};