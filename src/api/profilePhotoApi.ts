import { api, getAuthHeaders } from './api';

// Uploader une photo de profil
export const uploadProfilePhoto = async (photo: File) => {
  try {
    if (!photo) {
      throw new Error('Fichier photo requis');
    }
    
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(photo.type)) {
      throw new Error('Type de fichier non supporté. Utilisez JPG, PNG ou GIF.');
    }
    
    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximum: 5MB');
    }
    
    const formData = new FormData();
    formData.append('photo', photo);
    
    return await api.post('/profilePhoto/upload-photo', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 413) {
      throw new Error('Fichier trop volumineux');
    }
    throw new Error(error.response?.data?.message || error.message || 'Erreur lors de l\'upload de la photo');
  }
};

// Récupérer le logo de l'entreprise connectée
export const getEnterpriseLogo = async () => {
  try {
    return await api.get('/profilePhoto/getEnterpriseLogo', {
      responseType: 'blob',
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 404) {
      throw new Error('Logo non trouvé');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du logo');
  }
};