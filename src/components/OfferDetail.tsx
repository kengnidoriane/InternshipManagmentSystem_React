import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EntrepriseHeader from './EnterpriseHeader';
import { getEnterpriseOffers, downloadConvention, getEnterpriseLogo } from '../api/enterpriseApi';
import { useApplicationsStore } from '../store/applicationsStore';
import type { OfferResponseDto } from '../types/offer';

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const getApplicationsCount = useApplicationsStore((state) => state.getApplicationsCount);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    // Récupérer toutes les offres de l'entreprise et filtrer par ID
    getEnterpriseOffers()
      .then(response => {
        const offers = response.data || [];
        const foundOffer = offers.find((offer: OfferResponseDto) => offer.id === parseInt(id));
        
        if (foundOffer) {
          setOffer(foundOffer);
          
          // Charger le logo si disponible
          getEnterpriseLogo()
            .then(logoResponse => {
              if (logoResponse.data && logoResponse.data.size > 0) {
                const logoBlob = new Blob([logoResponse.data]);
                const logoObjectUrl = URL.createObjectURL(logoBlob);
                setLogoUrl(logoObjectUrl);
              }
            })
            .catch(() => setLogoUrl(null));
        } else {
          setOffer(null);
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement de l\'offre:', error);
        setOffer(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  const handleDownloadConvention = async () => {
    if (!offer) return;
    
    try {
      const response = await downloadConvention(offer.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `convention-${offer.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EntrepriseHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[var(--color-light)] text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        <EntrepriseHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[var(--color-light)] text-lg">Offre non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EntrepriseHeader />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header avec flèche retour */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-[var(--color-light)] hover:bg-white hover:bg-opacity-10 rounded-full transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-light)]">Aperçu de l'offre de stage</h1>
          </div>

          <div className="bg-[#e9dbc7] rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Titre */}
                <h2 className="text-2xl font-bold text-[#2d2d2d] mb-6">{offer.title}</h2>

                {/* Résumé */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2d2d2d] mb-3">Résumé</h3>
                  <div className="space-y-2 text-sm text-[#2d2d2d]">
                    <div><span className="font-medium">Type de stage:</span> {offer.typeOfInternship}</div>
                    <div><span className="font-medium">Stage payant:</span> {offer.paying ? 'OUI' : 'NON'}</div>
                    <div><span className="font-medium">Modalité:</span> {offer.remote ? 'Télétravail' : 'Présentiel'}</div>
                    <div><span className="font-medium">Période du stage:</span> {formatDate(offer.startDate)} - {formatDate(offer.endDate)}</div>
                  </div>
                    <div className="flex gap-2 mt-3">
                    {offer.paying && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Payant</span>
                    )}
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{offer.remote ? 'Télétravail' : 'Présentiel'}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{offer.domain}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2d2d2d] mb-3">Description de la mission</h3>
                  <p className="text-sm text-[#2d2d2d]">{offer.description}</p>
                </div>

                {/* Convention */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2d2d2d] mb-3">Convention de stage</h3>
                  <button 
                    onClick={handleDownloadConvention}
                    className="px-4 py-2 bg-[#4c7a4c] text-white text-sm rounded hover:bg-[#6a9a6a] transition-colors cursor-pointer"
                  >
                    Télécharger la convention de stage
                  </button>
                </div>

                {/* Exigences */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2d2d2d] mb-3">Exigences</h3>
                  <p className="text-sm text-[#2d2d2d]">{offer.requirements || 'Aucune exigence spécifiée'}</p>
                </div>

                {/* Boutons d'action */}
                <div className="pt-6">
                  <h2 className="text-xl font-bold text-[#2d2d2d] mb-4">{offer.title}</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => navigate('/entreprise/offres')}
                      className="flex-1 px-6 py-3 border border-gray-400 text-gray-600 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Retour à la liste
                    </button>
                    <button 
                      onClick={() => navigate(`/entreprise/offres/${offer.id}/edit`)}
                      className="flex-1 px-6 py-3 bg-[#4c7a4c] text-white rounded hover:bg-[#6a9a6a] transition-colors cursor-pointer"
                    >
                      Modifier l'offre
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar droite */}
              <div className="space-y-6">
                {/* Logo et infos entreprise */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-black rounded mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="Logo entreprise" 
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      getInitials(offer.enterprise.name)
                    )}
                  </div>
                  <h4 className="font-semibold text-[#2d2d2d] mb-1">{offer.enterprise.name}</h4>
                  <div className="flex justify-center gap-1 mb-2">
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  </div>
                  <div className="text-xs text-[#2d2d2d] space-y-1">
                    <div>{offer.enterprise.country || 'Pays'} • {offer.enterprise.city || 'Ville'}</div>
                    <div>{offer.enterprise.sectorOfActivity || 'Secteur'}</div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="space-y-3 text-sm text-[#2d2d2d]">
                  <div><span className="font-medium">Nombre de places:</span> {offer.numberOfPlaces || '1'}</div>
                  <div><span className="font-medium">Candidatures:</span> {getApplicationsCount(offer.id)}</div>
                  <div><span className="font-medium">Domaine:</span> {offer.domain}</div>
                </div>

                {/* Tags basés sur les données de l'offre */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-[#4c7a4c] text-white text-xs rounded">{offer.domain}</span>
                    <span className="px-2 py-1 bg-[#6a9a6a] text-white text-xs rounded">{offer.typeOfInternship}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {offer.paying && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Payant</span>
                    )}
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">{offer.remote ? 'Télétravail' : 'Présentiel'}</span>
                  </div>
                </div>

                {/* Actions pour entreprise */}
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate(`/entreprise/offres/${offer.id}/candidatures`)}
                    className="w-full px-4 py-2 bg-[#4c7a4c] text-white text-sm rounded hover:bg-[#6a9a6a] transition-colors cursor-pointer"
                  >
                    Voir les candidatures
                  </button>
                  <button 
                    onClick={() => navigate(`/entreprise/offres/${offer.id}/edit`)}
                    className="w-full px-4 py-2 border border-gray-400 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Modifier l'offre
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferDetail;