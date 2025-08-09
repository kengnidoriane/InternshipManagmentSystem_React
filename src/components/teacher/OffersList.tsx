import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  durationOfInternship: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  enterprise: {
    id: number;
    name: string;
    companyName?: string;
  };
}

// Mock data - remplacez par votre API
const mockOffers: Offer[] = [
  {
    id: 1,
    title: "Implémentation du paiement en ligne",
    description: "Développement d'une solution de paiement en ligne innovante.",
    domain: "web dev",
    job: "Développeur Full-Stack",
    typeOfInternship: "Stage rémunéré",
    startDate: "2025-06-15",
    endDate: "2025-12-10",
    numberOfPlaces: "2",
    durationOfInternship: 6,
    status: "PENDING",
    enterprise: {
      id: 1,
      name: "TechCorp",
      companyName: "TechCorp Solutions"
    }
  },
  {
    id: 2,
    title: "Développement d'application mobile",
    description: "Création d'une application mobile pour la gestion des commandes.",
    domain: "mobile dev",
    job: "Développeur Mobile",
    typeOfInternship: "Stage non rémunéré",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    numberOfPlaces: "1",
    durationOfInternship: 6,
    status: "APPROVED",
    enterprise: {
      id: 2,
      name: "MobileTech",
      companyName: "MobileTech Innovation"
    }
  },
  {
    id: 3,
    title: "Assistant marketing digital",
    description: "Support dans la stratégie marketing digital et réseaux sociaux.",
    domain: "marketing",
    job: "Assistant Marketing",
    typeOfInternship: "Stage conventionné",
    startDate: "2025-08-01",
    endDate: "2025-11-30",
    numberOfPlaces: "3",
    durationOfInternship: 4,
    status: "REJECTED",
    enterprise: {
      id: 3,
      name: "DigitalCorp",
      companyName: "Digital Marketing Solutions"
    }
  }
];

const OffersList: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        // TODO: Remplacer par votre API
        // const offersData = await getAllOffers();
        // setOffers(offersData);
        
        // Mock data pour l'instant
        setTimeout(() => {
          setOffers(mockOffers);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
        setOffers(mockOffers);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(offer => {
    if (filter === 'ALL') return true;
    return offer.status === filter;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getFilterCount = (status: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (status === 'ALL') return offers.length;
    return offers.filter(o => o.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <TeacherHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Chargement des offres...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <TeacherHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-6">Offres de stage</h1>
          
          {/* Filtres */}
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { key: 'ALL', label: 'Toutes' },
              { key: 'PENDING', label: 'En attente' },
              { key: 'APPROVED', label: 'Approuvées' },
              { key: 'REJECTED', label: 'Refusées' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  filter === key
                    ? 'bg-white text-primary-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {label} ({getFilterCount(key as any)})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grille des offres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/teacher/offers/${offer.id}`)}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              {/* Header de la card */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-lg font-bold">
                  {offer.enterprise.companyName?.charAt(0) || offer.enterprise.name.charAt(0)}
                </div>
                <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(offer.status)}`}>
                  {getStatusText(offer.status)}
                </span>
              </div>

              {/* Titre et entreprise */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {offer.title}
              </h3>
              <p className="text-gray-600 font-medium mb-4">
                {offer.enterprise.companyName || offer.enterprise.name}
              </p>

              {/* Détails */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    Domaine:
                  </span>
                  <span className="text-gray-900 font-medium">{offer.domain}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                    </svg>
                    Durée:
                  </span>
                  <span className="text-gray-900 font-medium">{offer.durationOfInternship} mois</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Places:
                  </span>
                  <span className="text-gray-900 font-medium">{offer.numberOfPlaces}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                    </svg>
                    Début:
                  </span>
                  <span className="text-gray-900 font-medium">{formatDate(offer.startDate)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {offer.typeOfInternship}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {offer.job}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message si aucune offre */}
        {filteredOffers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white mt-12"
          >
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl">Aucune offre trouvée pour ce filtre.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OffersList;
