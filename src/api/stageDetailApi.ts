import { api, getAuthHeaders } from './api';
import type { OfferResponseDto } from '../types/offer';

// Note: Les endpoints /offers/{id} ne sont pas disponibles dans le backend
// Ces fonctions sont conservées pour compatibilité mais ne fonctionneront pas

// Récupère le détail d'une offre (endpoint non disponible)
export async function getOfferDetail(id: number): Promise<OfferResponseDto> {
  try {
    if (!id || id <= 0) {
      throw new Error('ID d\'offre invalide');
    }
    // Endpoint non disponible dans le backend
    throw new Error('Endpoint non disponible - utiliser les endpoints spécifiques par rôle');
  } catch (error) {
    throw error;
  }
}

// Récupère le texte ou le PDF de la convention (endpoint non disponible)
export async function getConventionText(id: number): Promise<{ text: string; isPdf: boolean; downloadUrl?: string }> {
  try {
    if (!id || id <= 0) {
      throw new Error('ID d\'offre invalide');
    }
    // Endpoint non disponible dans le backend
    // Utiliser downloadFiles/downloadConvention/{id} à la place
    throw new Error('Endpoint non disponible - utiliser downloadConvention');
  } catch (error) {
    throw error;
  }
}