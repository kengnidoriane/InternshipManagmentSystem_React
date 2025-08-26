import { api, getAuthHeaders } from './api';
import type { OfferResponseDto } from '../types/offer';

// Récupère le détail d'une offre de stage
export async function getStageDetail(id: number): Promise<OfferResponseDto> {
  const { data } = await api.get<OfferResponseDto>(`/offers/${id}`, {
    headers: getAuthHeaders()
  });
  return data;
}

// Télécharge la convention de stage (PDF)
export async function downloadConvention(offerId: string): Promise<Blob> {
  const { data } = await api.get(`/offers/${offerId}/convention`, {
    responseType: 'blob',
    headers: getAuthHeaders()
  });
  return data;
}

// Soumet une candidature avec CV et lettre de motivation
export async function submitApplication(offerId: string, cvFile: File, coverLetterFile: File): Promise<void> {
  const formData = new FormData();
  formData.append('cv', cvFile);
  formData.append('coverLetter', coverLetterFile);

  await api.post(`/student/${offerId}/createApplication`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders()
    },
  });
}