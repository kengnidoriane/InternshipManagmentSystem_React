import { api, getAuthHeaders } from './api';
import type { TeacherRegistrationRequestDto } from '../types/teacher';
import type { EnterpriseResponseDto } from '../types/enterprise';
import type { OfferResponseDto } from '../types/offer';

// Offres à valider pour le département de l'enseignant
export const getOffersToReviewByDepartment = async () => {
  try {
    return await api.get('/api/teacher/offerToReview', { headers: getAuthHeaders() });
  } catch (error) {
    throw error;
  }
};

// Télécharger la convention PDF d'une offre
export const downloadConvention = async (offerId: number) => {
  try {
    if (!offerId || offerId <= 0) {
      throw new Error('ID d\'offre invalide');
    }
    return await api.get(`/downloadFiles/downloadConvention/${offerId}`, { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Valider une offre et sa convention
export const validateOfferAndConvention = async (
  id: number,
  validationData: { offerApproved: boolean; conventionApproved: boolean }
) => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID d\'offre invalide - doit être un entier positif');
    }
    return await api.put(`/api/teacher/offers/${id}/validate`, validationData, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Offre déjà traitée ou données invalides');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 403) {
      throw new Error('Vous n\'avez pas les droits pour valider cette offre');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la validation de l\'offre');
  }
};

// Récupérer la liste des étudiants par département
export const getStudentsByDepartment = async () => {
  try {
    return await api.get('/api/teacher/listOfStudentByDepartment', { headers: getAuthHeaders() });
  } catch (error) {
    throw error;
  }
};

// Télécharger le CV d'un étudiant
export const downloadStudentCV = async (applicationId: number) => {
  try {
    if (!applicationId || applicationId <= 0) {
      throw new Error('ID de candidature invalide');
    }
    return await api.get(`/downloadFiles/cv/${applicationId}/download`, { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer les entreprises en attente de validation
export const getPendingEnterprises = async () => {
  try {
    return await api.get<EnterpriseResponseDto[]>('/api/admin/approvalPendingEnterprise', { headers: getAuthHeaders() });
  } catch (error) {
    throw error;
  }
};

// Approuver ou rejeter une entreprise
export const approveEnterprise = async (enterpriseId: number, approved: boolean) => {
  try {
    if (!enterpriseId || enterpriseId <= 0) {
      throw new Error('ID d\'entreprise invalide');
    }
    return await api.put<EnterpriseResponseDto>(`/api/admin/Enterprise/${enterpriseId}/approve?approved=${approved}`, {}, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Statistiques des stages par département
export const getInternshipStats = async () => {
  try {
    return await api.get('/api/teacher/internshipsByDepartment', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer les offres approuvées par l'enseignant
export const getOffersApprovedByTeacher = async () => {
  try {
    return await api.get('/api/teacher/offersApprovedByTeacher', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer les notifications de l'enseignant
export const getTeacherNotifications = async () => {
  try {
    return await api.get('/api/teacher/teacherNotifications', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Supprimer le compte utilisateur
export const deleteUserAccount = async () => {
  try {
    return await api.delete('/updateProfile/deleteUserAccount', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Vérifier le mot de passe
export const verifyPassword = async (password: string) => {
  try {
    if (!password || password.trim() === '') {
      throw new Error('Mot de passe requis');
    }
    return await api.put('/updateProfile/verifyPassword', { password }, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer les entreprises en partenariat
export const getEnterpriseInPartnership = async () => {
  try {
    return await api.get('/api/teacher/enterpriseInPartnership', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};


