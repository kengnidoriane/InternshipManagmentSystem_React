import React, { useState } from 'react';
import {useAuthStore} from '../store/authStore';
import { updateEmail, updatePassword } from '../api/profileApi';


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
  const [loading, setLoading] = useState(false);
  const { role } = useAuthStore();

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.newEmail = 'Adresse email invalide';
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Vérifier qu'au moins un champ est à modifier
    if (!formData.newEmail && !formData.newPassword) {
      setErrors({ general: 'Veuillez renseigner au moins un nouveau paramètre' });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Modifier l'email si fourni
      if (formData.newEmail) {
        await updateEmail(formData.newEmail);
      }
      
      // Modifier le mot de passe si fourni
      if (formData.newPassword) {
        await updatePassword(formData.newPassword);
      }
      
      alert('Paramètres mis à jour avec succès');
      onCancel();
    } catch (error: any) {
      setErrors({ 
        general: error?.response?.data?.message || 'Erreur lors de la mise à jour' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="border rounded-lg border-[var(--color-jaune)] border-[2px] p-6 shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-thin mb-6 text-[var(--color-jaune)] text-center">Modifier vos paramètres</h2>
        
        <form onSubmit={handleSubmit}>
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
          </div>
          

          
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
              Confirmation du nouveau M.D.P
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
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-60 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
        </div>
      </main>
  );
};

export default UserSettingsModification;