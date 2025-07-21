import { useForm } from 'react-hook-form';
import RegisterProgress from './RegisterProgress';

interface RegisterStep3EntrepriseProps {
  onPrev: () => void;
  onFinish: (data: EntrepriseFormData) => void;
}

export interface EntrepriseFormData {
  companyName: string;
  contactEmail: string;
  phone: string;
  address: string;
}

const RegisterStep3Entreprise = ({ onPrev, onFinish }: RegisterStep3EntrepriseProps) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<EntrepriseFormData>({ mode: 'onChange' });

  const onSubmit = (data: EntrepriseFormData) => {
    onFinish(data);
  };

  return (
    <div>
      <form className="w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-8 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="companyName" className="text-gray-700 font-medium mb-1">Nom de l'entreprise</label>
        <input
          id="companyName"
          type="text"
          placeholder="Nom de l'entreprise"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('companyName', { required: 'Le nom de l\'entreprise est requis.' })}
        />
        {errors.companyName && <span className="text-xs text-red-600 mb-2">{errors.companyName.message}</span>}

        <label htmlFor="contactEmail" className="text-gray-700 font-medium mb-1">Adresse email de contact</label>
        <input
          id="contactEmail"
          type="email"
          placeholder="contact@entreprise.com"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('contactEmail', {
            required: 'L\'adresse email est requise.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Veuillez entrer une adresse email valide.'
            }
          })}
        />
        {errors.contactEmail && <span className="text-xs text-red-600 mb-2">{errors.contactEmail.message}</span>}

        <label htmlFor="phone" className="text-gray-700 font-medium mb-1">Téléphone</label>
        <input
          id="phone"
          type="tel"
          placeholder="Numéro de téléphone"
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('phone', { required: 'Le numéro de téléphone est requis.' })}
        />
        {errors.phone && <span className="text-xs text-red-600 mb-2">{errors.phone.message}</span>}

        <label htmlFor="address" className="text-gray-700 font-medium mb-1">Adresse</label>
        <input
          id="address"
          type="text"
          placeholder="Adresse de l'entreprise"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...register('address', { required: 'L\'adresse est requise.' })}
        />
        {errors.address && <span className="text-xs text-red-600 mb-2">{errors.address.message}</span>}

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

export default RegisterStep3Entreprise; 