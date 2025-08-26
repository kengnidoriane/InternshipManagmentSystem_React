import { api, getAuthHeaders } from './api';
import type { TeacherRegistrationRequestDto } from '../types/teacher';
import type { EnterpriseResponseDto } from '../types/enterprise';
import type { OfferResponseDto } from '../types/offer';

// Offres à valider pour le département de l'enseignant
export const getOffersToReviewByDepartment = () =>
  api.get('/api/teacher/offerToReview', { headers: getAuthHeaders() });

// Récupérer toutes les offres des entreprises partenaires
export const getAllPartnerOffers = () =>
  api.get<OfferResponseDto[]>('/api/teacher/allPartnerOffers', { headers: getAuthHeaders() });

// Récupérer toutes les offres (pour admin)
export const getTeacherOffers = () =>
  api.get<OfferResponseDto[]>('/api/teacher/offerToReview', { headers: getAuthHeaders() });

// Télécharger la convention PDF d'une offre
export const downloadConvention = (id: string) =>
  api.get(`/api/teacher/convention/${id}/download`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Télécharger la convention d'une offre (nouveau endpoint)
export const downloadOfferConvention = (offerId: number) =>
  api.get(`/api/teacher/downloadConvention/${offerId}`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Valider une offre et sa convention
export const validateOfferAndConvention = (
  id: string,
  validationData: TeacherRegistrationRequestDto
) =>
  api.post(`/api/teacher/offers/${id}/validate`, validationData, {
    headers: getAuthHeaders()
  });

// Récupérer la liste des étudiants par département
export const getStudentsByDepartment = () =>
  api.get('/api/teacher/listOfStudentByDepartment', { headers: getAuthHeaders() });

// Télécharger le CV d'un étudiant
export const downloadStudentCV = (studentId: string) =>
  api.get(`/api/teacher/cv/${studentId}/download`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Récupérer les entreprises en attente de validation
export const getPendingEnterprises = () =>
  api.get<EnterpriseResponseDto[]>('/api/teacher/approvalPendingEnterprise', { headers: getAuthHeaders() });

// Récupérer toutes les entreprises
export const getAllEnterprises = () =>
  api.get<EnterpriseResponseDto[]>('/api/teacher/allEnterprises', { headers: getAuthHeaders() });

// Récupérer une entreprise par ID
export const getEnterpriseById = (enterpriseId: number) =>
  api.get<EnterpriseResponseDto>(`/api/teacher/enterprise/${enterpriseId}`, { headers: getAuthHeaders() });

// Récupérer le logo d'une entreprise par ID
export const getEnterpriseLogoById = (enterpriseId: number) =>
  api.get(`/api/teacher/enterprise/${enterpriseId}/logo`, { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Approuver ou rejeter une entreprise
export const approveEnterprise = (enterpriseId: number, approved: boolean) =>
  api.put<EnterpriseResponseDto>(`/api/teacher/Enterprise/${enterpriseId}/approve?approved=${approved}`, {}, {
    headers: getAuthHeaders()
  });

// Supprimer le compte enseignant
export const deleteTeacherAccount = () =>
  api.delete('/api/teacher/deleteTeacherAccount', {
    headers: getAuthHeaders()
  });
