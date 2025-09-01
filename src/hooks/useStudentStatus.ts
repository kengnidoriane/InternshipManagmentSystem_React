import { useState, useEffect } from 'react';
import { getPendingApplicationsOfStudent, getApplicationsApprovedOfStudent } from '../api/studentApi';

interface StudentStatus {
  isOnInternship: boolean;
  hasApplicationForOffer: (offerId: number) => boolean;
  hasApprovedApplicationForOffer: (offerId: number) => boolean;
  hasAcceptedApplication: boolean;
  pendingApplications: any[];
  approvedApplications: any[];
  acceptedApplications: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useStudentStatus = (): StudentStatus => {
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<any[]>([]);
  const [acceptedApplications, setAcceptedApplications] = useState<any[]>([]);
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
      
      // Séparer les candidatures approuvées des candidatures acceptées
      const approved = approvedData.filter((app: any) => app.state === 'APPROVED');
      const accepted = approvedData.filter((app: any) => app.state === 'ACCEPTED');
      
      setPendingApplications(pendingData);
      setApprovedApplications(approved);
      setAcceptedApplications(accepted);
      
      // Un étudiant est en stage s'il a une candidature acceptée (state = 'ACCEPTED')
      setIsOnInternship(accepted.length > 0);
      
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      // Si erreur 403, l'étudiant est probablement déjà en stage
      if (error?.response?.status === 403) {
        setIsOnInternship(true);
      }
      setPendingApplications([]);
      setApprovedApplications([]);
      setAcceptedApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const hasApplicationForOffer = (offerId: number): boolean => {
    return [...pendingApplications, ...approvedApplications, ...acceptedApplications]
      .some((app: any) => app.offer?.id === offerId);
  };

  const hasApprovedApplicationForOffer = (offerId: number): boolean => {
    return [...approvedApplications, ...acceptedApplications]
      .some((app: any) => app.offer?.id === offerId);
  };

  return {
    isOnInternship,
    hasApplicationForOffer,
    hasApprovedApplicationForOffer,
    hasAcceptedApplication: acceptedApplications.length > 0,
    pendingApplications,
    approvedApplications,
    acceptedApplications,
    loading,
    refresh: fetchApplications
  };
};