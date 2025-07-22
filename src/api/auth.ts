// src/api/authApi.ts
import axios from "axios";

// Créer une instance axios
const api = axios.create({
  baseURL: "http://localhost:8082", // à adapter en prod
  withCredentials: true, // si tu veux envoyer les cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data; // { token, role }
};

export const registerEnterprise = async (data: any) => {
  const response = await api.post("/registration/registerEnterprise", data);
  return response.data;
};

export const registerStudent = async (data: any) => {
  const response = await api.post("/registration/registerStudent", data);
  return response.data;
};

export const registerTeacher = async (data: any) => {
  const response = await api.post("/registration/registerTeacher", data);
  return response.data;
};

export const verifyEnterpriseEmail = async (data: { email: string; token: string }) => {
  const response = await api.post("/registration/verifyEnterpriseEmail", data);
  return response.data;
};

export const verifyStudentEmail = async (data: { email: string; token: string }) => {
  const response = await api.post("/registration/verifyStudentEmail", data);
  return response.data;
};

export const verifyTeacherEmail = async (data: { email: string; token: string }) => {
  const response = await api.post("/registration/verifyTeacherEmail", data);
  return response.data;
};

// Pour ajouter automatiquement le token dans les headers si nécessaire
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
