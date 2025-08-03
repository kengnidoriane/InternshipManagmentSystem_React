import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function Felicitations() {
  const navigate = useNavigate();
  const [delay, setDelay] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay((d) => d - 1);
    }, 1000);
    const timeout = setTimeout(() => {
      navigate('/etudiant/stages');
    }, 4000);
    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [navigate]);

  return (
    <motion.div
      className="w-full max-w-md mx-auto mt-16 p-8 bg-[#f7f4ef] rounded-xl shadow-lg flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
        className="mb-6"
      >
        <CheckCircleIcon className="h-20 w-20 text-green-500" />
      </motion.div>
      <h2 className="text-2xl font-bold text-[var(--color-jaune)] mb-4 text-center">Félicitations !</h2>
      <p className="text-[var(--color-vert)] text-center mb-6">
        Votre compte a été créé avec succès.<br />
        Vous allez être redirigé vers la liste des stages dans <span className="font-bold">{delay}</span> seconde{delay > 1 ? 's' : ''}...
      </p>
      <button
        onClick={() => navigate('/etudiant/stages')}
        className="bg-[var(--color-vert)] text-[#e1d3c1] px-6 py-2 rounded transition-colors hover:bg-[var(--color-jaune)]"
      >
        Voir les stages maintenant
      </button>
    </motion.div>
  );
}
