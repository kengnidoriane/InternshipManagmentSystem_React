import { api, getAuthHeaders } from './api';

// Récupérer les offres validées pour l'étudiant connecté
export const getOffersByApprovedStatus = () =>
  api.get('/api/student/offersByApprovedStatus', { headers: getAuthHeaders() });

// Filtrer les offres selon les critères payant/distance
export const filterOffers = (
  paying?: boolean,
  remote?: boolean
) =>
  api.get('/api/student/filter', {
    params: { ...(paying !== undefined && { paying }), ...(remote !== undefined && { remote }) },
    headers: getAuthHeaders()
  });

// Postuler à une offre
import type { StudentApplicationDto } from '../types/student';
export const createApplication = (
  offerId: string,
  applicationData: StudentApplicationDto
) =>
  api.post(`/api/student/${offerId}/createApplication`, applicationData, {
    headers: getAuthHeaders()
  });

// Supprimer le compte étudiant
export const deleteStudentAccount = () =>
  api.delete('/api/student/deleteStudentAccount', {
    headers: getAuthHeaders()
  });
