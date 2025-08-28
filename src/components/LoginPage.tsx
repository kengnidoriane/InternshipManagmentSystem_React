import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { create } from 'zustand';
import logo from '../assets/logo.png';
import { login } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface LoginState {
  error: string;
  setError: (msg: string) => void;
  clearError: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
  error: '',
  setError: (msg: string) => set((state) => ({ ...state, error: msg })),
  clearError: () => set((state) => ({ ...state, error: '' })),
}));

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const { error, setError, clearError } = useLoginStore();
  const setAuth = useAuthStore((state) => state.login);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login(data); // login de l'api
      const { token, role } = response.data;
      if (token && role) {
        setAuth(token, role); // Stocke dans Zustand et localStorage
        clearError();
        // Redirection automatique selon le rôle
        if (role === 'STUDENT') {
          navigate('/dashboard-etudiant');
        } else if (role === 'TEACHER') {
          navigate('/enseignant/offres');
        } else if (role === 'ENTERPRISE') {
          navigate('/entreprise/dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient">
      <div className='flex flex-col justify-center mb-32 '>
        <img src={logo} alt="Logo" className="max-w-[350px] mx-auto " />
        <p className='text-[#e1d3c1] text-center mx-auto space'>ELITE</p>
      </div>
        <form className="max-w-80 mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="email">
            <span>Email</span>
            <FiMail className="text-xl" />
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder='-'
            className="w-full mb-4 border text-center border-gray-300 bg-[#e1d3c1] rounded focus:outline-none"
            {...register('email', { required: 'Email requis' })}
          />
          <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="password">
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
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder='-'
            className="w-full mb-2 bg-[#e1d3c1] text-center border border-gray-300 rounded focus:outline-none"
            {...register('password', { required: 'Mot de passe requis' })}
          />
        
          <button
            type="submit"
            className="w-full bg-[#58693e] cursor-pointer text-white py-1 mt-5 rounded transition-colors"
          >
            Se connecter
          </button>
            <div className="flex justify-between items-center mt-2 mb-4">
            <div className="text-xs text-red-600 min-h-[1.5em] text-left">
              {error && 'Identifiants incorrects'}
            </div>
            <div className="text-xs text-white hover:underline">
              <a href="/register" className="text-xs text-white hover:underline">Créer un compte?</a>
            </div>
          </div>
        </form>
    </div>
  );
};

export default LoginPage;