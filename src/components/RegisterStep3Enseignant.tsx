import { useForm } from 'react-hook-form';
import RegisterProgress from './RegisterProgress';

import { useRegistrationStore } from '../store/registrationStore';

export interface EnseignantFormData {
  lastName: string;
  firstName: string;
  department: string;
}

type Props = {
  onPrev: () => void;
  onFinish: (data: EnseignantFormData) => void;
};

const RegisterStep3Enseignant = ({ onPrev, onFinish }: Props) => {
  const { formData, setFormData, setStep } = useRegistrationStore();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<EnseignantFormData>({
    mode: 'onChange',
    defaultValues: {
      lastName: formData.lastName || '',
      firstName: formData.firstName || '',
      department: formData.department || '',
    },
  });

  const onSubmit = (data: EnseignantFormData) => {
    onFinish(data);
  };

  // Plus besoin de handlePrev, on utilise onPrev directement du parent

  return (
    <div>
      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-[#e2e2e2] text-xs mb-4">Informations de l'enseignant</p>
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
          className="w-full mb-4 border text-center border-gray-300 focus:outline-none bg-[#e1d3c1] rounded"
          {...register('firstName', { required: 'Le prénom est requis.' })}
        />
        {errors.firstName && <span className="text-xs text-red-600 mb-2">{errors.firstName.message}</span>}

        <label htmlFor="department" className="text-[#e2e2e2] mb-1">Département</label>
        <select
          id="department"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('department', { required: 'Le département est requis.' })}
        >
          <option value="">-- Sélectionnez un département --</option>
          <option value="Informatique">Informatique</option>
          <option value="Génie mécanique">Génie mécanique</option>
          <option value="Administration des affaires">Administration des affaires</option>
          <option value="Psychologie">Psychologie</option>
          <option value="Biologie">Biologie</option>
          <option value="Droit">Droit</option>
          <option value="Économie">Économie</option>
          <option value="Architecture">Architecture</option>
          <option value="Sciences politiques">Sciences politiques</option>
          <option value="Sciences environnementales">Sciences environnementales</option>
        </select>
        {errors.department && <span className="text-xs text-red-600 mb-2">{errors.department.message}</span>}

        <div className="flex gap-2 w-full justify-between mt-4">
          <button
            type="button"
            className=" border w-full border-[var(--color-vert)] text-[var(--color-light)] py-1 px-6 rounded transition-colors cursor-pointer"
            onClick={onPrev}
          >
            Précédent
          </button>
          <button
            type="submit"
            className="bg-[var(--color-vert)] w-full text-[var(--color-light)] py-1 px-6 rounded transition-colors disabled:opacity-50 cursor-pointer"
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

export default RegisterStep3Enseignant; 