import { api, getAuthHeaders } from './api';

// Mettre à jour le mot de passe
export const updatePassword = async (password: string) => {
  try {
    if (!password || password.trim() === '') {
      throw new Error('Mot de passe requis');
    }
    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }
    return await api.patch('/updateProfile/updatePassword', { password }, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Mot de passe invalide ou trop faible');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
  }
};

// Mettre à jour l'email
export const updateEmail = async (email: string) => {
  try {
    if (!email || email.trim() === '') {
      throw new Error('Email requis');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Format d\'email invalide');
    }
    return await api.patch('/updateProfile/updateEmail', { email }, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('Cet email est déjà utilisé');
    }
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'email');
  }
};

// Récupérer l'email de l'utilisateur
export const getUserEmail = async () => {
  try {
    return await api.get('/updateProfile/getUserEmail', {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'email');
  }
};

// Supprimer le compte utilisateur
export const deleteUserAccount = async () => {
  try {
    return await api.delete('/updateProfile/deleteUserAccount', {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    if (error.response?.status === 403) {
      throw new Error('Opération non autorisée');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du compte');
  }
};

// Vérifier le mot de passe
export const verifyPassword = async (password: string) => {
  try {
    if (!password || password.trim() === '') {
      throw new Error('Mot de passe requis');
    }
    return await api.put('/updateProfile/verifyPassword', { password }, {
      headers: getAuthHeaders()
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Mot de passe incorrect');
    }
    if (error.response?.status === 403) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du mot de passe');
  }
};