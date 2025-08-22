// Interfaces générées à partir des DTOs backend liés à l'étudiant
export interface StudentApplicationDto {
  name: string;
  firstName: string;
  email: string;
}

export interface StudentRegistrationRequestDto {
  name: string;
  firstName: string;
  email: string;
  password: string;
  sector: string;
  languages: string[];
  department: string;
  githubLink?: string;
  linkedinLink?: string;
}

// Interface pour les données d'étudiant renvoyées par l'API
export interface StudentResponseDto {
  id: number;
  name: string;
  firstName: string;
  email: string;
  onInternship: boolean;
  department: string;
}
