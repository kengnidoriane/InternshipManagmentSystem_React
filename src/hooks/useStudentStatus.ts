import { useState, useEffect } from 'react';
import { getPendingApplicationsOfStudent, getApplicationsApprovedOfStudent } from '../api/studentApi';

interface StudentStatus {
  isOnInternship: boolean;
  hasApplicationForOffer: (offerId: number) => boolean;
  hasApprovedApplicationForOffer: (offerId: number) => boolean;
  pendingApplications: any[];
  approvedApplications: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useStudentStatus = (): StudentStatus => {
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnInternship, setIsOnInternship] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        getPendingApplicationsOfStudent(),
        getApplicationsApprovedOfStudent()
      ]);
      
      const pendingData = pendingRes.data || [];
      const approvedData = approvedRes.data || [];
      
      setPendingApplications(pendingData);
      setApprovedApplications(approvedData);
      
      // Si les deux listes sont vides, l'étudiant est probablement en stage
      const isStudentOnInternship = pendingData.length === 0 && approvedData.length === 0;
      setIsOnInternship(isStudentOnInternship);
      
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      // En cas d'erreur, considérer que l'étudiant n'est pas en stage
      setIsOnInternship(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const hasApplicationForOffer = (offerId: number): boolean => {
    return [...pendingApplications, ...approvedApplications]
      .some((app: any) => app.offer?.id === offerId);
  };

  const hasApprovedApplicationForOffer = (offerId: number): boolean => {
    return approvedApplications.some((app: any) => app.offer?.id === offerId);
  };

  return {
    isOnInternship,
    hasApplicationForOffer,
    hasApprovedApplicationForOffer,
    pendingApplications,
    approvedApplications,
    loading,
    refresh: fetchApplications
  };
};