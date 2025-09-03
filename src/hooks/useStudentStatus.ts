import { useState, useEffect } from 'react';
import { getPendingApplicationsOfStudent, getApplicationsApprovedOfStudent, getStudentStatus } from '../api/studentApi';

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
      const [pendingRes, approvedRes, statusRes] = await Promise.all([
        getPendingApplicationsOfStudent(),
        getApplicationsApprovedOfStudent(),
        getStudentStatus()
      ]);
      
      const pendingData = pendingRes.data || [];
      const approvedData = approvedRes.data || [];
      const statusData = statusRes.data;
      
      setPendingApplications(pendingData);
      setApprovedApplications(approvedData);
      setAcceptedApplications([]);
      
      // Utiliser le statut depuis l'endpoint /status
      setIsOnInternship(statusData.onInternship || false);
      
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      setIsOnInternship(false);
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