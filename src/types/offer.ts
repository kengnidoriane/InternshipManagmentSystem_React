// TypeScript interface based on backend OfferResponseDto, EnterpriseOfferResponseDto, and OfferRequestDto
export interface EnterpriseOfferResponseDto {
  id: number;
  name: string;
  email: string;
  sector: string;
  matriculation: string;
}

export interface OfferRequestDto {
  title: string;
  description: string;
  domain: string;
  job: string;
  requirements: string;
  typeOfInternship: string;
  pdfConvention?: File; // Fichier PDF de convention (optionnel)
  startDate: string; // ISO string
  endDate: string;   // ISO string
}

export interface OfferResponseDto {
  id: number;
  title: string;
  description: string;
  domain: string;
  startDate: string; // ISO string from backend
  endDate: string;   // ISO string from backend
  status: string;
  enterprise: EnterpriseOfferResponseDto;
  convention?: any;
  // Ajoute ici d'autres champs si besoin (ex: places, postulants, etc.)
}
