import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './RegisterSuccess.module.css';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const showMsgTimer = setTimeout(() => setShowMessage(true), 400);
    const redirectTimer = setTimeout(() => {
      if (role === 'ETUDIANT') {
        navigate('/etudiant/stages');
      } else if (role === 'ENSEIGNANT') {
        navigate('/dashboard-enseignant');
      } else if (role === 'ENTREPRISE') {
        navigate('/dashboard-entreprise');
      } else {
        navigate('/');
      }
    }, 2500);
    return () => {
      clearTimeout(showMsgTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, role]);

  return (
    <div className={styles.container}>
      <h1 className={styles.felicitations}>Félicitations</h1>
      <div className={styles.dot}></div>
      <div className={styles.box + (showMessage ? ' ' + styles.show : '')}>
        {showMessage && (
          <>
            <p className={styles.text}>Votre compte a été créé avec succès</p>
            <p className={styles.text}>
              {role === 'ETUDIANT'
                ? 'Vous allez être redirigé vers la liste des stages.'
                : role === 'ENSEIGNANT'
                ? 'Vous allez être redirigé vers votre dashboard enseignant.'
                : role === 'ENTREPRISE'
                ? 'Vous allez être redirigé vers votre dashboard entreprise.'
                : 'Vous allez être redirigé vers la page d’accueil.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterSuccess; 