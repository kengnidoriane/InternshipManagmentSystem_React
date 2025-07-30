import axios from 'axios';

// Récupérer les offres validées pour l'étudiant connectéexport const getOffersByApprovedStatus = () =>
  axios.get('/api/student/offersByApprovedStatus');

// Filtrer les offres à partir d'une offre donnée
export const filterOffers = (offerId, filterByTime, filterByLocation) =>
  axios.get(`/api/student/${offerId}/filter`, {
    params: { filterByTime, filterByLocation },
  });

// Postuler à une offreexport const createApplication = (offerId, applicationData) =>
  axios.post(`/api/student/${offerId}/createApplication`, applicationData);

// Supprimer le compte étudiant
export const deleteStudentAccount = () =>
  axios.delete('/api/student/deleteStudentAccount');
