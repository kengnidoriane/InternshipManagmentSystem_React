import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApplicationsStore } from '../store/applicationsStore';
// import { getEnterpriseLogoById } from '../api/enterpriseApi';
import type { OfferResponseDto } from '../types/offer';

interface OfferCardProps {
  offer: OfferResponseDto;
  onClick: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onClick }) => {
  const navigate = useNavigate();
  const getApplicationsCount = useApplicationsStore((state) => state.getApplicationsCount);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (offer.enterprise?.hasLogo?.hasLogo && offer.enterprise?.id) {
      // Pour les entreprises, utiliser leur propre logo
      import('../api/enterpriseApi').then(({ getEnterpriseLogoById }) => {
        getEnterpriseLogoById(offer.enterprise.id)
          .then(response => {
            if (response.data && response.data.size > 0) {
              const logoBlob = new Blob([response.data]);
              const logoObjectUrl = URL.createObjectURL(logoBlob);
              setLogoUrl(logoObjectUrl);
            }
          })
          .catch(() => setLogoUrl(null));
      });
    }
    
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [offer.enterprise?.hasLogo?.hasLogo, offer.enterprise?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Offre Acceptée';
      case 'PENDING': return 'En attente';
      case 'REJECTED': return 'Rejetée';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-row items-stretch bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:bg-[var(--color-light)] transition-colors cursor-pointer w-full"
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
    >
      {/* Colonne gauche : logo, entreprise, pays, ville, secteur */}
      <div className="flex flex-col items-center justify-center w-32 min-w-[175px] bg-[var(--color-light)] border-l-[var(--color-emraude)] p-3">
        <div className="h-12 w-12 rounded-full object-contain mb-2 border border-[#e1d3c1] bg-white flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo entreprise" className="h-12 w-12 object-contain rounded-full" />
          ) : (
            <span className="text-xs font-bold text-[var(--color-dark)]">
              {(offer.enterprise?.name || 'Entreprise').split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('')}
            </span>
          )}
        </div>
        <div className="text-xs text-[var(--color-dark)] font-semibold text-center">{offer.enterprise?.name || 'Entreprise'}</div>
        <div className="text-[10px] text-[var(--color-dark)] mt-1">{offer.enterprise?.country || 'Pays'} · {offer.enterprise?.city || 'Ville'}</div>
        <div className="text-[10px] text-[var(--color-dark)] mt-1">{offer.enterprise?.sectorOfActivity || 'Secteur'}</div>
      </div>

      {/* Centre : titre, deadline, type, période, badges */}
      <div className="flex-1 flex flex-col justify-between py-4 px-4">
        <div className="flex flex-col pb-2">
          <div className="font-semibold text-[var(--color-dark)] text-lg md:text-lg">{offer.title}</div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium self-start mt-2 ${getStatusColor(offer.status)}`}>
            {getStatusText(offer.status)}
          </span>
          <span className="ml-2 text-xs text-[var(--color-dark)]">Délai de candidature <b>{formatDate(offer.endDate)}</b></span>
        </div>
        <div className="flex flex-col mt-2 mb-2 flex-wrap">
          <div className="text-xs text-[var(--color-dark)]">Type de stage : <b>{offer.typeOfInternship || 'Non spécifié'}</b></div>
          <div className="text-xs text-[var(--color-dark)]">Stage payant : <b>{offer.paying ? 'OUI' : 'NON'}</b></div>
          <div className="text-xs text-[var(--color-dark)]">Période du stage : <b>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</b></div>
        </div>
        <div className="flex flex-row flex-wrap gap-2 mt-1 ">
          {/* Badges (mockés, car pas dans le backend) */}
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">. {offer.remote ? 'En remote' : 'Sur site'}</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">.Après interview</span>
        </div>
      </div>

      {/* Colonne droite : places, postulants, domaine, stats */}
      <div className="flex flex-col justify-between items-end max-w-[243px] bg-[var(--color-light)] p-4 border-l border-dashed border-[var(--color-neutre6-placeholder)]">
        <div className="mb-2">
          <div className="text-xs text-[var(--color-dark)]">Nombre de place <b>{offer.numberOfPlaces || '1'}</b></div>
          <div className="text-xs text-[var(--color-dark)]">Nombre de postulants <b>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/entreprise/candidatures'); }}
              className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
            >
              {getApplicationsCount(offer.id)}
            </button>
          </b></div>
          <div className="text-xs text-[var(--color-dark)]">Domaine <b>{offer.domain}</b></div>
        </div>
        <div className="text-sm text-[#2d2d2d]">
          <span className="font-medium">Durée:</span>
          <div className="mt-1">
            <span className="text-xs">
              {(() => {
                const start = new Date(offer.startDate).getTime();
                const end = new Date(offer.endDate).getTime();
                const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
                return `${diffDays} jours`;
              })()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OfferCard;