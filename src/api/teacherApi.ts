import { api } from './api';

// Offres à valider pour le département de l'enseignant
export const getOffersToReviewByDepartment = () =>
  api.get('/api/teacher/offerToReview');

// Télécharger la convention PDF d'une offre
export const downloadConvention = (id: string) =>
  api.get(`/api/teacher/convention/${id}/download`, { responseType: 'blob' });

// Valider une offre et sa convention
import type { TeacherRegistrationRequestDto } from '../types/teacher';
export const validateOfferAndConvention = (
  id: string,
  validationData: TeacherRegistrationRequestDto
) =>
  api.post(`/api/teacher/offers/${id}/validate`, validationData);

// Récupérer la liste des étudiants par département
export const getStudentsByDepartment = () =>
  api.get('/api/teacher/listOfStudentByDepartment');

// Télécharger le CV d'un étudiant
export const downloadStudentCV = (studentId: string) =>
  api.get(`/api/teacher/cv/${studentId}/download`, { responseType: 'blob' });

// Supprimer le compte enseignant
export const deleteTeacherAccount = () =>
  api.delete('/api/teacher/deleteTeacherAccount');
