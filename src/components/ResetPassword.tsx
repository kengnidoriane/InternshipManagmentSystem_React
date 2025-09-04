import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { sendResetToken, verifyResetToken, resetPassword } from '../api/authApi';

interface ResetPasswordFormInputs {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: token, 3: password
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const password = watch('password');

  const handleSendToken = async (data: ResetPasswordFormInputs) => {
    setLoading(true);
    setError('');
    try {
      await sendResetToken(data.email);
      setEmail(data.email);
      setStep(2);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (data: ResetPasswordFormInputs) => {
    setLoading(true);
    setError('');
    try {
      await verifyResetToken(email, data.token);
      setStep(3);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPassword({ email, password: data.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: ResetPasswordFormInputs) => {
    if (step === 1) handleSendToken(data);
    else if (step === 2) handleVerifyToken(data);
    else handleResetPassword(data);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-login-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Mot de passe réinitialisé !</h3>
            <p className="text-sm">Votre mot de passe a été mis à jour avec succès.</p>
            <p className="text-sm mt-2">Redirection vers la connexion...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-login-gradient">
      {/* Logo */}
      <div className='flex flex-col justify-center mb-16 pt-8'>
        <img src={logo} alt="Logo" className="max-w-[350px] mx-auto" />
        <p className='text-[#e1d3c1] text-center mx-auto'>ELITE</p>
      </div>

      {/* Formulaire */}
      <div className="max-w-md mx-auto">
        <div className="border-2 border-[var(--color-jaune)] rounded-lg p-8 bg-[#2d2d2d] shadow-xl">
          {/* Header avec bouton retour */}
          <div className="flex items-center mb-6">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-[#e1d3c1] hover:text-white transition-colors mr-3"
              >
                <FiArrowLeft className="text-xl" />
              </button>
            ) : (
              <Link 
                to="/login" 
                className="text-[#e1d3c1] hover:text-white transition-colors mr-3"
              >
                <FiArrowLeft className="text-xl" />
              </Link>
            )}
            <h2 className="text-[var(--color-jaune)] text-xl font-light">
              {step === 1 ? 'Réinitialiser le mot de passe' :
               step === 2 ? 'Vérification par email' :
               'Nouveau mot de passe'}
            </h2>
          </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Étape 1: Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="email">
                  <span>Email</span>
                  <FiMail className="text-xl" />
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder='Entrez votre email'
                  className="w-full mb-4 px-4 py-3 border border-gray-600 bg-[#1a1a1a] text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-jaune)] focus:border-transparent transition-all"
                  {...register('email', { 
                    required: 'Email requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mb-2 text-center">{errors.email.message}</p>
                )}
              </motion.div>
            )}

            {/* Étape 2: Code de vérification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-center mb-4">
                  <p className="text-[#e2e2e2] text-sm mb-2">Un code a été envoyé à :</p>
                  <p className="text-[var(--color-jaune)] font-medium">{email}</p>
                </div>
                <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="token">
                  <span>Code de vérification</span>
                </label>
                <input
                  id="token"
                  type="text"
                  placeholder="Entrez le code reçu"
                  className="w-full mb-4 px-4 py-3 border border-gray-600 bg-[#1a1a1a] text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-jaune)] focus:border-transparent transition-all text-center"
                  {...register('token', { required: 'Code requis' })}
                />
                {errors.token && (
                  <p className="text-red-400 text-xs mb-2 text-center">{errors.token.message}</p>
                )}
              </motion.div>
            )}

            {/* Étape 3: Nouveau mot de passe */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="password">
                  <span>Nouveau mot de passe</span>
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
                  autoComplete="new-password"
                  placeholder='Nouveau mot de passe'
                  className="w-full mb-4 px-4 py-3 border border-gray-600 bg-[#1a1a1a] text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-jaune)] focus:border-transparent transition-all"
                  {...register('password', { 
                    required: 'Mot de passe requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mb-2 text-center">{errors.password.message}</p>
                )}

                <label className="flex justify-between items-center text-[#e2e2e2] mb-1" htmlFor="confirmPassword">
                  <span>Confirmer le mot de passe</span>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="focus:outline-none cursor-pointer"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                  </button>
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder='Confirmez le mot de passe'
                  className="w-full mb-2 px-4 py-3 border border-gray-600 bg-[#1a1a1a] text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-jaune)] focus:border-transparent transition-all"
                  {...register('confirmPassword', { 
                    required: 'Confirmation requise',
                    validate: value => value === password || 'Les mots de passe ne correspondent pas'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mb-2 text-center">{errors.confirmPassword.message}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#58693e] cursor-pointer text-white py-2 mt-5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Traitement...' : 
             step === 1 ? 'Envoyer le code' :
             step === 2 ? 'Vérifier le code' :
             'Réinitialiser le mot de passe'}
          </button>

          {/* Messages d'erreur et lien retour */}
          <div className="flex justify-between items-center mt-2 mb-4">
            <div className="text-xs text-red-400 min-h-[1.5em] text-left">
              {error}
            </div>
            <div className="text-xs text-white hover:underline">
              <Link to="/login" className="text-xs text-white hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </form>

        {/* Indicateur d'étape */}
        <div className="mt-6 flex justify-center space-x-2">
          {[1, 2, 3].map((stepNum) => (
            <motion.div
              key={stepNum}
              className={`w-3 h-3 rounded-full ${
                stepNum <= step ? 'bg-[var(--color-vert)]' : 'bg-gray-300'
              }`}
              animate={{
                scale: stepNum === step ? 1.2 : 1,
                backgroundColor: stepNum <= step ? 'var(--color-vert)' : '#d1d5db'
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          ))}
        </div>
        
        {/* Message informatif */}
        {step === 1 && (
          <div className="mt-4 p-3 bg-blue-900 border border-blue-600 rounded-lg text-blue-300 text-xs text-center">
            <p>Un code de vérification sera envoyé à votre adresse email.</p>
          </div>
        )}
        {step === 2 && (
          <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-300 text-xs text-center">
            <p>Vérifiez votre boîte mail et saisissez le code reçu.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;