import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateLanguages, updateGithubLink, updateLinkedinLink } from '../../api/studentApi';
import EtudiantHeader from '../EtudiantHeader';

export default function MonProfil() {
  const [newLanguage, setNewLanguage] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');

  const handleAddLanguage = async () => {
    if (newLanguage.trim()) {
      try {
        await updateLanguages(newLanguage);
        setNewLanguage('');
        alert('Langue ajoutée avec succès!');
      } catch (error: any) {
        alert(error.message || 'Erreur lors de l\'ajout de la langue');
      }
    }
  };

  const handleUpdateGithub = async () => {
    if (githubLink.trim()) {
      try {
        await updateGithubLink(githubLink);
        alert('Lien GitHub mis à jour avec succès!');
      } catch (error: any) {
        alert(error.message || 'Erreur lors de la mise à jour du lien GitHub');
      }
    }
  };

  const handleUpdateLinkedin = async () => {
    if (linkedinLink.trim()) {
      try {
        await updateLinkedinLink(linkedinLink);
        alert('Lien LinkedIn mis à jour avec succès!');
      } catch (error: any) {
        alert(error.message || 'Erreur lors de la mise à jour du lien LinkedIn');
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        // Note: Pas d'endpoint spécifique pour l'upload de photo étudiant dans le backend
        // L'endpoint uploadProfilePhoto est pour les entreprises
        alert('Fonctionnalité non disponible - endpoint manquant dans le backend');
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de la photo');
      }
    }
  };

  // Suppression de l'appel automatique à updateStudentStatus qui nécessite des paramètres
  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EtudiantHeader />
      <main className="flex flex-col items-center flex-1 px-4 pb-12">
        <motion.div
          className="w-full max-w-4xl mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Mon Profil</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="bg-[#f5ede3] rounded-lg shadow-md border border-[#e1d3c1] p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[var(--color-vert)] rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-[var(--color-dark)] text-lg font-semibold">Langues</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  value={newLanguage} 
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-vert)] bg-white text-[var(--color-dark)]" 
                  placeholder="Ex: Espagnol, Anglais..."
                />
                <button 
                  onClick={handleAddLanguage} 
                  className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-lg hover:bg-[#6b7d4b] transition-colors font-medium cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#f5ede3] rounded-lg shadow-md border border-[#e1d3c1] p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[var(--color-vert)] rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h3 className="text-[var(--color-dark)] text-lg font-semibold">GitHub</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  value={githubLink} 
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-vert)] bg-white text-[var(--color-dark)]" 
                  placeholder="https://github.com/username"
                />
                <button 
                  onClick={handleUpdateGithub} 
                  className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-lg hover:bg-[#6b7d4b] transition-colors font-medium cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-[#f5ede3] rounded-lg shadow-md border border-[#e1d3c1] p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[var(--color-vert)] rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h3 className="text-[var(--color-dark)] text-lg font-semibold">LinkedIn</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  value={linkedinLink} 
                  onChange={(e) => setLinkedinLink(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-vert)] bg-white text-[var(--color-dark)]" 
                  placeholder="https://linkedin.com/in/username"
                />
                <button 
                  onClick={handleUpdateLinkedin} 
                  className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-lg hover:bg-[#6b7d4b] transition-colors font-medium cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#f5ede3] rounded-lg shadow-md border border-[#e1d3c1] p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-[var(--color-dark)] text-lg font-semibold">Photo de profil</h3>
              </div>
              <div className="bg-[#e1d3c1] rounded-lg p-4 text-center">
                <p className="text-[var(--color-dark)] text-sm mb-2">Fonctionnalité non disponible</p>
                <p className="text-gray-600 text-xs">L'upload de photo sera disponible prochainement</p>
              </div>
            </motion.div>
          </div>
          <div className="mx-auto max-w-md border border-[var(--color-jaune)] rounded-lg py-7 px-6 bg-transparent flex flex-col items-center" style={{boxShadow: '0 0 0 2px #e1d3c1'}}>
            <div className="text-[var(--color-light)] text-sm text-left mb-6 w-full">
              Vous n’avez pas encore de stage.<br />
              Cliquez ci-dessous pour choisir un qui correspond à votre profil
            </div>
            <Link
              to="/etudiant/stages"
              className="w-full block bg-[var(--color-vert)] text-[var(--color-light)] text-base font-medium rounded px-4 py-2 mt-2 text-center hover:bg-[#6b7d4b] transition-colors cursor-pointer"
            >
              Liste des offres
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
