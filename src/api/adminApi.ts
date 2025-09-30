import { api, getAuthHeaders } from './api';
import type { EnterpriseResponseDto } from '../types/enterprise';

// ✅ NOUVEAUX ENDPOINTS BACKEND AJOUTÉS

// Récupérer les entreprises en attente de validation
export const getPendingEnterprises = async () => {
  return api.get<EnterpriseResponseDto[]>('/api/admin/approvalPendingEnterprise', {
    headers: getAuthHeaders()
  });
};

// Récupérer les entreprises rejetées
export const getRejectedEnterprises = async () => {
  return api.get<EnterpriseResponseDto[]>('/api/admin/EnterpriseRejected', {
    headers: getAuthHeaders()
  });
};

// Approuver ou rejeter une entreprise
export const approveEnterprise = async (enterpriseId: number, approved: boolean) => {
  if (!enterpriseId || enterpriseId <= 0) {
    throw new Error('ID d\'entreprise invalide');
  }
  return api.put<EnterpriseResponseDto>(`/api/admin/Enterprise/${enterpriseId}/approve?approved=${approved}`, {}, {
    headers: getAuthHeaders()
  });
};

// Télécharger le rapport Excel des stages
export const downloadInternshipsExcel = async () => {
  return api.get('/api/admin/internships.xlsx', {
    responseType: 'blob',
    headers: getAuthHeaders()
  });
};

// Récupérer tous les enseignants
export const getAllTeachers = async () => {
  return api.get('/api/admin/allTeachers', {
    headers: getAuthHeaders()
  });
};

// Récupérer tous les étudiants
export const getAllStudents = async () => {
  return api.get('/api/admin/allStudent', {
    headers: getAuthHeaders()
  });
};

// Récupérer les entreprises en partenariat
export const getEnterpriseInPartnership = async () => {
  return api.get('/api/admin/enterpriseInPartnership', {
    headers: getAuthHeaders()
  });
};

// Récupérer les enseignants avec pagination
export const getTeachersPagination = async (page: number, size: number) => {
  if (page < 0 || size <= 0) {
    throw new Error('Paramètres de pagination invalides');
  }
  return api.get(`/api/admin/teacherPagination?page=${page}&size=${size}`, {
    headers: getAuthHeaders()
  });
};

// Récupérer les étudiants avec pagination
export const getStudentsPagination = async (page: number, size: number) => {
  if (page < 0 || size <= 0) {
    throw new Error('Paramètres de pagination invalides');
  }
  return api.get(`/api/admin/studentPagination?page=${page}&size=${size}`, {
    headers: getAuthHeaders()
  });
};

// ✅ NOUVEAU: Supprimer le compte utilisateur (admin)
export const deleteUserAccount = async () => {
  return api.delete('/updateProfile/deleteUserAccount', {
    headers: getAuthHeaders()
  });
};

// ✅ NOUVEAU: Vérifier le mot de passe
export const verifyPassword = async (password: string) => {
  if (!password || password.trim() === '') {
    throw new Error('Mot de passe requis');
  }
  return api.put('/updateProfile/verifyPassword', { password }, {
    headers: getAuthHeaders()
  });
};

// ✅ NOUVEAU: Supprimer une entreprise (admin)
export const deleteEnterprise = async (enterpriseId: number) => {
  return api.delete(`/updateProfile/deleteAccount/${enterpriseId}`, {
    headers: getAuthHeaders()
  });
};

// ✅ NOUVEAU: Supprimer un étudiant (admin)
export const deleteStudent = async (studentId: number) => {
  return api.delete(`/updateProfile/deleteAccount/${studentId}`, {
    headers: getAuthHeaders()
  });
};

// ✅ NOUVEAU: Récupérer l'email de l'utilisateur connecté
export const getUserEmail = async () => {
  try {
    return await api.get('/updateProfile/getUserEmail', {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'email');
  }
};

// ✅ NOUVEAU: Mettre à jour l'email
export const updateEmail = async (email: string) => {
  try {
    return await api.patch('/updateProfile/updateEmail', { email }, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'email');
  }
};

// ✅ NOUVEAU: Mettre à jour le mot de passe
export const updatePassword = async (password: string) => {
  try {
    return await api.patch('/updateProfile/updatePassword', { password }, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
  }
};