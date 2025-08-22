import React, { useState } from 'react';
import {useAuthStore} from '../store/authStore';
import TeacherHeader from '../components/TeacherHeader';
import EnterpriseHeader from '../components/EnterpriseHeader';
import EtudiantHeader from '../components/EtudiantHeader';

interface UserSettingsModificationProps {
  currentEmail: string;
  onCancel: () => void;
}

const UserSettingsModification: React.FC<UserSettingsModificationProps> = ({ 
  currentEmail, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    currentEmail,
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { role } = useAuthStore();

  const renderHeader = () => {
    if (role === 'TEACHER') return <TeacherHeader />;
    if (role === 'ENTERPRISE') return <EnterpriseHeader />;
    if (role === 'STUDENT') return <EtudiantHeader />;
    return null;
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Ici, vous devriez appeler l'API pour mettre à jour les informations
    console.log('Mise à jour des informations:', formData);
    
    // Mettre à jour l'email dans le localStorage si un nouvel email est fourni
    if (formData.newEmail) {
      localStorage.setItem('userEmail', formData.newEmail);
    }
    
    // Simuler une mise à jour réussie
    alert('Paramètres mis à jour avec succès');
    onCancel();
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      {renderHeader()}
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Modifier vos paramètres</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="currentEmail">
              Email actuel
            </label>
            <input
              type="email"
              id="currentEmail"
              name="currentEmail"
              value={formData.currentEmail}
              disabled
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="newEmail">
              Nouveau email
            </label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newEmail && <p className="text-red-500 text-sm mt-1">{errors.newEmail}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="currentPassword">
              Mot de passe actuel
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="newPassword">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">
              Confirmation du nouveau M.D.P
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettingsModification;