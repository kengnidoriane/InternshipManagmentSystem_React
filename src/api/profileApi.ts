import { api } from './api';

// API générique pour la mise à jour des profils selon le rôle
export const updatePassword = (role: 'student' | 'teacher' | 'enterprise', passwordData: { password: string }) => {
  const endpoints = {
    student: '/api/student/updatePassword',
    teacher: '/api/teacher/updatePassword',
    enterprise: '/api/enterprise/updatePassword'
  };
  
  return api.patch(endpoints[role], passwordData);
};

export const updateEmail = (role: 'student' | 'teacher' | 'enterprise', emailData: { email: string }) => {
  const endpoints = {
    student: '/api/student/updateEmail',
    teacher: '/api/teacher/updateEmail', 
    enterprise: '/api/enterprise/updateEmail'
  };
  
  return api.patch(endpoints[role], emailData);
};

export const deleteAccount = (role: 'student' | 'teacher' | 'enterprise' | 'admin') => {
  const endpoints = {
    student: '/api/student/deleteStudentAccount',
    teacher: '/api/teacher/deleteTeacherAccount',
    enterprise: '/api/enterprise/deleteEnterpriseAccount',
    admin: '/api/admin/deleteAdminAccount'
  };
  
  return api.delete(endpoints[role]);
};