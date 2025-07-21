import { useForm } from 'react-hook-form';
import RegisterProgress from './RegisterProgress';

interface RegisterStep3EnseignantProps {
  onPrev: () => void;
  onFinish: (data: EnseignantFormData) => void;
}

export interface EnseignantFormData {
  lastName: string;
  firstName: string;
  department: string;
}

const RegisterStep3Enseignant = ({ onPrev, onFinish }: RegisterStep3EnseignantProps) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<EnseignantFormData>({ mode: 'onChange' });

  const onSubmit = (data: EnseignantFormData) => {
    onFinish(data);
  };

  return (
    <div>
      <form className="w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-8 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('firstName', { required: 'Le prénom est requis.' })}
        />
        {errors.firstName && <span className="text-xs text-red-600 mb-2">{errors.firstName.message}</span>}

        <label htmlFor="department" className="text-gray-700 font-medium mb-1">Département</label>
        <input
          id="department"
          type="text"
          placeholder="Département"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('department', { required: 'Le département est requis.' })}
        />
        {errors.department && <span className="text-xs text-red-600 mb-2">{errors.department.message}</span>}

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
      <RegisterProgress step={3} onStepClick={(s) => { if (s === 1) onPrev(); if (s === 2) onPrev(); }} />
    </div>
  );
};

export default RegisterStep3Enseignant; 