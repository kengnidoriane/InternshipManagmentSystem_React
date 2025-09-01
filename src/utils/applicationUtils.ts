/**
 * Utilitaires pour la gestion des candidatures étudiantes
 */

export interface ApplicationValidationResult {
  canApply: boolean;
  message?: string;
  reason?: 'already_applied' | 'already_approved' | 'on_internship' | 'invalid_offer';
}

/**
 * Vérifie si un étudiant peut candidater à une offre
 */
export const validateApplicationEligibility = (
  offerId: number,
  studentStatus: {
    isOnInternship: boolean;
    hasApplicationForOffer: (id: number) => boolean;
    hasApprovedApplicationForOffer: (id: number) => boolean;
  }
): ApplicationValidationResult => {
  // Vérifier si l'étudiant est déjà en stage
  if (studentStatus.isOnInternship) {
    return {
      canApply: false,
      message: 'Vous êtes déjà en stage et ne pouvez plus candidater à de nouvelles offres.',
      reason: 'on_internship'
    };
  }

  // Vérifier si l'étudiant a déjà une candidature pour cette offre
  if (studentStatus.hasApplicationForOffer(offerId)) {
    const hasApproved = studentStatus.hasApprovedApplicationForOffer(offerId);
    
    if (hasApproved) {
      return {
        canApply: false,
        message: 'Votre candidature pour cette offre a été approuvée par l\'entreprise. Consultez "Mes Candidatures" pour accepter ou décliner.',
        reason: 'already_approved'
      };
    } else {
      return {
        canApply: false,
        message: 'Vous avez déjà candidaté pour cette offre. Votre candidature est en attente de réponse.',
        reason: 'already_applied'
      };
    }
  }

  // L'étudiant peut candidater
  return {
    canApply: true
  };
};

/**
 * Génère le texte du bouton de candidature selon l'état
 */
export const getApplicationButtonText = (
  offerId: number,
  studentStatus: {
    isOnInternship: boolean;
    hasApplicationForOffer: (id: number) => boolean;
    hasApprovedApplicationForOffer: (id: number) => boolean;
  }
): string => {
  const validation = validateApplicationEligibility(offerId, studentStatus);
  
  if (!validation.canApply) {
    switch (validation.reason) {
      case 'on_internship':
        return 'En stage - Candidature impossible';
      case 'already_approved':
        return 'Candidature approuvée';
      case 'already_applied':
        return 'Déjà candidaté';
      default:
        return 'Candidature impossible';
    }
  }
  
  return 'Candidater';
};

/**
 * Détermine si le bouton de candidature doit être désactivé
 */
export const isApplicationButtonDisabled = (
  offerId: number,
  studentStatus: {
    isOnInternship: boolean;
    hasApplicationForOffer: (id: number) => boolean;
    hasApprovedApplicationForOffer: (id: number) => boolean;
  }
): boolean => {
  const validation = validateApplicationEligibility(offerId, studentStatus);
  return !validation.canApply;
};