import { api } from './api';
import type { OfferResponseDto } from '../types/offer';
import type { EnterpriseResponseDto } from '../types/enterprise';

// Récupère toutes les offres de l'entreprise connectée
export async function getEnterpriseOffers(): Promise<OfferResponseDto[]> {
  const { data } = await api.get<OfferResponseDto[]>('/enterprise/offers');
  return data;
}

// Supprime une offre
export async function deleteOffer(offerId: number): Promise<void> {
  await api.delete(`/enterprise/offers/${offerId}`);
}

// Met à jour le statut d'une offre
export async function updateOfferStatus(offerId: number, status: string): Promise<void> {
  await api.patch(`/enterprise/offers/${offerId}/status`, { status });
}

// Crée une nouvelle offre de stage (avec PDF)
import type { OfferRequestDto } from '../types/offer';

// Récupère les candidatures pour une offre (pour la page candidatures entreprise)
export async function getOfferApplications(offerId: number): Promise<any[]> {
  const { data } = await api.get(`/enterprise/offers/${offerId}/applications`);
  return data;
}

// Récupère les infos de l'entreprise connectée
export async function getEnterpriseInfo(): Promise<any> {
  const { data } = await api.get('/enterprise/me');
  return data;
}

export async function createOffer(offer: OfferRequestDto & { pdfConvention?: File | null }): Promise<any> {
  const formData = new FormData();
  formData.append('title', offer.title);
  formData.append('description', offer.description);
  formData.append('domain', offer.domain);
  formData.append('job', offer.job);
  formData.append('requirements', offer.requirements);
  formData.append('typeOfInternship', offer.typeOfInternship);
  formData.append('startDate', offer.startDate);
  formData.append('endDate', offer.endDate);
  if (offer.pdfConvention) {
    formData.append('pdfConvention', offer.pdfConvention);
  }
  const { data } = await api.post('/enterprise/offers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// Récupère les entreprises en attente de validation (pour les enseignants)
export async function getPendingEnterprises(): Promise<EnterpriseResponseDto[]> {
  const { data } = await api.get<EnterpriseResponseDto[]>('/teacher/approvalPendingEnterprise');
  return data;
}

// Récupère les entreprises partenaires (pour les enseignants)
export async function getPartnerEnterprises(): Promise<EnterpriseResponseDto[]> {
  // Cette API n'existe pas encore côté backend, on pourrait la créer
  // Pour l'instant, on récupère toutes les entreprises et on filtre côté client
  const { data } = await api.get<EnterpriseResponseDto[]>('/teacher/enterprises');
  return data.filter(enterprise => enterprise.inPartnership);
}

// Approuve ou rejette une entreprise
export async function approveEnterprise(enterpriseId: number, approved: boolean): Promise<EnterpriseResponseDto> {
  const { data } = await api.put<EnterpriseResponseDto>(`/teacher/Enterprise/${enterpriseId}/approve?approved=${approved}`);
  return data;
}