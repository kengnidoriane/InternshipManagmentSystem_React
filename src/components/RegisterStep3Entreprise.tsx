import { useForm } from 'react-hook-form';
import RegisterProgress from './RegisterProgress';

import { useRegistrationStore } from '../store/registrationStore';

export interface EntrepriseFormData {
  contactEmail: string;
  companyName: string;
  activite: string;
}

type Props = {
  onPrev: () => void;
  onFinish: (data: EntrepriseFormData) => void;
};

const RegisterStep3Entreprise = ({ onPrev, onFinish }: Props) => {
  const { formData, setFormData, setStep } = useRegistrationStore();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<EntrepriseFormData>({
    mode: 'onChange',
    defaultValues: {
      contactEmail: formData.contactEmail || '',
      companyName: formData.companyName || '',
      activite: formData.activite || '',
    },
  });

  const onSubmit = (data: EntrepriseFormData) => {
    onFinish(data);
  };

  // Plus besoin de handlePrev, on utilise onPrev directement du parent

  return (
    <div>
      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <p className='my-3 text-[#e2e2e2]'>Informations de l'entreprise</p>
      <label htmlFor="contactEmail" className="text-[#e2e2e2] text-2xl font-light mb-1">Email</label>
        <input
          id="contactEmail"
          type="email"
          className="w-full mb-4 text-center rounded bg-[#e1d3c1] focus:outline-none"
          {...register('contactEmail', {
            required: 'L\'adresse email est requise.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Veuillez entrer une adresse email valide.'
            }
          })}
        />
        {errors.contactEmail && <span className="text-xs text-red-600 mb-2">{errors.contactEmail.message}</span>}

        <label htmlFor="companyName" className="text-[#e2e2e2] text-2xl font-light mb-1">Nom entreprise</label>
        <input
          id="companyName"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('companyName', { required: 'Le nom de l\'entreprise est requis.' })}
        />
        {errors.companyName && <span className="text-xs text-red-600 mb-2">{errors.companyName.message}</span>}

       
        <label htmlFor="activite" className="text-[#e2e2e2] text-2xl font-light mb-1">Secteur d'activite</label>
        <input
          id="activite"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('activite', { required: 'Le numéro de téléphone est requis.' })}
        />
        {errors.activite && <span className="text-xs text-red-600 mb-2">{errors.activite.message}</span>}

      
        <div className="flex gap-2 w-full justify-between mt-4">
          <button
            type="button"
            className="border border-[var(--color-vert)] text-[var(--color-light)] py-1 px-6 rounded transition-colors w-full cursor-pointer"
            onClick={onPrev}
          >
            Précédent
          </button>
          <button
            type="submit"
            className="bg-[var(--color-vert)] text-[var(--color-light)] py-1 px-6 rounded transition-colors w-full cursor-pointer"
            disabled={!isValid}
          >
            Finish
          </button>
        </div>
      </form>
      <RegisterProgress step={3} onStepClick={(s) => { if (s === 1) setStep(1); if (s === 2) setStep(2); }} />
    </div>
  );
};

export default RegisterStep3Entreprise; 