import React from 'react';

interface LogoutConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-login-gradient flex flex-col items-center justify-center z-50">
        <h2 className="text-xl text-[var(--color-jaune)] text-center font-bold mb-4">Confirmation de déconnexion</h2>
      <div className="border border-[var(--color-jaune)] p-6 shadow-lg w-full max-w-sm">
        <p className="text-[var(--color-light)] mb-6">
          Vous allez être déconnecté. Toutes les modifications non enregistrées seront perdues.
        </p>
        
        <div className="flex gap-2 w-full justify-between mt-4">
          <button
            onClick={onCancel}
            className="border w-full border-[var(--color-vert)] text-[var(--color-light)] py-1 px-6 rounded transition-colors cursor-pointer"
          >
            Non
          </button>
          <button
            onClick={onConfirm}
            className="bg-[var(--color-vert)] w-full text-[var(--color-light)] py-1 px-6 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            oui
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;