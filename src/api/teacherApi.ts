import axios from 'axios';

// Offres à valider pour le département de l'enseignant
export const getOffersToReviewByDepartment = () =>
  axios.get('/api/teacher/offerToReview');

// Télécharger la convention PDF d'une offre
export const downloadConvention = (id) =>
  axios.get(`/api/teacher/convention/${id}/download`, { responseType: 'blob' });

// Valider une offre et sa convention
export const validateOfferAndConvention = (id, validationData) =>
  axios.put(`/api/teacher/offers/${id}/validate`, validationData);

// Supprimer le compte enseignant
export const deleteTeacherAccount = () =>
  axios.delete('/api/teacher/deleteTeacherAccount');
