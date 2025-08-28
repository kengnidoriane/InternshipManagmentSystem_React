import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { getPendingEnterprises } from '../../api/adminApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const EnterprisesList: React.FC = () => {
  const navigate = useNavigate();
  const [pendingEnterprises, setPendingEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [partnerEnterprises, setPartnerEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    return () => {
      Object.values(logoUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        // Récupérer seulement les entreprises en attente de validation
        const response = await getPendingEnterprises();
        console.log('Admin - pending enterprises response:', response);
        console.log('Admin - pending enterprises data:', response?.data);
        const pendingEnts = response.data || [];
        setPendingEnterprises(pendingEnts);
        try {
          sessionStorage.setItem('pendingEnterprises', JSON.stringify(pendingEnts));
        } catch (e) {
          console.warn('Impossible de mettre en cache les entreprises en attente', e);
        }
        
        // Note: Pas d'endpoint pour récupérer les entreprises partenaires
        // On peut les simuler ou les laisser vides
        setPartnerEnterprises([]);
        
      } catch (err) {
        setError('Erreur lors du chargement des entreprises');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

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

  const visiblePendingEnterprises = pendingEnterprises.slice(currentIndex, currentIndex + 3);

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <AdminHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-xl font-medium">Entreprises</span>
            </button>
          </div>

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
                        onClick={() => navigate(`/admin/enterprises/${enterprise.id}`, { state: { enterprise } })}
                      >
                        <div className="flex">
                          <div className="w-20 h-20 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                            {logoUrls[enterprise.id] ? (
                              <img 
                                src={logoUrls[enterprise.id]} 
                                alt={`Logo ${enterprise.name}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-2xl">
                                {enterprise.name.substring(0, 2)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{enterprise.name}</h3>
                            <div className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs my-1">
                              En attente
                            </div>
                            <p className="text-xs text-gray-600">{enterprise.country} • {enterprise.city}</p>
                            <p className="text-xs text-gray-700">{enterprise.sectorOfActivity}</p>
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
                    onClick={() => navigate(`/admin/enterprises/${enterprise.id}`)}
                  >
                    <div className="flex">
                      <div className="w-16 h-16 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                        {logoUrls[enterprise.id] ? (
                          <img 
                            src={logoUrls[enterprise.id]} 
                            alt={`Logo ${enterprise.name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xl">
                            {enterprise.name.substring(0, 2)}
                          </div>
                        )}
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

export default EnterprisesList;