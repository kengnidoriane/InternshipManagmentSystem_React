import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { approveEnterprise } from '../../api/adminApi';
import { getEnterpriseById } from '../../api/enterpriseApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Logo non utilisé pour l'instant

  // Pas de ressource à nettoyer pour le moment

  useEffect(() => {
    const fetchEnterpriseDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 1) Premier essai: récupérer depuis le state de navigation
        const stateAny = location.state as unknown as { enterprise?: EnterpriseResponseDto } | undefined;
        if (stateAny && stateAny.enterprise) {
          setEnterprise(stateAny.enterprise);
          return;
        }

        // 2) Deuxième essai: récupérer depuis le cache (sessionStorage) des pending
        try {
          const cached = sessionStorage.getItem('pendingEnterprises');
          if (cached) {
            const list = JSON.parse(cached) as EnterpriseResponseDto[];
            const found = list.find(e => Number(e.id) === Number(id));
            if (found) {
              setEnterprise(found);
              return;
            }
          }
        } catch (e) {
          console.warn('Lecture du cache pendingEnterprises échouée', e);
        }

        // 3) Fallback: tenter un appel backend si disponible
        const enterpriseId = Number(id);
        if (isNaN(enterpriseId) || enterpriseId <= 0) {
          setError('ID d\'entreprise invalide');
          return;
        }

        const response = await getEnterpriseById(enterpriseId);
        const enterpriseData = response.data;
        setEnterprise(enterpriseData);
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'entreprise');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterpriseDetails();
  }, [id, location.state]);

  const handleApprove = async (approved: boolean) => {
    if (!enterprise) return;
    
    try {
      await approveEnterprise(enterprise.id, approved);
      navigate('/admin/enterprises');
    } catch (err) {
      setError('Erreur lors de l\'approbation de l\'entreprise');
      console.error(err);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte entreprise ?')) {
      // TODO: Implémenter la suppression
      console.log('Suppression du compte entreprise:', enterprise?.id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <AdminHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          {/* Bouton retour */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/admin/enterprises')}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-xl font-medium">Retour aux entreprises</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : enterprise ? (
            <div>
              <div className="bg-[#e7e1e1be] rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start">
                  {/* Logo de l'entreprise */}
                  <div className="w-32 h-32 rounded-md flex items-center justify-center mr-6 overflow-hidden">
                    <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-4xl">
                      {enterprise.name.substring(0, 2)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{enterprise.name}</h1>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                          enterprise.inPartnership 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {enterprise.inPartnership ? 'Partenaire' : 'En attente'}
                        </span>
                        <p className="text-gray-700">{enterprise.sectorOfActivity}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold mb-2">Informations de contact</h2>
                      <p className="text-gray-700">Email: {enterprise.email}</p>
                      <p className="text-gray-700">Matriculation: {enterprise.matriculation}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/60 rounded-md p-4">
                        <h3 className="text-sm font-medium text-gray-600">Pays</h3>
                        <p className="text-gray-800">{enterprise.country || '—'}</p>
                      </div>
                      <div className="bg-white/60 rounded-md p-4">
                        <h3 className="text-sm font-medium text-gray-600">Ville</h3>
                        <p className="text-gray-800">{enterprise.city || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section actions admin */}
              {!enterprise.inPartnership && (
                <div className="bg-[var(--color-neutre9)] rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Actions administrateur</h2>
                  <p className="mb-4">Cette entreprise a fait une demande de partenariat. Souhaitez-vous l'accepter ou la rejeter?</p>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleApprove(false)}
                      className="bg-[var(--color-rouge)] text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button 
                      onClick={() => handleApprove(true)}
                      className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              )}
              
              {/* Zone de danger */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h2>
                <p className="text-gray-600 mb-4">
                  La suppression du compte entreprise est irréversible. Toutes les données associées seront perdues.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4">Aucune information disponible pour cette entreprise.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EnterpriseDetail;