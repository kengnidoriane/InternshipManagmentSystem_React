import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[var(--color-dark)] via-[var(--color-dark)] to-[#5E1E63]">
      <h1 className="text-4xl font-light text-[var(--color-jaune)] mb-12">Félicitations</h1>
      <div className="border-2 border-[var(--color-jaune)] rounded-lg px-12 py-8">
        <p className="text-white text-lg mb-2">Votre compte a été créé avec succès</p>
        <p className="text-white text-lg">Vous allez être redirigé vers la page d’accueil.</p>
      </div>
    </div>
  );
};

export default RegisterSuccess; 