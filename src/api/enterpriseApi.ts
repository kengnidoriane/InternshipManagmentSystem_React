import { api } from './api';

// Récupérer toutes les candidatures reçues par l'entreprise
export const getApplications = () =>
  api.get('/api/enterprise/Applications');

// Récupérer les notifications non lues
export const getEnterpriseNotifications = () =>
  api.get('/api/enterprise/enterpriseNotifications');

// Créer une nouvelle offre de stage
import type { OfferRequestDto } from '../types/offer';

export const createOffer = (offerData: OfferRequestDto) => {
  const formData = new FormData();
  formData.append('title', offerData.title);
  formData.append('description', offerData.description);
  formData.append('domain', offerData.domain);
  formData.append('job', offerData.job);
  formData.append('requirements', offerData.requirements);
  formData.append('typeOfInternship', offerData.typeOfInternship);
  formData.append('startDate', offerData.startDate);
  formData.append('endDate', offerData.endDate);
  if (offerData.pdfConvention) {
    formData.append('pdfConvention', offerData.pdfConvention);
  }
  return api.post('/api/enterprise/createOffer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Supprimer le compte entreprise
export const deleteEnterpriseAccount = () =>
  api.delete('/api/enterprise/deleteEnterpriseAccount');

// Récupérer la liste des offres de l'entreprise connectée
import type { OfferResponseDto } from '../types/offer';
export const getMyOffers = () =>
  api.get<OfferResponseDto[]>('/api/enterprise/listOfOffers');
