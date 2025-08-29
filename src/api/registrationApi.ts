import { api } from './api';

// Inscription étudiant
import type { StudentRegistrationRequestDto } from '../types/student';
export const registerStudent = async (studentData: StudentRegistrationRequestDto) => {
  try {
    if (!studentData.email || !studentData.password || !studentData.name) {
      throw new Error('Email, mot de passe et nom requis');
    }
    return await api.post('/registration/registerStudent', studentData);
  } catch (error) {
    throw error;
  }
};

// Inscription entreprise
import type { EnterpriseRegistrationRequestDto } from '../types/enterprise';
export const registerEnterprise = async (enterpriseData: EnterpriseRegistrationRequestDto) => {
  if (!enterpriseData.email || !enterpriseData.password || !enterpriseData.name) {
    throw new Error('Email, mot de passe et nom requis');
  }
  const formData = new FormData();
  Object.entries(enterpriseData).forEach(([key, value]) => {
    if (key === 'logo' && value) {
      formData.append(key, value as File);
    } else if (typeof value !== 'undefined') {
      formData.append(key, String(value));
    }
  });
  return await api.post('/registration/registerEnterprise', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Inscription enseignant
import type { TeacherRegistrationRequestDto } from '../types/teacher';
export const registerTeacher = async (teacherData: TeacherRegistrationRequestDto) => {
  try {
    if (!teacherData.email || !teacherData.password || !teacherData.name) {
      throw new Error('Email, mot de passe et nom requis');
    }
    return await api.post('/registration/registerTeacher', teacherData);
  } catch (error) {
    throw error;
  }
};

// Vérification d'email
import type { TokenVerificationRequestDto } from '../types/auth';
export const verifyEmail = async (verifyData: TokenVerificationRequestDto) => {
  try {
    if (!verifyData.email || !verifyData.token) {
      throw new Error('Email et token requis');
    }
    return await api.post('/registration/verifyEmail', verifyData);
  } catch (error) {
    throw error;
  }
};

// Renvoyer le token de vérification
export const resendToken = async (email: string) => {
  try {
    if (!email || email.trim() === '') {
      throw new Error('Email requis');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format d\'email invalide');
    }
    return await api.post('/registration/resendToken', null, { params: { email } });
  } catch (error) {
    throw error;
  }
};
