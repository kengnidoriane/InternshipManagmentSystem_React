import React, { useState } from 'react';
import {FiEye, FiEyeOff } from 'react-icons/fi';


interface PasswordVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

const PasswordVerification: React.FC<PasswordVerificationProps> = ({ onVerified, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, vous devriez normalement vérifier le mot de passe avec l'API
    // Pour l'exemple, nous allons simplement accepter n'importe quel mot de passe
    if (password.trim() === '') {
      setError('Veuillez entrer votre mot de passe');
      return;
    }
    
    // Simuler une vérification réussie
    onVerified();
  };

  return (
    <div className="fixed inset-0 bg-login-gradient flex items-center justify-center z-50">
        <h2 className="text-xl text-[var(--color-jaune)] text-center font-bold mb-4">Vérification</h2>

      <div className="rounded-lg p-6 shadow-lg w-full max-w-sm">
        <p className="mb-4 text-[var(--color-light)]">Pour continuer Veuillez inserer votre mot de passe </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
        />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="flex gap-2 w-full justify-between mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="border w-full border-[var(--color-vert)] text-[var(--color-light)] py-1 px-6 rounded transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-[var(--color-vert)] w-full text-[var(--color-light)] py-1 px-6 rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordVerification;