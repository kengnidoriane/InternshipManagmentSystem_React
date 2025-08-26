import { api, getAuthHeaders } from './api';

// API générique pour les notifications selon le rôle
export const getNotificationsByRole = (role: 'student' | 'teacher' | 'enterprise') => {
  const endpoints = {
    student: '/api/student/StudentNotifications',
    teacher: '/api/teacher/teacherNotifications', 
    enterprise: '/api/enterprise/enterpriseNotifications'
  };
  
  return api.get(endpoints[role], { headers: getAuthHeaders() });
};

// Marquer une notification comme lue (si cette fonctionnalité existe)
export const markNotificationAsRead = (notificationId: number) =>
  api.patch(`/api/notifications/${notificationId}/read`, {}, {
    headers: getAuthHeaders()
  });