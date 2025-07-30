// Interface générée à partir du DTO backend EnterpriseRegistrationRequestDto
export interface EnterpriseRegistrationRequestDto {
  name: string;
  email: string;
  matriculation: string;
  password: string;
  contact: string;
  location: string;
  country: string;
  remote: boolean;
  paying: boolean;
  // Pour logo, on utilise File ou undefined côté front
  logo?: File;
}
