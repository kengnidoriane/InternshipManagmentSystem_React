// TypeScript interface based on backend OfferResponseDto, EnterpriseOfferResponseDto, and OfferRequestDto
export interface EnterpriseOfferResponseDto {
  id: number;
  name: string;
  email: string;
  sectorOfActivity: string;
  inPartnership: boolean;
  matriculation: string;
  country: string;
  city: string;
  hasLogo: {
    hasLogo: boolean;
  };
}

export interface OfferRequestDto {
  title: string;
  description: string;
  domain: string;
  typeOfInternship: string;
  job: string;
  requirements: string;
  startDate: string; // ISO string - sera converti en LocalDate par le backend
  endDate: string;   // ISO string - sera converti en LocalDate par le backend
  numberOfPlaces: number; // ✅ Corrigé: number au lieu de string
  paying: boolean;
  remote: boolean;
}

export interface OfferResponseDto {
  id: number;
  title: string;
  description: string;
  domain: string;
  typeOfInternship: string;
  job: string;
  requirements: string;
  numberOfPlaces: string;
  durationOfInternship: number;
  startDate: string; // ISO string from backend
  endDate: string;   // ISO string from backend
  status: string;
  paying: boolean;
  remote: boolean;
  enterprise: EnterpriseOfferResponseDto;
  convention?: any;
}
