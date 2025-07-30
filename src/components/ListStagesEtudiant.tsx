import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EtudiantHeader from './EtudiantHeader';
import egLogo from '../assets/eg-logo.jpg'; // à remplacer par tes assets réels
import lzLogo from '../assets/lz-logo.jpg';

const stages = [
  {
    id: 1,
    titre: 'Implémentation du paiement en ligne',
    entreprise: 'EG store',
    entrepriseLogo: egLogo,
    pays: 'Nigeria',
    ville: 'Lagos',
    dateLimite: '2 mars 2025',
    niveau: 'Perfectionnement',
    payant: true,
    periode: '10 juin - 10 septembre 2025',
    places: 5,
    postulants: 5,
    domaine: 'web dev',
    tags: ['cisco', 'Équipement réseau', 'Réseau', 'IoT', 'Configurateur routeur', 'Cloud computing'],
    mode: 'remote',
    status: 'Ouvert',
    badges: ['En remote', 'Après interview'],
  },
  {
    id: 2,
    titre: 'Dev Three.js Canvas 3D (WebGL) SVG',
    entreprise: 'LZ customs',
    entrepriseLogo: lzLogo,
    pays: 'Cameroun',
    ville: 'Yaoundé',
    dateLimite: '2 juin 2025',
    niveau: 'Perfectionnement',
    payant: false,
    periode: '15 juin - 10 décembre 2025',
    places: 4,
    postulants: 8,
    domaine: 'Développeur web',
    tags: ['webgl', 'svg', 'front end', 'canvas 3D', 'Three.js'],
    mode: 'presentiel',
    status: 'Ouvert',
    badges: ['En présentiel', 'Après interview'],
  },
];

export default function ListStagesEtudiant() {
  const [search, setSearch] = useState('');
  const filteredStages = stages.filter(stage =>
    stage.titre.toLowerCase().includes(search.toLowerCase()) ||
    stage.entreprise.toLowerCase().includes(search.toLowerCase())
  );

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
          <input
            type="text"
            placeholder="Recherchez un stage"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mb-8 px-5 py-4 rounded-lg border-none bg-[#e1d3c1] text-[#58693e] text-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b79056] placeholder-[#b79056]"
            style={{ fontFamily: 'inherit', letterSpacing: '0.01em' }}
          />
          <div className="flex flex-col gap-7">
            {filteredStages.length === 0 ? (
              <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Aucune offre trouvée.</div>
            ) : (
              filteredStages.map((stage) => (
                <motion.div
                  key={stage.id}
                  className="flex flex-row items-stretch bg-[#f9f1e2]/80 rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:bg-[#f7e9d2] transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Logo et colonne gauche */}
                  <div className="flex flex-col items-center justify-center w-32 min-w-[96px] bg-[#f9f1e2] border-r border-[#e1d3c1] p-3">
                    <img src={stage.entrepriseLogo} alt={stage.entreprise} className="h-12 w-12 rounded-full object-contain mb-2 border border-[#e1d3c1] bg-white" />
                    <div className="text-xs text-[var(--color-jaune)] font-semibold text-center">{stage.entreprise}</div>
                    <div className="text-[10px] text-[var(--color-jaune)] mt-1">{stage.pays} · {stage.ville}</div>
                  </div>
                  {/* Centre */}
                  <div className="flex-1 flex flex-col justify-between px-6 py-4">
                    <div className="flex flex-row items-center gap-3">
                      <div className="font-semibold text-[#58693e] text-lg md:text-xl">{stage.titre}</div>
                      <span className="ml-2 text-xs text-[var(--color-jaune)] whitespace-nowrap">Délai de candidature <b>{stage.dateLimite}</b></span>
                    </div>
                    <div className="flex flex-row gap-6 mt-2 mb-2 flex-wrap">
                      <div className="text-xs text-[var(--color-jaune)]">Type de stage : <b>{stage.niveau}</b></div>
                      <div className="text-xs text-[var(--color-jaune)]">Stage payant : <b>{stage.payant ? 'OUI' : 'NON'}</b></div>
                      <div className="text-xs text-[var(--color-jaune)]">Période du stage : <b>{stage.periode}</b></div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 mt-1">
                      {stage.badges.map((badge, i) => (
                        <span key={i} className={`px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[#669087] border border-[#d3bc99]`}>{badge}</span>
                      ))}
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 mt-3">
                      {stage.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">{tag}</span>
                      ))}
                    </div>
                  </div>
                  {/* Colonne droite */}
                  <div className="flex flex-col justify-between items-end min-w-[170px] bg-[#f9f1e2] border-l border-[#e1d3c1] p-4">
                    <div className="mb-2">
                      <div className="text-xs text-[var(--color-jaune)]">Nombre de place <b>{stage.places}</b></div>
                      <div className="text-xs text-[var(--color-jaune)]">Nombre de postulants <b>{stage.postulants}</b></div>
                      <div className="text-xs text-[var(--color-jaune)]">Domaine <b>{stage.domaine}</b></div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
