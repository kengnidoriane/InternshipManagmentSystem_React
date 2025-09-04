import React, { useState } from 'react';
import {FiEye, FiEyeOff } from 'react-icons/fi';
import { verifyCurrentPassword } from '../api/authApi';


interface PasswordVerificationProps {
  onVerified: (password: string) => void;
  onCancel: () => void;
}

const PasswordVerification: React.FC<PasswordVerificationProps> = ({ onVerified, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim() === '') {
      setError('Veuillez entrer votre mot de passe');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await verifyCurrentPassword(password);
      onVerified(password);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2d2d2d] border-2 border-[var(--color-jaune)] rounded-lg p-8 shadow-xl w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--color-jaune)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2d2d2d]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl text-[var(--color-jaune)] font-light mb-2">Vérification de sécurité</h2>
          <p className="text-[var(--color-light)] text-sm">Pour continuer, veuillez confirmer votre mot de passe</p>
        </div>

        
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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Entrez votre mot de passe"
          className="w-full px-4 py-3 border border-gray-600 bg-[#1a1a1a] text-white rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-jaune)] focus:border-transparent transition-all"
          disabled={loading}
        />
            {error && (
              <div className="mt-3 p-3 bg-red-900 border border-red-600 rounded-lg">
                <p className="text-red-300 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-600 text-[var(--color-light)] py-3 px-6 rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--color-vert)] text-white py-3 px-6 rounded-lg hover:bg-[#6b7d4b] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? 'Vérification...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordVerification;