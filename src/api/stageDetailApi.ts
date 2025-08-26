import { api, getAuthHeaders } from './api';
import type { OfferResponseDto } from '../types/offer';

// Récupère le détail d'une offre
export async function getOfferDetail(id: number): Promise<OfferResponseDto> {
  const { data } = await api.get<OfferResponseDto>(`/offers/${id}`, {
    headers: getAuthHeaders()
  });
  return data;
}

// Récupère le texte ou le PDF de la convention
export async function getConventionText(id: number): Promise<{ text: string; isPdf: boolean; downloadUrl?: string }> {
  // On suppose que l'API retourne soit un texte (markdown ou plain), soit un PDF à télécharger
  try {
    const { data, headers } = await api.get(`/offers/${id}/convention`, { 
      responseType: 'arraybuffer',
      headers: getAuthHeaders()
    });
    const contentType = headers['content-type'];
    if (contentType && contentType.includes('application/pdf')) {
      // Génère une URL blob pour le PDF
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      return { text: '', isPdf: true, downloadUrl: url };
    } else {
      // Si c'est du texte (markdown, plain, etc.)
      const decoder = new TextDecoder('utf-8');
      return { text: decoder.decode(data), isPdf: false };
    }
  } catch {
    // Fallback si erreur
    return { text: '', isPdf: false };
  }
}
