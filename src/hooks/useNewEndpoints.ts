// Hook pour tester les nouveaux endpoints sans casser l'existant
import { useState } from 'react';
import { getCurrentStudentInfo, getStudentStatus } from '../api/studentApi';
import { getCurrentEnterpriseInfo } from '../api/enterpriseApi';
import { getOffersApprovedByTeacher } from '../api/teacherApi';

export const useNewEndpoints = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test du nouveau endpoint étudiant avec fallback
  const getStudentProfile = async () => {
    setLoading(true);
    try {
      const response = await getCurrentStudentInfo();
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      // Fallback vers l'ancien système si nécessaire
      console.warn('Nouveau endpoint échoué, utilisation du fallback');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Test du statut étudiant
  const checkStudentStatus = async () => {
    try {
      const response = await getStudentStatus();
      return response.data;
    } catch (err: any) {
      console.warn('Endpoint status non disponible:', err.message);
      return { onInternship: false, canApply: true }; // Valeur par défaut
    }
  };

  return {
    getStudentProfile,
    checkStudentStatus,
    loading,
    error
  };
};