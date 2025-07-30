import React from 'react';
import { motion } from 'framer-motion';
import EtudiantHeader from './EtudiantHeader';
import { Link } from 'react-router-dom';

export default function MonStageEtudiant() {
  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EtudiantHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <motion.div
          className="w-full max-w-xl mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Aucun stage</h2>
          <div className="mx-auto max-w-md border border-[#e1d3c1] rounded-lg py-7 px-6 bg-transparent flex flex-col items-center" style={{boxShadow: '0 0 0 2px #e1d3c1'}}>
            <div className="text-[var(--color-light)] text-sm text-left mb-6 w-full">
              Vous n’avez pas encore de stage.<br />
              Cliquez ci-dessous pour choisir un qui correspond à votre profil
            </div>
            <Link
              to="/etudiant/stages"
              className="w-full block bg-[var(--color-vert)] text-[var(--color-light)] text-base font-medium rounded px-4 py-2 mt-2 text-center hover:bg-[#6b7d4b] transition-colors"
            >
              Liste des offres
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
