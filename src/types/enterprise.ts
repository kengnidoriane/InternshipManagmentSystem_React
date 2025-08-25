// Interface générée à partir du DTO backend EnterpriseRegistrationRequestDto
export interface EnterpriseRegistrationRequestDto {
  name: string;
  email: string;
  matriculation: string;
  password: string;
  contact: string;
  location: string;
  sectorOfActivity: string;
  country: string;
  city: string;
  // Pour logo, on utilise File ou undefined côté front
  logo?: File;
}

// Interface pour les entreprises partenaires et en attente
export interface EnterpriseResponseDto {
  id: number;
  name: string;
  email: string;
  sectorOfActivity: string;
  inPartnership: boolean;
  matriculation: string;
  hasLogo: {
    hasLogo: boolean;
  };
  country?: string;
  city?: string;
}
