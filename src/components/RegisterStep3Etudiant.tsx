import { useForm } from 'react-hook-form';
import RegisterProgress from './RegisterProgress';

import { useRegistrationStore } from '../store/registrationStore';

export interface EtudiantFormData {
  lastName: string;
  firstName: string;
}

type Props = {
  onPrev: () => void;
  onFinish: (data: EtudiantFormData) => void;
};

const RegisterStep3Etudiant = ({ onPrev, onFinish }: Props) => {
  const { formData, setFormData, setStep } = useRegistrationStore();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<EtudiantFormData>({
    mode: 'onChange',
    defaultValues: {
      lastName: formData.lastName || '',
      firstName: formData.firstName || '',
    },
  });

  const onSubmit = (data: EtudiantFormData) => {
    onFinish(data);
  };

  // Plus besoin de handlePrev, on utilise onPrev directement du parent

  return (
    <div>
      <form className="w-full px-8 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="lastName" className="text-gray-700 font-medium mb-1">Nom</label>
        <input
          id="lastName"
          type="text"
          placeholder="Nom"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('lastName', { required: 'Le nom est requis.' })}
        />
        {errors.lastName && <span className="text-xs text-red-600 mb-2">{errors.lastName.message}</span>}

        <label htmlFor="firstName" className="text-gray-700 font-medium mb-1">Prénom</label>
        <input
          id="firstName"
          type="text"
          placeholder="Prénom"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('firstName', { required: 'Le prénom est requis.' })}
        />
        {errors.firstName && <span className="text-xs text-red-600 mb-2">{errors.firstName.message}</span>}

        <div className="flex w-full justify-between mt-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded transition-colors"
            onClick={onPrev}
          >
            Précédent
          </button>
          <button
            type="submit"
            className="bg-[#58693e] hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-50"
            disabled={!isValid}
          >
            Terminer
          </button>
        </div>
      </form>
      <RegisterProgress step={3} onStepClick={(s) => { if (s === 1) setStep(1); if (s === 2) setStep(2); }} />
    </div>
  );
};


export default RegisterStep3Etudiant; 