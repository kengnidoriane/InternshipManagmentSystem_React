import axios from 'axios';

// Inscription étudiant
import type { StudentRegistrationRequestDto } from '../types/student';
export const registerStudent = (studentData: StudentRegistrationRequestDto) =>
  axios.post('/registration/registerStudent', studentData);

// Inscription entreprise
import type { EnterpriseRegistrationRequestDto } from '../types/enterprise';
export const registerEnterprise = (enterpriseData: EnterpriseRegistrationRequestDto) => {
  const formData = new FormData();
  Object.entries(enterpriseData).forEach(([key, value]) => {
    if (key === 'logo' && value) {
      formData.append(key, value as File);
    } else if (typeof value !== 'undefined') {
      formData.append(key, value as any);
    }
  });
  return axios.post('/registration/registerEnterprise', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Inscription enseignant
import type { TeacherRegistrationRequestDto } from '../types/teacher';
export const registerTeacher = (teacherData: TeacherRegistrationRequestDto) =>
  axios.post('/registration/registerTeacher', teacherData);

// Vérification d'email
import type { TokenVerificationRequestDto } from '../types/auth';
export const verifyEmail = (verifyData: TokenVerificationRequestDto) =>
  axios.post('/registration/verifyEmail', verifyData);

// Renvoyer le token de vérification
export const resendToken = (email: string) =>
  axios.post('/registration/resendToken', null, { params: { email } });
