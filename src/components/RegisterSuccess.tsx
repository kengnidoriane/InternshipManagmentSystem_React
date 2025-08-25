import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterSuccess.module.css';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const showMsgTimer = setTimeout(() => setShowMessage(true), 400);
    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    return () => {
      clearTimeout(showMsgTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.felicitations}>Félicitations</h1>
      <div className={styles.dot}></div>
      <div className={styles.box + (showMessage ? ' ' + styles.show : '')}>
        {showMessage && (
          <>
            <p className={styles.text}>Votre compte a été créé avec succès</p>
            <p className={styles.text}>
              Vous allez être redirigé vers la page de connexion.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterSuccess;