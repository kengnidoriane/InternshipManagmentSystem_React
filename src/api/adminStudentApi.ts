import { api, getAuthHeaders } from './api';
import type { StudentResponseDto } from '../types/student';

// Note: Ces endpoints spécifiques pour la gestion des étudiants par l'admin
// ne sont pas disponibles dans le backend. Utiliser adminApi.ts à la place.

export const getAllStudents = async () => {
  try {
    // Redirection vers l'endpoint admin existant
    return await api.get<StudentResponseDto[]>('/api/admin/allStudent', {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 403) {
      throw new Error('Accès non autorisé. Droits administrateur requis.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des étudiants');
  }
};

// Récupérer un étudiant par ID (via getAllStudents et filtrage)
export const getStudentById = async (id: number): Promise<StudentResponseDto | null> => {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID étudiant invalide - doit être un entier positif');
    }
    
    const response = await getAllStudents();
    const students = response.data;
    return students.find((student: StudentResponseDto) => student.id === id) || null;
  } catch (error) {
    throw error;
  }
};

// Supprimer un étudiant (utilise l'endpoint générique de suppression de compte)
export const deleteStudent = async (studentId: number) => {
  try {
    if (!Number.isInteger(studentId) || studentId <= 0) {
      throw new Error('ID étudiant invalide - doit être un entier positif');
    }
    
    // Note: Utilise l'endpoint générique de suppression de compte utilisateur
    // L'admin doit être connecté avec les droits appropriés
    return await api.delete('/updateProfile/deleteUserAccount', {
      headers: getAuthHeaders(),
      params: { userId: studentId }
    });
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Droits insuffisants pour supprimer cet étudiant');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'\u00e9tudiant');
  }
};