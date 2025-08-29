import { api, getAuthHeaders } from './api';

// Télécharger un CV par ID de candidature
export const downloadCV = async (applicationId: number) => {
  try {
    if (!applicationId || applicationId <= 0) {
      throw new Error('ID de candidature invalide');
    }
    
    return await api.get(`/downloadFiles/cv/${applicationId}/download`, {
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 404) {
      throw new Error('CV non trouvé');
    }
    if (error.response?.status === 403) {
      throw new Error('Accès non autorisé à ce fichier');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement du CV');
  }
};

// Télécharger une lettre de motivation par ID de candidature
export const downloadCoverLetter = async (applicationId: number) => {
  try {
    if (!applicationId || applicationId <= 0) {
      throw new Error('ID de candidature invalide');
    }
    
    return await api.get(`/downloadFiles/coverLetter/${applicationId}/download`, {
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 404) {
      throw new Error('Lettre de motivation non trouvée');
    }
    if (error.response?.status === 403) {
      throw new Error('Accès non autorisé à ce fichier');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de la lettre de motivation');
  }
};

// Télécharger une convention par ID d'offre
export const downloadConvention = async (offerId: number) => {
  try {
    if (!offerId || offerId <= 0) {
      throw new Error('ID d\'offre invalide');
    }
    
    return await api.get(`/downloadFiles/downloadConvention/${offerId}`, {
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 404) {
      throw new Error('Convention non trouvée');
    }
    if (error.response?.status === 403) {
      throw new Error('Accès non autorisé à ce fichier');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de la convention');
  }
};

// Fonction utilitaire pour télécharger un fichier blob
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};