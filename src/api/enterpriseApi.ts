import axios from 'axios';

// Récupérer toutes les candidatures reçues par l'entreprise
export const getApplications = () =>
  axios.get('/api/enterprise/Applications');

// Récupérer les notifications non lues
export const getEnterpriseNotifications = () =>
  axios.get('/api/enterprise/enterpriseNotifications');

// Créer une nouvelle offre de stage
export const createOffer = (offerData) =>
  axios.post('/api/enterprise/createOffer', offerData);

// Supprimer le compte entreprise
export const deleteEnterpriseAccount = () =>
  axios.delete('/api/enterprise/deleteEnterpriseAccount');
