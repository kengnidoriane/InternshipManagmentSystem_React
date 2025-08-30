import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from '../TeacherHeader';
import { getEnterpriseInPartnership } from '../../api/adminApi';
import { getEnterpriseLogoById } from '../../api/enterpriseApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';

const EntreprisesList: React.FC = () => {
  const navigate = useNavigate();
  const [partnerEnterprises, setPartnerEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoUrls, setLogoUrls] = useState<Record<number, string>>({});

  // Nettoyage des URLs de logos lors du démontage du composant
  useEffect(() => {
    return () => {
      Object.values(logoUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [logoUrls]);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        const response = await getEnterpriseInPartnership();
        const enterprises = response.data || [];
        setPartnerEnterprises(enterprises);
        
        // Charger les logos
        const logoPromises = enterprises.map(async (enterprise) => {
          if (enterprise.hasLogo?.hasLogo) {
            try {
              const logoResponse = await getEnterpriseLogoById(enterprise.id);
              const logoUrl = URL.createObjectURL(logoResponse.data);
              return { id: enterprise.id, url: logoUrl };
            } catch (err) {
              return null;
            }
          }
          return null;
        });
        
        const logoResults = await Promise.all(logoPromises);
        const logoMap: Record<number, string> = {};
        logoResults.forEach(result => {
          if (result) {
            logoMap[result.id] = result.url;
          }
        });
        setLogoUrls(logoMap);
        
      } catch (err) {
        setError('Erreur lors du chargement des entreprises');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);







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
                  <motion.div 
                    key={enterprise.id} 
                    className="bg-white rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/enseignant/entreprises/${enterprise.id}`)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex">
                      <div className="w-16 h-16 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                        {logoUrls?.[enterprise.id] ? (
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
                  </motion.div>
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