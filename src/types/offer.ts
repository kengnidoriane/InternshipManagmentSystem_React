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
  pdfConvention?: File; // Fichier PDF de convention (optionnel)
  startDate: string; // ISO string
  endDate: string;   // ISO string
  numberOfPlaces: string;
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
