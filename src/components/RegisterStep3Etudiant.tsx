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
      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <p className='my-3 text-[#e2e2e2]'>Informations de l'etudiant</p>
        <label htmlFor="lastName" className="text-[#e2e2e2] mb-1">Nom</label>
        <input
          id="lastName"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('lastName', { required: 'Le nom est requis.' })}
        />
        {errors.lastName && <span className="text-xs text-red-600 mb-2">{errors.lastName.message}</span>}

        <label htmlFor="firstName" className="text-[#e2e2e2] mb-1">Prénom</label>
        <input
          id="firstName"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('firstName', { required: 'Le prénom est requis.' })}
        />
        {errors.firstName && <span className="text-xs text-red-600 mb-2">{errors.firstName.message}</span>}

        <div className="flex w-full gap-2 justify-between mt-4">
          <button
            type="button"
            className="border border-[#58693e] text-[#e1d3c1] py-1 px-6 rounded transition-colors w-full"
            onClick={onPrev}
          >
            Précédent
          </button>
          <button
            type="submit"
            className="bg-[#58693e] text-[#e1d3c1] py-1 px-6 rounded transition-colors disabled:opacity-50 w-full"
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