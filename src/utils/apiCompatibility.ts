// Wrapper pour maintenir la compatibilité avec l'existant
import * as studentApi from '../api/studentApi';
import * as enterpriseApi from '../api/enterpriseApi';

// Feature flags pour activer progressivement les nouveaux endpoints
const FEATURE_FLAGS = {
  useNewStudentProfile: false,
  useNewEnterpriseInfo: false,
  useNewPasswordVerification: false,
  useNewEmailUpdate: false
};

// Wrapper pour le profil étudiant
export const getStudentInfo = async () => {
  if (FEATURE_FLAGS.useNewStudentProfile) {
    try {
      return await studentApi.getCurrentStudentInfo();
    } catch (error) {
      console.warn('Nouveau endpoint échoué, fallback vers l\'ancien');
    }
  }
  
  // Fallback vers l'ancien système (si existant)
  throw new Error('Ancien endpoint non disponible - utiliser le nouveau');
};

// Wrapper pour les informations entreprise
export const getEnterpriseInfo = async () => {
  if (FEATURE_FLAGS.useNewEnterpriseInfo) {
    try {
      return await enterpriseApi.getCurrentEnterpriseInfo();
    } catch (error) {
      console.warn('Nouveau endpoint échoué');
      throw error;
    }
  }
  
  // Fallback vers l'ancien système
  throw new Error('Feature non activée');
};

// Fonction pour activer une feature
export const enableFeature = (feature: keyof typeof FEATURE_FLAGS) => {
  FEATURE_FLAGS[feature] = true;
  console.log(`Feature ${feature} activée`);
};

// Fonction pour désactiver une feature
export const disableFeature = (feature: keyof typeof FEATURE_FLAGS) => {
  FEATURE_FLAGS[feature] = false;
  console.log(`Feature ${feature} désactivée`);
};