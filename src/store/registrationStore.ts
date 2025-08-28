import { create } from 'zustand';

export interface RegistrationFormData {
  type?: 'etudiant' | 'entreprise' | 'enseignant';
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  firstName?: string;
  sector?: string;
  languages?: string[];
  githubLink?: string;
  linkedinLink?: string;
  entrepriseName?: string;
  contact?: string;
  location?: string;
  country?: string;
  city?: string;
  sectorOfActivity?: string;
  remote?: boolean;
  paying?: boolean;
  logo?: File;
  matriculation?: string;
  department?: string;
}

interface RegistrationState {
  step: number;
  formData: RegistrationFormData;
  setStep: (step: number) => void;
  setFormData: (data: Partial<RegistrationFormData>) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  step: 1,
  formData: {},
  setStep: (step) => set({ step }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ step: 1, formData: {} }),
}));
