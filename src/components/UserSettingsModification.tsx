import React, { useState } from 'react';
import {useAuthStore} from '../store/authStore';
import { updateEmail, updatePassword } from '../api/profileApi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


interface UserSettingsModificationProps {
  currentEmail: string;
  verifiedPassword: string;
  onCancel: () => void;
}

const UserSettingsModification: React.FC<UserSettingsModificationProps> = ({ 
  currentEmail,
  verifiedPassword,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    currentEmail,
    newEmail: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newEmail) {
      newErrors.newEmail = 'Veuillez saisir un nouvel email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.newEmail = 'Adresse email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Veuillez saisir un nouveau mot de passe';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailUpdate = async () => {
    if (!validateEmail()) return;
    
    setLoadingEmail(true);
    setErrors({});
    
    try {
      await updateEmail(formData.newEmail);
      setSuccessMessage('Votre email a été mis à jour avec succès.');
      setShowSuccessModal(true);
      
      setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 5000);
    } catch (error: any) {
      setErrors({ 
        newEmail: error?.message || 'Erreur lors de la mise à jour de l\'email' 
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return;
    
    setLoadingPassword(true);
    setErrors({});
    
    try {
      await updatePassword(formData.newPassword);
      setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
      setShowSuccessModal(true);
      
      setTimeout(() => {
        logout();
        navigate('/login', { replace: true });
      }, 5000);
    } catch (error: any) {
      setErrors({ 
        newPassword: error?.message || 'Erreur lors de la mise à jour du mot de passe' 
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="border rounded-lg border-[var(--color-jaune)] border-[2px] p-6 shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-thin mb-6 text-[var(--color-jaune)] text-center">Modifier vos paramètres</h2>
        
        <div>
          <div className="mb-4">
            <label className="block text-[var(--color-light)] font-medium mb-2" htmlFor="currentEmail">
              Email actuel
            </label>
            <input
              type="email"
              id="currentEmail"
              name="currentEmail"
              value={formData.currentEmail}
              disabled
              className="w-full border border-gray-300 rounded p-2 bg-[#e1d3c1] text-gray-700 outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[var(--color-light)] font-medium mb-2" htmlFor="newEmail">
              Nouveau email
            </label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 bg-[#e1d3c1] text-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-vert)]"
            />
            {errors.newEmail && <p className="text-red-500 text-sm mt-1">{errors.newEmail}</p>}
            
            <div className="mt-4">
              <button
                type="button"
                onClick={handleEmailUpdate}
                disabled={loadingEmail}
                className="w-full bg-[var(--color-vert)] text-white py-2 rounded-lg hover:bg-[#6b7d4b] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingEmail && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loadingEmail ? 'Mise à jour...' : 'Mettre à jour l\'email'}
              </button>
            </div>
          </div>
          
          <hr className="my-8 border-gray-600" />
          
          <div className="mb-4">
            <label className="block text-[var(--color-light)] font-medium mb-2" htmlFor="newPassword">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 bg-[#e1d3c1] text-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-vert)]"
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--color-light)] font-medium mb-2" htmlFor="confirmPassword">
              Confirmation du nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 bg-[#e1d3c1] text-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-vert)]"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            
            <div className="mt-4">
              <button
                type="button"
                onClick={handlePasswordUpdate}
                disabled={loadingPassword}
                className="w-full bg-[var(--color-vert)] text-white py-2 rounded-lg hover:bg-[#6b7d4b] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingPassword && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loadingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
        </div>
      </main>
      
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[#2d2d2d] border-2 border-[var(--color-vert)] rounded-lg p-8 shadow-xl max-w-md mx-4 text-center"
            >
              <div className="w-16 h-16 bg-[var(--color-vert)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-[var(--color-vert)] mb-3">
                Mise à jour réussie !
              </h3>
              <p className="text-[var(--color-light)] mb-4">
                {successMessage}
              </p>
              <p className="text-[var(--color-light)] text-sm mb-4">
                Vous allez être déconnecté et redirigé vers la page de connexion pour vous reconnecter avec vos nouvelles informations.
              </p>
              <div className="flex items-center justify-center gap-2 text-[var(--color-jaune)] text-sm">
                <div className="w-4 h-4 border-2 border-[var(--color-jaune)] border-t-transparent rounded-full animate-spin"></div>
                Redirection en cours...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserSettingsModification;