import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { getPendingEnterprises } from '../../api/adminApi';
import { getAllEnterprises } from '../../api/enterpriseApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';

const EnterprisesList: React.FC = () => {
  const navigate = useNavigate();
  const [pendingEnterprises, setPendingEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [approvedEnterprises, setApprovedEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const fetchEnterprises = async () => {
    try {
      const [pendingResponse, allResponse] = await Promise.all([
        getPendingEnterprises(),
        getAllEnterprises()
      ]);
      
      setPendingEnterprises(pendingResponse.data);
      setApprovedEnterprises(allResponse.data.filter(e => e.inPartnership));
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseClick = (enterprise: EnterpriseResponseDto) => {
    navigate(`/admin/enterprises/${enterprise.id}`, { state: { enterprise } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Entreprises</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                En attente ({pendingEnterprises.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'approved'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Approuvées ({approvedEnterprises.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4">
                {(activeTab === 'pending' ? pendingEnterprises : approvedEnterprises).map((enterprise) => (
                  <div
                    key={enterprise.id}
                    onClick={() => handleEnterpriseClick(enterprise)}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{enterprise.name}</h3>
                        <p className="text-gray-600">{enterprise.email}</p>
                        <p className="text-sm text-gray-500">{enterprise.sectorOfActivity}</p>
                        <p className="text-sm text-gray-500">{enterprise.city}, {enterprise.country}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enterprise.inPartnership
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {enterprise.inPartnership ? 'Approuvée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(activeTab === 'pending' ? pendingEnterprises : approvedEnterprises).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {activeTab === 'pending' 
                      ? 'Aucune entreprise en attente'
                      : 'Aucune entreprise approuvée'
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterprisesList;