import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateLanguages, updateGithubLink, updateLinkedinLink, getCurrentStudentInfo, updateEmail, updateStudentProfile } from '../../api/studentApi';
import EtudiantHeader from '../EtudiantHeader';

interface StudentProfile {
  name: string;
  firstName: string;
  email: string;
  department: string;
  sector: string;
  languages: string[];
  githubLink: string;
  linkedinLink: string;
}

export default function MonProfil() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newLanguage, setNewLanguage] = useState('');
  const [loadingStates, setLoadingStates] = useState({
    github: false,
    linkedin: false,
    language: false
  });
  const [successStates, setSuccessStates] = useState({
    github: false,
    linkedin: false,
    language: false
  });

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await getCurrentStudentInfo();
        const studentData = response.data;
        
        const profile = {
          name: studentData.name || '',
          firstName: studentData.firstName || '',
          email: studentData.email || '',
          department: studentData.department || '',
          sector: studentData.sector || '',
          languages: studentData.languages || [],
          githubLink: studentData.githubLink || '',
          linkedinLink: studentData.linkedinLink || ''
        };
        
        setProfile(profile);
        setEditForm(profile);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentProfile();
  }, []);

  const handleAddLanguage = async () => {
    if (newLanguage.trim() && editForm) {
      setLoadingStates(prev => ({ ...prev, language: true }));
      try {
        await updateLanguages(newLanguage);
        setEditForm(prev => prev ? {
          ...prev,
          languages: [...prev.languages, newLanguage]
        } : null);
        setProfile(prev => prev ? {
          ...prev,
          languages: [...prev.languages, newLanguage]
        } : null);
        setNewLanguage('');
        setSuccessStates(prev => ({ ...prev, language: true }));
        setTimeout(() => setSuccessStates(prev => ({ ...prev, language: false })), 2000);
      } catch (error: any) {
        console.error('Erreur lors de l\'ajout de la langue:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, language: false }));
      }
    }
  };

  const handleUpdateGithub = async () => {
    if (!editForm?.githubLink.trim()) return;
    setLoadingStates(prev => ({ ...prev, github: true }));
    try {
      await updateGithubLink(editForm.githubLink);
      setProfile(prev => prev ? { ...prev, githubLink: editForm.githubLink } : null);
      setSuccessStates(prev => ({ ...prev, github: true }));
      setTimeout(() => setSuccessStates(prev => ({ ...prev, github: false })), 2000);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du lien GitHub:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, github: false }));
    }
  };

  const handleUpdateLinkedin = async () => {
    if (!editForm?.linkedinLink.trim()) return;
    setLoadingStates(prev => ({ ...prev, linkedin: true }));
    try {
      await updateLinkedinLink(editForm.linkedinLink);
      setProfile(prev => prev ? { ...prev, linkedinLink: editForm.linkedinLink } : null);
      setSuccessStates(prev => ({ ...prev, linkedin: true }));
      setTimeout(() => setSuccessStates(prev => ({ ...prev, linkedin: false })), 2000);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du lien LinkedIn:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, linkedin: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EtudiantHeader />
        <div className="flex justify-center items-center flex-1">
          <div className="text-white text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EtudiantHeader />
        <div className="flex justify-center items-center flex-1">
          <div className="text-white text-lg">Profil non trouvé</div>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    setEditForm(profile);
    setShowEditModal(true);
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => prev ? { ...prev, [name]: value } : null);
  };
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[var(--color-jaune)] text-3xl font-light tracking-wide">Mon Profil</h2>
            <button
              onClick={handleEditProfile}
              className="bg-[var(--color-vert)] text-white px-6 py-2 rounded-lg hover:bg-[#6b7d4b] transition-colors font-medium cursor-pointer"
            >
              Modifier le profil
            </button>
          </div>
          
          {/* Affichage des informations du profil */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="bg-[#f5ede3] rounded-lg shadow-md border border-[#e1d3c1] p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[var(--color-vert)] rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-[var(--color-dark)] text-lg font-semibold">Informations personnelles</h3>
              </div>
              <div className="space-y-3">
                <div><span className="font-medium text-[var(--color-dark)]">Nom :</span> <span className="text-[var(--color-dark)]">{profile.name}</span></div>
                <div><span className="font-medium text-[var(--color-dark)]">Prénom :</span> <span className="text-[var(--color-dark)]">{profile.firstName}</span></div>
                <div><span className="font-medium text-[var(--color-dark)]">Email :</span> <span className="text-[var(--color-dark)]">{profile.email}</span></div>
                <div><span className="font-medium text-[var(--color-dark)]">Département :</span> <span className="text-[var(--color-dark)]">{profile.department}</span></div>
                <div><span className="font-medium text-[var(--color-dark)]">Secteur :</span> <span className="text-[var(--color-dark)]">{profile.sector}</span></div>
              </div>
            </motion.div>

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
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, index) => (
                  <span key={index} className="px-3 py-1 bg-[var(--color-vert)] text-white rounded-full text-sm">
                    {lang}
                  </span>
                ))}
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
              <div className="text-[var(--color-dark)]">
                {profile.githubLink ? (
                  <a href={profile.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">
                    {profile.githubLink}
                  </a>
                ) : (
                  <span className="text-gray-500">Non renseigné</span>
                )}
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
              <div className="text-[var(--color-dark)]">
                {profile.linkedinLink ? (
                  <a href={profile.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">
                    {profile.linkedinLink}
                  </a>
                ) : (
                  <span className="text-gray-500">Non renseigné</span>
                )}
              </div>
            </motion.div>
          </div>

        </motion.div>
        
        {/* Modal de modification du profil */}
        <AnimatePresence>
          {showEditModal && editForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-[#f5ede3] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-dark)]">Modifier le profil</h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[var(--color-dark)] text-sm font-medium mb-2">Lien GitHub</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          name="githubLink"
                          value={editForm.githubLink}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-vert)] bg-white text-[var(--color-dark)]"
                        />
                        <button
                          onClick={handleUpdateGithub}
                          disabled={loadingStates.github}
                          className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-lg hover:bg-[#6b7d4b] transition-all duration-700 ease-out font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <div className="transition-all duration-700 ease-out">
                            {loadingStates.github ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : successStates.github ? (
                              <svg className="w-4 h-4 transition-all duration-700 ease-out" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                          {loadingStates.github ? 'Mise à jour...' : successStates.github ? 'Mis à jour !' : 'Mettre à jour'}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[var(--color-dark)] text-sm font-medium mb-2">Lien LinkedIn</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          name="linkedinLink"
                          value={editForm.linkedinLink}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/username"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-vert)] bg-white text-[var(--color-dark)]"
                        />
                        <button
                          onClick={handleUpdateLinkedin}
                          disabled={loadingStates.linkedin}
                          className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-lg hover:bg-[#6b7d4b] transition-all duration-700 ease-out font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <div className="transition-all duration-700 ease-out">
                            {loadingStates.linkedin ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : successStates.linkedin ? (
                              <svg className="w-4 h-4 transition-all duration-700 ease-out" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                          {loadingStates.linkedin ? 'Mise à jour...' : successStates.linkedin ? 'Mis à jour !' : 'Mettre à jour'}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[var(--color-dark)] text-sm font-medium mb-2">Ajouter une langue</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder="Ex: Espagnol"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-vert)] bg-white text-[var(--color-dark)]"
                        />
                        <button
                          onClick={handleAddLanguage}
                          disabled={loadingStates.language}
                          className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-lg hover:bg-[#6b7d4b] transition-all duration-700 ease-out font-medium cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <div className="transition-all duration-700 ease-out">
                            {loadingStates.language ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : successStates.language ? (
                              <svg className="w-4 h-4 transition-all duration-700 ease-out" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                          {loadingStates.language ? 'Ajout...' : successStates.language ? 'Ajouté !' : 'Ajouter'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editForm.languages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-[var(--color-vert)] text-white rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
