import { api, getAuthHeaders } from './api';
import type { EnterpriseResponseDto } from '../types/enterprise';

// Récupérer les entreprises en attente de validation
export const getPendingEnterprises = () =>
  api.get<EnterpriseResponseDto[]>('/api/admin/approvalPendingEnterprise', {
    headers: getAuthHeaders()
  });

// Approuver ou rejeter une entreprise
export const approveEnterprise = (enterpriseId: number, approved: boolean) =>
  api.put<EnterpriseResponseDto>(`/api/admin/Enterprise/${enterpriseId}/approve?approved=${approved}`, {}, {
    headers: getAuthHeaders()
  });

// Télécharger le rapport Excel des stages
export const downloadInternshipsExcel = () =>
  api.get('/api/admin/internships.xlsx', { 
    responseType: 'blob',
    headers: getAuthHeaders()
  });

// Supprimer le compte admin
export const deleteAdminAccount = () =>
  api.delete('/api/admin/deleteAdminAccount', {
    headers: getAuthHeaders()
  });