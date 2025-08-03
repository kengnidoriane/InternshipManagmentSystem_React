import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOfferDetail } from '../api/stageDetailApi';
import type { OfferResponseDto } from '../types/offer';
import EtudiantHeader from './EtudiantHeader';


interface ConventionText {
  text: string;
  isPdf: boolean;
  downloadUrl?: string;
}

const StageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOfferDetail(Number(id))
      .then((offerData) => {
        setOffer(offerData);
        setError(null);
      })
      .catch(() => {
        // fallback mockdata
        setOffer({
          id: 0,
          title: 'Dev Three.js Canvas 3D (WebGL) SVG',
          startDate: '15 juin',
          endDate: '10 decembre 2025',
          domain: 'web dev',
          description: 'Lorem ipsum dolor sit amet consectetur. Hendrerit molestie aliquam duis sagittis elit amet',
          status: 'APPROVED',
          enterprise: {
            id: 1,
            name: 'LZ customs',
            email: 'lz@customs.com',
            sector: 'Entreprise de services',
            matriculation: 'LZ-2025',
          },
          convention: undefined,
        } as OfferResponseDto);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement...</div>;
  if (error || !offer) return <div className="py-16 text-center text-red-600 text-lg">{error || "Stage introuvable."}</div>;

  // Champs mockés uniquement si absents du backend
  const postulants = 5;
  const places = 2;
  const badges = ['En présentiel', 'Après interview'];
  const tags = ['Cisco', 'Equipement réseau', 'Réseau', 'IoT', 'Configuration routeur', 'Cloud computing'];
  const exigences = "L’étudiant doit avoir de son propre PC";

  // Fonction de téléchargement de la convention
  const handleDownloadConvention = async () => {
    if (!id) return;
    try {
      // Appel API pour récupérer le blob PDF
      const { data } = await import('../api/teacherApi').then(mod => mod.downloadConvention(id));
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `convention_stage_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      alert('Erreur lors du téléchargement de la convention.');
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      {/* Header */}
      <EtudiantHeader />
      <div className="flex justify-center items-start w-full mt-8 mb-2 px-4 ">
        <div className="w-full max-w-[950px] bg-[var(--color-light)] rounded-2xl shadow-xl p-8 border border-[#e1d3c1] relative">
          {/* Contenu du détail stage + ornement dans un seul parent pour éviter l'erreur JSX */}
          <div style={{ position: 'relative', width: '100%' }}>

          <div className="flex flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-dark)]">Detail de stage</h1>
            <button className="bg-[#e1d3c1] text-[var(--color-vert)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] transition cursor-pointer">Candidater</button>
          </div>
          <div className="flex flex-row gap-10">
            {/* Colonne principale */}
            <div className="flex-1 max-w-[60%]">
          <div className="text-2xl font-semibold text-[var(--color-dark)] mb-4">{offer.title}</div>
          {/* Résumé */}
          <div className="mb-5">
            <div className="flex flex-row flex-wrap gap-8 items-center mb-2">
              <div className="text-base text-[var(--color-dark)]">Type de stage <b>Perfectionnement</b></div>
              <div className="text-base text-[var(--color-dark)]">Stage payant <b>OUI</b></div>
              <div className="text-base text-[var(--color-dark)]">🗓️ Période du stage <b>{offer.startDate} - {offer.endDate}</b></div>
            </div>
            <div className="flex flex-row flex-wrap gap-2 mb-2">
              {badges.map(b => (
                <span key={b} className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">{b}</span>
              ))}
            </div>
          </div>
          {/* Description de la mission */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Description de la mission</div>
            <div className="text-base text-[var(--color-dark)] whitespace-pre-line">{offer.description}</div>
          </div>
          {/* Convention de stage */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Convention de stage</div>
            <button
              onClick={handleDownloadConvention}
              className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-[var(--color-vert)] text-white rounded shadow hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] cursor-pointer"
            >
              Télécharger la convention de stage
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1zm-5.707-3.707a1 1 0 0 1 1.414 0L11 14.586V5a1 1 0 0 1 2 0v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414z"/></svg>
            </button>
          </div>
          {/* Requirements */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Requirements</div>
            <div className="text-base text-[var(--color-dark)]">{exigences}</div>
          </div>
          <div className="flex flex-row gap-3 mt-2">
            <button className="bg-[#e1d3c1] text-[var(--color-vert)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] transition cursor-pointer">Candidater</button>
            <button className="bg-white border border-[var(--color-jaune)] text-[var(--color-jaune)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition cursor-pointer">Voir des stages similaires</button>
          </div>
        </div>
        {/* Colonne entreprise à droite */}
        <div className="min-w-[260px] max-w-[320px] flex flex-col items-center p-5 mt-1">
          {/* Logo entreprise */}
          <img src={offer.enterprise.logoUrl || '/default-logo.png'} alt={offer.enterprise.name} className="h-20 w-20 rounded-full object-contain mb-2 border border-[#e1d3c1] bg-white" />
          <div className="text-base font-bold text-[var(--color-dark)] text-center mb-1">{offer.enterprise.name}</div>
          <div className="flex flex-row gap-2 mb-1">
            <span role="img" aria-label="flag" className="text-xl">🇨🇲</span>
            <span className="text-xs text-[var(--color-dark)]">Cameroun • Yaoundé</span>
          </div>
              <div className="text-xs text-[var(--color-dark)] mb-1">{offer.enterprise.sector || 'Entreprise de services'}</div>
              <div className="text-xs text-[var(--color-dark)] mb-1">Nombre de place <b>{places}</b></div>
              <div className="text-xs text-[var(--color-dark)] mb-1">Nombre de postulants <b>{postulants}</b></div>
              <div className="text-xs text-[var(--color-dark)] mb-1">Domaine <b>{offer.domain}</b></div>
              <div className="flex flex-wrap gap-2 mt-2 mb-1 justify-center">
                {tags.map(t => <span key={t} className="bg-[var(--color-vert)] text-white px-2 py-0.5 rounded-full text-xs border border-[var(--color-vert)]">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
        {/* Ornement bas droite du box */}
        <img src="/ornement.png" alt="ornement" className="pointer-events-none select-none absolute bottom-2 right-2 w-32 opacity-80 z-0" />
        </div>
          
      </div>
    </div>
  );
};

export default StageDetail;
