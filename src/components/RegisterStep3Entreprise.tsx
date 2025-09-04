import { useForm } from 'react-hook-form';
import RegisterProgress from './RegisterProgress';

import { useRegistrationStore } from '../store/registrationStore';

export interface EntrepriseFormData {
  name: string;
  email: string;
  matriculation: string;
  password: string;
  contact: string;
  location: string;
  country: string;
  city: string;
  sectorOfActivity: string;
  logo?: File;
}

type Props = {
  onPrev: () => void;
  onFinish: (data: EntrepriseFormData) => void;
};

const RegisterStep3Entreprise = ({ onPrev, onFinish }: Props) => {
  const { formData, setStep } = useRegistrationStore();
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm<EntrepriseFormData>({
    mode: 'onChange',
    defaultValues: {
      name: formData.name || '',
      email: formData.email || '',
      matriculation: formData.matriculation || '',
      password: '',
      contact: formData.contact || '',
      location: formData.location || '',
      country: formData.country || '',
      city: formData.city || '',
      sectorOfActivity: formData.sectorOfActivity || '',
      logo: undefined,
    },
  });

  const onSubmit = (data: EntrepriseFormData) => {
    onFinish(data);
  };

  // Gestion du champ fichier (logo)
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('logo', e.target.files[0], { shouldValidate: true });
    }
  };


  // Plus besoin de handlePrev, on utilise onPrev directement du parent

  return (
    <div>
      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <p className='my-3 text-[#e2e2e2]'>Informations de l'entreprise</p>

        <label htmlFor="name" className="text-[#e2e2e2] text-2xl font-light mb-1">Nom de l'entreprise</label>
        <input
          id="name"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('name', { required: 'Le nom de l\'entreprise est requis.' })}
        />
        {errors.name && <span className="text-xs text-red-600 mb-2">{errors.name.message}</span>}

        <label htmlFor="email" className="text-[#e2e2e2] text-2xl font-light mb-1">Email</label>
        <input
          id="email"
          type="email"
          className="w-full mb-4 text-center rounded bg-[#e1d3c1] focus:outline-none"
          {...register('email')}
          value={formData.email || ''}
          readOnly
        />
        {/* Pas de message d'erreur pour email readonly */}

        <label htmlFor="matriculation" className="text-[#e2e2e2] text-2xl font-light mb-1">Matricule</label>
        <input
          id="matriculation"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('matriculation', { required: 'Le matricule est requis.' })}
        />
        {errors.matriculation && <span className="text-xs text-red-600 mb-2">{errors.matriculation.message}</span>}



        <label htmlFor="contact" className="text-[#e2e2e2] text-2xl font-light mb-1">Contact</label>
        <input
          id="contact"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('contact', { required: 'Le contact est requis.' })}
        />
        {errors.contact && <span className="text-xs text-red-600 mb-2">{errors.contact.message}</span>}

        <label htmlFor="location" className="text-[#e2e2e2] text-2xl font-light mb-1">Localisation</label>
        <input
          id="location"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('location', { required: 'La localisation est requise.' })}
        />
        {errors.location && <span className="text-xs text-red-600 mb-2">{errors.location.message}</span>}

        <label htmlFor="country" className="text-[#e2e2e2] text-2xl font-light mb-1">Pays</label>
        <input
          id="country"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('country', { required: 'Le pays est requis.' })}
        />
        {errors.country && <span className="text-xs text-red-600 mb-2">{errors.country.message}</span>}

        <label htmlFor="city" className="text-[#e2e2e2] text-2xl font-light mb-1">Ville</label>
        <input
          id="city"
          type="text"
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('city', { required: 'La ville est requise.' })}
        />
        {errors.city && <span className="text-xs text-red-600 mb-2">{errors.city.message}</span>}

        <label htmlFor="sectorOfActivity" className="text-[#e2e2e2] text-2xl font-light mb-1">Secteur d'activité</label>
        <input
          id="sectorOfActivity"
          type="text"
          placeholder="Ex: Informatique, Commerce, Santé..."
          className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] focus:outline-none"
          {...register('sectorOfActivity', { required: 'Le secteur d\'activité est requis.' })}
        />
        {errors.sectorOfActivity && <span className="text-xs text-red-600 mb-2">{errors.sectorOfActivity.message}</span>}

        <label htmlFor="logo" className="text-[#e2e2e2] text-2xl font-light mb-1">Logo (facultatif)</label>
        <input
          id="logo"
          type="file"
          accept="image/*"
          className="w-full mb-4 text-center bg-[#e1d3c1] focus:outline-none"
          onChange={handleLogoChange}
        />
        {errors.logo && <span className="text-xs text-red-600 mb-2">{errors.logo.message}</span>}

      
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