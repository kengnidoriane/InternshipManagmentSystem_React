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

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  const handleCandidatesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/entreprise/candidatures`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#e9dbc7] rounded-lg border border-[#d2bfa3] p-4 cursor-pointer hover:shadow-lg transition-shadow w-full"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* 1ère colonne - Entreprise */}
        <div className="flex flex-col items-center text-center flex-shrink-0 w-32">
          <div className="w-16 h-16 bg-black rounded flex items-center justify-center text-white font-bold text-lg mb-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo entreprise" 
                className="w-full h-full object-contain rounded"
              />
            ) : (
              getInitials(offer.enterprise?.name || 'Entreprise')
            )}
          </div>
          <div className="text-sm font-medium text-[#2d2d2d] mb-1">
            {offer.enterprise?.name || 'Entreprise'}
          </div>
          <div className="w-full h-px bg-gray-300 mb-1"></div>
          <div className="text-xs text-gray-600 mb-1">
            {offer.enterprise?.country || 'Pays'} • {offer.enterprise?.city || 'Ville'}
          </div>
          <div className="text-xs text-gray-600">
            {offer.enterprise?.sectorOfActivity || 'Secteur'}
          </div>
        </div>

        {/* 2ème colonne - Détails du stage */}
        <div className="flex flex-col flex-grow">
          <h3 className="font-semibold text-lg text-[#2d2d2d] mb-2">
            {offer.title}
          </h3>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium self-start mb-3 ${getStatusColor(offer.status)}`}>
            {getStatusText(offer.status)}
          </span>

          <div className="space-y-1 text-sm text-[#2d2d2d] mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">Type de stage:</span>
              <span>{offer.typeOfInternship || 'Non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Stage payant:</span>
              <span>{offer.paying ? 'OUI' : 'NON'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Modalité:</span>
              <span>{offer.remote ? 'Télétravail' : 'Présentiel'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Période:</span>
              <span>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {offer.paying && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                Payant
              </span>
            )}
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
              {offer.remote ? 'Télétravail' : 'Présentiel'}
            </span>
            <span className="px-2 py-1 bg-[#6a9a6a] text-white text-xs rounded">
              {offer.typeOfInternship}
            </span>
          </div>
        </div>

        {/* 3ème colonne - Statistiques */}
        <div className="flex flex-col items-end text-right flex-shrink-0 w-40">
          <div className="text-sm text-[#2d2d2d] mb-2">
            <span className="font-medium">Nombre de places:</span> {offer.numberOfPlaces || '1'}
          </div>
          <div className="text-sm text-[#2d2d2d] mb-3">
            <span className="font-medium">Nombre de postulants:</span>{' '}
            <button
              onClick={handleCandidatesClick}
              className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
            >
              {getApplicationsCount(offer.id)}
            </button>
          </div>
          <div className="text-sm text-[#2d2d2d]">
            <span className="font-medium">Durée:</span>
            <div className="mt-1">
              <span className="text-xs">
                {calculateDuration(offer.startDate, offer.endDate)} jours
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OfferCard;