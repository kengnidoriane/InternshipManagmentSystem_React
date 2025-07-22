import { create } from 'zustand';

export interface RegistrationFormData {
  type?: 'etudiant' | 'entreprise' | 'enseignant';
  email?: string;
  password?: string;
  confirmPassword?: string;
  nom?: string;
  prenom?: string;
  entrepriseName?: string;
  // Ajoute ici tous les champs nécessaires pour chaque step
  [key: string]: any;
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
