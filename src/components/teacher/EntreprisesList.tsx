import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TeacherHeader from './TeacherHeader';
import { getEnterpriseInPartnership } from '../../api/teacherApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import EnterpriseLogo from '../entreprise/EnterpriseLogo';

const EntreprisesList: React.FC = () => {
  const navigate = useNavigate();
  const [partnerEnterprises, setPartnerEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        const response = await getEnterpriseInPartnership();
        const enterprises = response.data || [];
        setPartnerEnterprises(enterprises);
        

        
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
                      <div className="mr-3">
                        <EnterpriseLogo 
                          enterpriseName={enterprise.name}
                          enterpriseId={enterprise.id}
                          hasLogo={enterprise.hasLogo?.hasLogo}
                          size="lg"
                          className=""
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{enterprise.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{enterprise.country} • {enterprise.city}</p>
                        <p className="text-xs text-gray-700 mb-1">email: {enterprise.email}</p>
                        <p className="text-xs text-gray-700">Secteur: {enterprise.sectorOfActivity}</p>
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