import axios from 'axios';

// Inscription étudiant
export async function registerStudent(data: Record<string, unknown>) {
  const response = await axios.post('/registration/registerStudent', data);
  return response.data;
}

// Inscription entreprise
export async function registerEnterprise(data: Record<string, unknown>) {
  const response = await axios.post('/registration/registerEnterprise', data);
  return response.data;
}

// Inscription enseignant
export async function registerTeacher(data: Record<string, unknown>) {
  const response = await axios.post('/registration/registerTeacher', data);
  return response.data;
}

// Vérification email étudiant
export async function verifyStudentEmail(data: { email: string; token: string }) {
  const response = await axios.post('/registration/verifyStudentEmail', data);
  return response.data;
}

// Vérification email entreprise
export async function verifyEnterpriseEmail(data: { email: string; token: string }) {
  const response = await axios.post('/registration/verifyEnterpriseEmail', data);
  return response.data;
}

// Vérification email enseignant
export async function verifyTeacherEmail(data: { email: string; token: string }) {
  const response = await axios.post('/registration/verifyTeacherEmail', data);
  return response.data;
}

// Connexion
export async function login(data: { email: string; password: string }) {
  const response = await axios.post('/login', data);
  return response.data; // { token, role }
} 