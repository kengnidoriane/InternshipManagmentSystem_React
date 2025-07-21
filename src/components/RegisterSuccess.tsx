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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1A0F1B] via-[#1E111F] to-[#5E1E63]">
      <h1 className="text-4xl font-light text-[#d1a85b] mb-12">Félicitations</h1>
      <div className="border-2 border-[#d1a85b] rounded-lg px-12 py-8">
        <p className="text-white text-lg mb-2">Votre compte a été créé avec succès</p>
        <p className="text-white text-lg">Vous allez être redirigé vers la page d’accueil.</p>
      </div>
    </div>
  );
};

export default RegisterSuccess; 