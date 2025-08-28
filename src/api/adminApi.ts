import { api, getAuthHeaders } from './api';
import type { EnterpriseResponseDto } from '../types/enterprise';

// Récupérer les entreprises en attente de validation
export const getPendingEnterprises = async () => {
  try {
    return await api.get<EnterpriseResponseDto[]>('/api/admin/approvalPendingEnterprise', {
      headers: getAuthHeaders()
    });
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

// Télécharger le rapport Excel des stages
export const downloadInternshipsExcel = async () => {
  try {
    return await api.get('/api/admin/internships.xlsx', { 
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer tous les enseignants
export const getAllTeachers = async () => {
  try {
    return await api.get('/api/admin/allTeachers', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer tous les étudiants
export const getAllStudents = async () => {
  try {
    return await api.get('/api/admin/allStudent', {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer les enseignants avec pagination
export const getTeachersPagination = async (page: number, size: number) => {
  try {
    if (page < 0 || size <= 0) {
      throw new Error('Paramètres de pagination invalides');
    }
    return await api.get(`/api/admin/teacherPagination?page=${page}&size=${size}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Récupérer les étudiants avec pagination
export const getStudentsPagination = async (page: number, size: number) => {
  try {
    if (page < 0 || size <= 0) {
      throw new Error('Paramètres de pagination invalides');
    }
    return await api.get(`/api/admin/studentPagination?page=${page}&size=${size}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    throw error;
  }
};

// Supprimer le compte utilisateur (admin)
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