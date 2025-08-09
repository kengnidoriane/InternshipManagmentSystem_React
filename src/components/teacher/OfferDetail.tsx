import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeacherHeader from '../TeacherHeader';

// Types (à adapter selon vos types existants)
interface Offer {
  id: number;
  title: string;
  description: string;
  domain: string;
  job: string;
  typeOfInternship: string;
  startDate: string;
  endDate: string;
  numberOfPlaces: string;
  requirements: string;
  durationOfInternship: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  enterprise: {
    id: number;
    name: string;
    companyName?: string;
    sector?: string;
  };
}

// Mock data - remplacez par votre API
const mockOffer: Offer = {
  id: 1,
  title: "Implémentation du paiement en ligne",
  description: "Lorem ipsum dolor sit amet consectetur. Hendrerit molestie aliquam duis sagittis elit amet. Nous recherchons un stagiaire motivé pour rejoindre notre équipe de développement et participer à l'implémentation d'une solution de paiement en ligne innovante.",
  domain: "web dev",
  job: "Développeur Full-Stack",
  typeOfInternship: "Stage rémunéré",
  startDate: "2025-06-15",
  endDate: "2025-12-10",
  numberOfPlaces: "2",
  requirements: "L'étudiant doit avoir son propre PC. Connaissances en JavaScript, React, Node.js souhaitées. Capacité d'adaptation et esprit d'équipe.",
  durationOfInternship: 6,
  status: "PENDING",
  enterprise: {
    id: 1,
    name: "TechCorp",
    companyName: "TechCorp Solutions",
    sector: "Technologie"
  }
};

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        setLoading(true);
        // TODO: Remplacer par votre API
        // const offerData = await getOfferById(parseInt(id!));
        // setOffer(offerData);
        
        // Mock data pour l'instant
        setTimeout(() => {
          setOffer(mockOffer);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'offre:', error);
        setOffer(mockOffer);
        setLoading(false);
      }
    };

    if (id) {
      fetchOfferDetails();
    }
  }, [id]);

  const handleApprove = async () => {
    if (!offer) return;
    
    try {
      // TODO: Appel API pour approuver
      // await approveOffer(offer.id);
      setOffer({ ...offer, status: 'APPROVED' });
      alert('Offre approuvée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleReject = async () => {
    if (!offer) return;
    
    try {
      // TODO: Appel API pour rejeter
      // await rejectOffer(offer.id);
      setOffer({ ...offer, status: 'REJECTED' });
      alert('Offre refusée !');
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500';
      case 'APPROVED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <TeacherHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <TeacherHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Offre non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <TeacherHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header avec navigation et actions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          
          <h1 className="text-white text-2xl font-bold">Détail de l'offre</h1>
          
          <div className="flex gap-3">
            {offer.status === 'PENDING' && (
              <>
                <button 
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Refuser
                </button>
                <button 
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Accepter
                </button>
              </>
            )}
            {offer.status === 'APPROVED' && (
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium">
                Accepter l'offre
              </button>
            )}
            {offer.status === 'REJECTED' && (
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium">
                Accepter l'offre
              </button>
            )}
          </div>
        </motion.div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl">
              {/* Statut */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-600">État de l'offre:</span>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(offer.status)}`}>
                  {getStatusText(offer.status)}
                </span>
              </div>

              {/* Titre */}
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{offer.title}</h2>

              {/* Résumé */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  Résumé
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Type de stage:</span>
                      <span className="text-gray-900 font-semibold">{offer.typeOfInternship}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Stage payé:</span>
                      <span className="text-gray-900 font-semibold">
                        {offer.typeOfInternship.includes('rémunéré') ? 'OUI' : 'NON'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500 md:col-span-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Période du stage:</span>
                      <span className="text-gray-900 font-semibold">
                        {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    En présentiel
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Après interview
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  Description de la mission
                </h3>
                <p className="text-gray-700 leading-relaxed">{offer.description}</p>
              </div>

              {/* Convention */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  Convention de stage
                </h3>
                <p className="text-gray-700 mb-4">
                  Lorem ipsum dolor sit amet consectetur. Hendrerit molestie aliquam duis sagittis elit amet.
                </p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger la convention de stage
                </button>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                  Requirements
                </h3>
                <p className="text-gray-700 leading-relaxed">{offer.requirements}</p>
              </div>


            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              {/* Logo entreprise */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {offer.enterprise.companyName?.charAt(0) || offer.enterprise.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">LZ customs</h4>
                  <p className="text-sm text-gray-600">Yaounde</p>
                </div>
              </div>

              {/* Détails entreprise */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Entreprise:</span>
                  <span className="text-gray-900 font-medium text-sm">Yaounde</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Entreprise de services:</span>
                  <span className="text-gray-900 font-medium text-sm">Services</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Nombre de places:</span>
                  <span className="text-gray-900 font-medium text-sm">{offer.numberOfPlaces}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Nombre de postulants:</span>
                  <span className="text-gray-900 font-medium text-sm">5</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 text-sm">Domaine:</span>
                  <span className="text-gray-900 font-medium text-sm">{offer.domain}</span>
                </div>
              </div>

              {/* Tags techniques */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Java</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Spring</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">JS</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">React</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Configuration réseau</span>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">Cloud computing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetail;
