import { api } from './api';

// Télécharger le fichier Excel des stages par département
export const downloadInternshipsExcel = () =>
  api.get('/api/admin/internships.xlsx', { responseType: 'blob' });

// Supprimer le compte administrateur
export const deleteAdminAccount = () =>
  api.delete('/api/admin/deleteAdminAccount');