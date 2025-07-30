// Interfaces générées à partir des DTOs backend liés à l'authentification et à l'utilisateur
export interface TokenVerificationRequestDto {
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
}
