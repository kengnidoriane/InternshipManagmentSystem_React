import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateLanguages, updateGithubLink, updateLinkedinLink, updateStudentStatus } from '../../api/studentApi';
import { uploadProfilePhoto } from '../../api/enterpriseApi';
import EtudiantHeader from '../EtudiantHeader';

export default function MonProfil() {
  const [newLanguage, setNewLanguage] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');

  const handleAddLanguage = async () => {
    if (newLanguage.trim()) {
      await updateLanguages(newLanguage);
      setNewLanguage('');
    }
  };

  const handleUpdateGithub = async () => {
    if (githubLink.trim()) {
      await updateGithubLink(githubLink);
    }
  };

  const handleUpdateLinkedin = async () => {
    if (linkedinLink.trim()) {
      await updateLinkedinLink(linkedinLink);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        await uploadProfilePhoto(e.target.files[0]);
        alert('Photo mise à jour avec succès!');
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de la photo');
      }
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await updateStudentStatus();
      alert(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  useEffect(() => {
    handleUpdateStatus();
  }, []);
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
          <h2 className="text-center text-[var(--color-jaune)] text-3xl font-light mb-8 tracking-wide">Mon Profil</h2>
          
          <div className="space-y-4 mb-6">
            <div className="border border-[var(--color-jaune)] rounded-lg p-4">
              <h3 className="text-[var(--color-light)] mb-2">Photo de profil</h3>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-[var(--color-light)]" />
            </div>
            
            <div className="border border-[var(--color-jaune)] rounded-lg p-4">
              <h3 className="text-[var(--color-light)] mb-2">Ajouter une langue</h3>
              <div className="flex gap-2">
                <input 
                  value={newLanguage} 
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 p-2 rounded" 
                  placeholder="Ex: Espagnol"
                />
                <button onClick={handleAddLanguage} className="bg-[var(--color-vert)] text-white px-4 py-2 rounded">Ajouter</button>
              </div>
            </div>
            
            <div className="border border-[var(--color-jaune)] rounded-lg p-4">
              <h3 className="text-[var(--color-light)] mb-2">Lien GitHub</h3>
              <div className="flex gap-2">
                <input 
                  value={githubLink} 
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="flex-1 p-2 rounded" 
                  placeholder="https://github.com/username"
                />
                <button onClick={handleUpdateGithub} className="bg-[var(--color-vert)] text-white px-4 py-2 rounded">Mettre à jour</button>
              </div>
            </div>
            
            <div className="border border-[var(--color-jaune)] rounded-lg p-4">
              <h3 className="text-[var(--color-light)] mb-2">Lien LinkedIn</h3>
              <div className="flex gap-2">
                <input 
                  value={linkedinLink} 
                  onChange={(e) => setLinkedinLink(e.target.value)}
                  className="flex-1 p-2 rounded" 
                  placeholder="https://linkedin.com/in/username"
                />
                <button onClick={handleUpdateLinkedin} className="bg-[var(--color-vert)] text-white px-4 py-2 rounded">Mettre à jour</button>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-md border border-[var(--color-jaune)] rounded-lg py-7 px-6 bg-transparent flex flex-col items-center" style={{boxShadow: '0 0 0 2px #e1d3c1'}}>
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
