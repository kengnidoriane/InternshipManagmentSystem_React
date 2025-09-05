import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getUserEmail } from '../api/profileApi';
import TeacherHeader from './teacher/TeacherHeader';
import EnterpriseHeader from './entreprise/EnterpriseHeader';
import EtudiantHeader from './EtudiantHeader';
import AdminHeader from './admin/AdminHeader';
import PasswordVerification from './PasswordVerification';
import UserSettingsModification from './UserSettingsModification';
import LogoutConfirmation from './LogoutConfirmation';

const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const maskedPassword = '••••••••';

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserEmail();
        setUserEmail(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des infos utilisateur:', error);
        setUserEmail('Email non disponible');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleModifyClick = () => {
    setShowPasswordVerification(true);
  };

  const [verifiedPassword, setVerifiedPassword] = useState('');

  const handlePasswordVerified = (password: string) => {
    setVerifiedPassword(password);
    setShowPasswordVerification(false);
    setShowModification(true);
  };

  const handleCancelVerification = () => {
    setShowPasswordVerification(false);
  };

  const handleCancelModification = () => {
    setShowModification(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const renderHeader = () => {
    if (role === 'TEACHER') return <TeacherHeader />;
    if (role === 'ENTERPRISE') return <EnterpriseHeader />;
    if (role === 'STUDENT') return <EtudiantHeader />;
    if (role === 'ADMIN') return <AdminHeader />;
    return null;
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      {renderHeader()}
      {!showModification && (
        <main className="container mx-auto px-4 py-8 flex flex-col items-center">
          <h2 className="text-2xl font-thin mb-6 text-[var(--color-jaune)] text-center">Vos paramètres</h2>
          
          <div className="border rounded-lg border-[var(--color-jaune)] border-[2px] p-6 mb-10 shadow-lg w-full max-w-3xl">
            {loading ? (
              <div className="text-[var(--color-light)] text-center">Chargement...</div>
            ) : (
              <>
                <div className="mb-4">
                  <span className="text-[var(--color-light)] font-medium mb-2">Email: </span>
                  <span className="text-[var(--color-light)] p-2 rounded">{userEmail}</span>
                </div>
              
                <div className="mb-6">
                  <span className="text-[var(--color-light)] font-medium mb-2">Mot de passe: </span>
                  <span className="text-[var(--color-light)] p-2 rounded">{maskedPassword}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-end">

              <button 
                onClick={handleModifyClick}
                className="bg-[var(--color-vert)] text-[var(--color-light)] px-2 py-1 rounded cursor-pointer transition-colors"
              >
                Modifier les paramètres
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-thin text-[var(--color-jaune)] text-center">Deconnexion</h2>
          <div className="mt-8 w-full max-w-3xl">
            <button 
              onClick={handleLogoutClick}
              className="bg-[var(--color-vert)] text-white px-4 py-2 rounded cursor-pointer w-full"
            >
              Déconnexion
            </button>
          </div>
        </main>
      )}

      {showPasswordVerification && (
        <PasswordVerification 
          onVerified={handlePasswordVerified} 
          onCancel={handleCancelVerification} 
        />
      )}

      {showModification && (
        <UserSettingsModification 
          currentEmail={userEmail}
          verifiedPassword={verifiedPassword}
          onCancel={handleCancelModification} 
        />
      )}

      {showLogoutConfirmation && (
        <LogoutConfirmation 
          onConfirm={() => {
            // Logique de déconnexion
            const logout = useAuthStore.getState().logout;
            logout();
            navigate('/login', { replace: true });
          }} 
          onCancel={handleCancelLogout} 
        />
      )}
    </div>
  );
};

export default UserSettings;