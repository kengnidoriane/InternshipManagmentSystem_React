import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import RegisterProgress from './RegisterProgress';

import { useRegistrationStore } from '../store/registrationStore';

const RegisterStep1 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { formData, setFormData, setStep } = useRegistrationStore();
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      email: formData.email || '',
      password: formData.password || '',
      confirmPassword: '',
    },
  });

  const onSubmit = (formDataStep1: { email: string; password: string; confirmPassword: string }) => {
    setFormData({ email: formDataStep1.email, password: formDataStep1.password });
    setStep(2);
  };


  return (
    <div>
      <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        {/* <label htmlFor="email" className="text-gray-700 font-medium mb-1 flex items-center gap-2">
          <FiMail className="text-xl text-gray-400" />
          Email
        </label> */}
        <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="email">
            <span>Email</span>
            <FiMail className="text-xl" />
          </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full mb-2 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('email', {
            required: 'L\'adresse email est requise.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Veuillez entrer une adresse email valide.'
            }
          })}
        />
        {errors.email && <span className="text-xs text-red-600 mb-2">{errors.email.message}</span>}

        {/* Mot de passe */}
        <label htmlFor="password" className="flex justify-between items-center text-[#e2e2e2] mb-1">
          <span>Mot de passe</span>
          <button
              type="button"
              tabIndex={-1}
              className="focus:outline-none cursor-pointer"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
            </button>
          
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="-"
          className="w-full mb-2 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('password', {
            required: 'Le mot de passe est requis.',
            minLength: {
              value: 6,
              message: 'Le mot de passe doit contenir au moins 6 caractères.'
            }
          })}
        />
        {errors.password && <span className="text-xs text-red-600 mb-2">{errors.password.message}</span>}

        {/* Confirmation du mot de passe */}
        <label htmlFor="confirmPassword" className="flex justify-between items-center text-[#e2e2e2] mb-1">
          <span>Confirmation du mot de passe</span>
          <button
              type="button"
              tabIndex={-1}
              className="focus:outline-none cursor-pointer"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
            </button>
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="-"
          className="w-full mb-2 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
          {...register('confirmPassword', {
            required: 'La confirmation du mot de passe est requise.',
            validate: value => value === watch('password') || 'Les mots de passe ne correspondent pas.'
          })}
        />
        {errors.confirmPassword && <span className="text-xs text-red-600 mb-2">{errors.confirmPassword.message}</span>}

        <button
          type="submit"
          className="w-full bg-[var(--color-vert)] cursor-pointer text-white font-semibold py-1 mt-8 rounded transition-colors disabled:opacity-50"
          disabled={!isValid}
        >
          Suivant
        </button>
        <div className="w-full flex justify-end mt-2">
          <button
            type="button"
            className="text-xs text-white hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            J'ai déjà un compte
          </button>
        </div>
      </form>
      <RegisterProgress step={1} onStepClick={() => {}} />
    </div>
  );
};

export default RegisterStep1; 