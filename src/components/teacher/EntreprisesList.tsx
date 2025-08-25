import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from '../TeacherHeader';
import { getPendingEnterprises, approveEnterprise } from '../../api/enterpriseApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const EntreprisesList: React.FC = () => {
  const navigate = useNavigate();
  const [pendingEnterprises, setPendingEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [partnerEnterprises, setPartnerEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Données fictives pour les tests
  const mockPendingEnterprises: EnterpriseResponseDto[] = [
    {
      id: 1,
      name: "L'Z customs",
      email: "lz@example.com",
      sectorOfActivity: "Informatique & Réseaux",
      inPartnership: false,
      matriculation: "LZ123",
      hasLogo: { hasLogo: true },
      country: "Cameroun",
      city: "Douala"
    },
    {
      id: 2,
      name: "EG Share",
      email: "egshare@example.com",
      sectorOfActivity: "Vente d' appareils",
      inPartnership: false,
      matriculation: "EG456",
      hasLogo: { hasLogo: true },
      country: "Nigeria",
      city: "Lagos"
    },
    {
      id: 3,
      name: "Cisco",
      email: "cisco@example.com",
      sectorOfActivity: "CCNA & Cybersécurité",
      inPartnership: false,
      matriculation: "CS789",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Francisco"
    }
  ];

  const mockPartnerEnterprises: EnterpriseResponseDto[] = [
    {
      id: 4,
      name: "Cisco",
      email: "cisco@example.com",
      sectorOfActivity: "Réseaux de données",
      inPartnership: true,
      matriculation: "CS001",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Jose"
    },
    {
      id: 5,
      name: "L'Z customs",
      email: "lz@example.com",
      sectorOfActivity: "Informatique & Réseaux",
      inPartnership: true,
      matriculation: "LZ002",
      hasLogo: { hasLogo: true },
      country: "Cameroun",
      city: "Yaoundé"
    },
    {
      id: 6,
      name: "Figma",
      email: "figma@example.com",
      sectorOfActivity: "Design & UX/UI",
      inPartnership: true,
      matriculation: "FG003",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Francisco"
    },
    {
      id: 7,
      name: "Cisco",
      email: "cisco2@example.com",
      sectorOfActivity: "Réseaux & Sécurité",
      inPartnership: true,
      matriculation: "CS004",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Jose"
    },
    {
      id: 8,
      name: "5G",
      email: "5g@example.com",
      sectorOfActivity: "Télécommunications",
      inPartnership: true,
      matriculation: "5G005",
      hasLogo: { hasLogo: true },
      country: "France",
      city: "Paris"
    },
    {
      id: 9,
      name: "L'Z customs",
      email: "lz2@example.com",
      sectorOfActivity: "Développement & DevOps",
      inPartnership: true,
      matriculation: "LZ006",
      hasLogo: { hasLogo: true },
      country: "Cameroun",
      city: "Douala"
    },
    {
      id: 10,
      name: "Partenaire",
      email: "partner@example.com",
      sectorOfActivity: "Réseaux & Cyber",
      inPartnership: true,
      matriculation: "PT007",
      hasLogo: { hasLogo: true },
      country: "Sénégal",
      city: "Dakar"
    },
    {
      id: 11,
      name: "EG Share",
      email: "egshare@example.com",
      sectorOfActivity: "Réseaux & Cyber",
      inPartnership: true,
      matriculation: "EG008",
      hasLogo: { hasLogo: true },
      country: "Nigeria",
      city: "Lagos"
    },
    {
      id: 12,
      name: "Visual Studio",
      email: "vs@example.com",
      sectorOfActivity: "Développement & IDE",
      inPartnership: true,
      matriculation: "VS009",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "Redmond"
    },
    {
      id: 13,
      name: "React",
      email: "react@example.com",
      sectorOfActivity: "Développement Frontend",
      inPartnership: true,
      matriculation: "RE010",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "Menlo Park"
    },
    {
      id: 14,
      name: "Cisco",
      email: "cisco3@example.com",
      sectorOfActivity: "Certification & Formation",
      inPartnership: true,
      matriculation: "CS011",
      hasLogo: { hasLogo: true },
      country: "USA",
      city: "San Jose"
    }
  ];

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        const pendingResponse = await getPendingEnterprises();
        const allEnterprises = pendingResponse.data || [];
        const partners = allEnterprises.filter(e => e.inPartnership === true);
        const pending = allEnterprises.filter(e => e.inPartnership === false);
        setPendingEnterprises(pending);
        setPartnerEnterprises(partners);
      } catch (err) {
        setError('Erreur lors du chargement des entreprises');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

  const handleApprove = async (enterpriseId: number, approved: boolean) => {
    try {
      await approveEnterprise(enterpriseId, approved);
      
      if (approved) {
        // Déplacer l'entreprise de pending vers partners
        const approvedEnterprise = pendingEnterprises.find(e => e.id === enterpriseId);
        if (approvedEnterprise) {
          const updatedEnterprise = { ...approvedEnterprise, inPartnership: true };
          setPendingEnterprises(prev => prev.filter(e => e.id !== enterpriseId));
          setPartnerEnterprises(prev => [...prev, updatedEnterprise]);
        }
      } else {
        // Supprimer l'entreprise rejetée
        setPendingEnterprises(prev => prev.filter(e => e.id !== enterpriseId));
      }
    } catch (err) {
      setError('Erreur lors de l\'approbation de l\'entreprise');
      console.error(err);
    }
  };

  // Gestion du carrousel
  const nextSlide = () => {
    if (pendingEnterprises.length <= 3) return;
    setCurrentIndex(prevIndex => 
      prevIndex === pendingEnterprises.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (pendingEnterprises.length <= 3) return;
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? pendingEnterprises.length - 3 : prevIndex - 1
    );
  };

  // Afficher 3 entreprises à la fois dans le carrousel
  const visiblePendingEnterprises = pendingEnterprises.slice(currentIndex, currentIndex + 3);

  // Fonction pour générer une couleur aléatoire pour les étoiles
  const getStarColor = () => {
    const colors = ['#FFD700', '#FFA500', '#FF8C00'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <TeacherHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          {/* Bouton retour */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-xl font-medium">Entreprises</span>
            </button>
          </div>

          {/* Section des demandes de partenariats en attente */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Demandes de partenariats en attente</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">Chargement...</div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : pendingEnterprises.length === 0 ? (
              <div className="py-4">Aucune demande de partenariat en attente.</div>
            ) : (
              <div className="relative">
                {/* Carrousel avec flèches de navigation */}
                <div className="flex items-center">
                  <button 
                    onClick={prevSlide}
                    className="absolute left-0 z-10 bg-white/50 rounded-full p-2 shadow-md"
                    disabled={pendingEnterprises.length <= 3}
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  
                  <div className="flex justify-between w-full overflow-hidden px-10">
                    {visiblePendingEnterprises.map((enterprise) => (
                      <div 
                        key={enterprise.id} 
                        className="p-4 mx-2 w-1/3 cursor-pointer"
                        onClick={() => navigate(`/enseignant/entreprises/${enterprise.id}`)}
                      >
                        <div className="flex">
                          {/* Logo placeholder */}
                          <div className="w-20 h-20 bg-blue-500 text-white rounded-md flex items-center justify-center text-2xl mr-4">
                            {enterprise.name.substring(0, 2)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{enterprise.name}</h3>
                            <div className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs my-1">
                              En attente
                            </div>
                            <p className="text-xs text-gray-600">{enterprise.country} • {enterprise.city}</p>
                            <p className="text-xs text-gray-700">{enterprise.sectorOfActivity}</p>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(enterprise.id, true);
                                }}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 cursor-pointer"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(enterprise.id, false);
                                }}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 cursor-pointer"
                              >
                                Rejeter
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextSlide}
                    className="absolute right-0 z-10 bg-white/50 rounded-full p-2 shadow-md"
                    disabled={pendingEnterprises.length <= 3}
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section des entreprises partenaires */}
          <div>
            <h2 className="text-xl font-medium mb-4">Entreprises partenaires</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">Chargement...</div>
            ) : error ? (
              <div className="text-red-500 py-4">{error}</div>
            ) : partnerEnterprises.length === 0 ? (
              <div className="py-4">Aucune entreprise partenaire.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {partnerEnterprises.map((enterprise) => (
                  <div 
                    key={enterprise.id} 
                    className="p-4 cursor-pointer"
                    onClick={() => navigate(`/enseignant/entreprises/${enterprise.id}`)}
                  >
                    <div className="flex">
                      {/* Logo placeholder */}
                      <div className="w-16 h-16 bg-blue-500 text-white rounded-md flex items-center justify-center text-xl mr-3">
                        {enterprise.name.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-medium">{enterprise.name}</h3>
                        <p className="text-xs text-gray-600">{enterprise.country} • {enterprise.city}</p>
                        <p className="text-xs text-gray-700">{enterprise.sectorOfActivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntreprisesList;