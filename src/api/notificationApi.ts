import { api, getAuthHeaders } from './api';

// Récupérer les notifications non vues
export const getUnseenNotifications = async () => {
  try {
    return await api.get('/getNotifications/getUnseenNotifications', {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des notifications');
  }
};

// Marquer une notification comme vue
export const markNotificationAsSeen = async (notificationId: number) => {
  try {
    return await api.put(`/getNotifications/userNotifications/${notificationId}/seen`, {}, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors du marquage de la notification');
  }
};

// Récupérer les notifications par rôle (ancienne fonction maintenue pour compatibilité)
export const getNotificationsByRole = async (role: 'student' | 'teacher' | 'enterprise') => {
  try {
    const endpoints = {
      student: '/api/student/StudentNotifications',
      teacher: '/api/teacher/teacherNotifications', 
      enterprise: '/api/enterprise/enterpriseNotifications'
    };
    
    return await api.get(endpoints[role], {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des notifications');
  }
};

// Note: Les fonctionnalités de marquage et suppression ne sont pas disponibles dans le backend
// Les notifications sont gérées automatiquement par le serveur

// Marquer les notifications comme lues (fonctionnalité non disponible)
export const markNotificationsAsRead = async (notificationIds: number[]) => {
  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    throw new Error('IDs de notifications requis');
  }
  throw new Error('Fonctionnalité de marquage non disponible - géré automatiquement par le serveur');
};

// Supprimer des notifications (fonctionnalité non disponible)
export const deleteNotifications = async (notificationIds: number[]) => {
  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    throw new Error('IDs de notifications requis');
  }
  throw new Error('Fonctionnalité de suppression non disponible - géré automatiquement par le serveur');
};