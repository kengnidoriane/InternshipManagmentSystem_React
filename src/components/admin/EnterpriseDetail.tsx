import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { approveEnterprise, deleteEnterprise } from '../../api/adminApi';
import { getEnterpriseById } from '../../api/enterpriseApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import ConfirmationModal from './ConfirmationModal';

interface OfferInEnterprise {
  id: number;
  title: string;
  description: string;
  domain: string;
  job: string;
  typeOfInternship?: string;
  startDate: string;
  endDate: string;
  numberOfPlaces?: number;
  paying?: boolean;
  remote?: boolean;
}

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<boolean | null>(null);
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

        // 3) Troisième essai: récupérer depuis le cache des entreprises partenaires
        try {
          const cachedPartners = sessionStorage.getItem('partnerEnterprises');
          if (cachedPartners) {
            const partnerList = JSON.parse(cachedPartners) as EnterpriseResponseDto[];
            const foundPartner = partnerList.find(e => Number(e.id) === Number(id));
            if (foundPartner) {
              setEnterprise(foundPartner);
              return;
            }
          }
        } catch (e) {
          console.warn('Lecture du cache partnerEnterprises échouée', e);
        }

        // 4) Fallback: tenter un appel backend si disponible
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

  const handleApprovalClick = (approved: boolean) => {
    setApprovalAction(approved);
    setShowApprovalModal(true);
  };

  const confirmApproval = async () => {
    if (!enterprise || approvalAction === null) return;
    
    try {
      await approveEnterprise(enterprise.id, approvalAction);
      navigate('/admin/enterprises');
    } catch (err) {
      const action = approvalAction ? 'approbation' : 'rejet';
      setError(`Erreur lors du ${action} de l'entreprise`);
      console.error(err);
    }
    setShowApprovalModal(false);
    setApprovalAction(null);
  };

  const handleDeleteAccount = async () => {
    if (!enterprise) return;
    
    try {
      await deleteEnterprise(enterprise.id);
      navigate('/admin/enterprises');
    } catch (err) {
      setError('Erreur lors de la suppression de l\'entreprise');
      console.error(err);
    }
    setShowDeleteModal(false);
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
                            : enterprise.enterpriseState === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {enterprise.inPartnership 
                            ? 'Partenaire' 
                            : enterprise.enterpriseState === 'REJECTED' 
                            ? 'Rejeté' 
                            : 'En attente'
                          }
                        </span>
                        <p className="text-gray-700">{enterprise.sectorOfActivity}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold mb-2">Informations de contact</h2>
                      <p className="text-gray-700">Email: {enterprise.email}</p>
                      <p className="text-gray-700">Matriculation: {enterprise.matriculation}</p>
                    </div>

                    {(enterprise.city || enterprise.country) && (
                      <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Localisation</h2>
                        <div className="bg-white/60 rounded-md p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">📍</span>
                            <span className="text-gray-800">
                              {enterprise.city && enterprise.country 
                                ? `${enterprise.city}, ${enterprise.country}`
                                : enterprise.city || enterprise.country
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Section des offres */}
              {enterprise.offers && enterprise.offers.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Offres de stage ({enterprise.offers.length})</h2>
                  <div className="flex flex-col gap-4">
                    {enterprise.offers.map((offer: any) => (
                      <div
                        key={offer.id}
                        className="flex flex-row items-stretch bg-[var(--color-light)] rounded-xl shadow-lg border border-[#e1d3c1] overflow-hidden hover:bg-[var(--color-light)] transition-colors cursor-pointer"
                        onClick={() => navigate(`/admin/offres/${offer.id}`, { state: { offer } })}
                      >
                        {/* Colonne gauche : logo, entreprise */}
                        <div className="flex flex-col items-center justify-center w-32 min-w-[175px] bg-[var(--color-light)] border-l-[var(--color-emraude)] p-3">
                          <div className="h-12 w-12 rounded-full mb-2 border border-[#e1d3c1] bg-white flex items-center justify-center">
                            <span className="text-xs font-bold text-[var(--color-dark)]">
                              {enterprise.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-[var(--color-dark)] font-semibold text-center">{enterprise.name}</div>
                          <div className="text-[10px] text-[var(--color-dark)] mt-1">{enterprise.sectorOfActivity || 'Non renseigné'}</div>
                        </div>
                        
                        {/* Centre : titre, type, période */}
                        <div className="flex-1 flex flex-col justify-between py-4">
                          <div className="flex flex-col pb-2">
                            <div className="font-semibold text-[var(--color-dark)] text-lg md:text-lg">{offer.title}</div>
                            <span className="ml-2 text-xs text-[var(--color-dark)]">Poste : <b>{offer.job}</b></span>
                          </div>
                          <div className="flex flex-col mt-2 mb-2 flex-wrap">
                            <div className="text-xs text-[var(--color-dark)]">Type de stage : <b>{offer.typeOfInternship || 'Non spécifié'}</b></div>
                            <div className="text-xs text-[var(--color-dark)]">Stage payant : <b>{offer.paying ? 'OUI' : 'NON'}</b></div>
                            <div className="text-xs text-[var(--color-dark)]">Période du stage : <b>{offer.startDate} - {offer.endDate}</b></div>
                          </div>
                          <div className="flex flex-row flex-wrap gap-2 mt-1">
                            {offer.remote && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">En remote</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Colonne droite : places, domaine */}
                        <div className="flex flex-col justify-between items-end max-w-[243px] bg-[var(--color-light)] p-4 border-l border-dashed border-[var(--color-neutre6-placeholder)]">
                          <div className="mb-2">
                            <div className="text-xs text-[var(--color-dark)]">Nombre de places : <b>{offer.numberOfPlaces || 1}</b></div>
                            <div className="text-xs text-[var(--color-dark)]">Domaine : <b>{offer.domain}</b></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Section actions admin */}
              {!enterprise.inPartnership && enterprise.enterpriseState !== 'REJECTED' && (
                <div className="bg-[var(--color-neutre9)] rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Actions administrateur</h2>
                  <p className="mb-4">Cette entreprise a fait une demande de partenariat. Souhaitez-vous l'accepter ou la rejeter?</p>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleApprovalClick(false)}
                      className="bg-[var(--color-rouge)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors"
                    >
                      Rejeter
                    </button>
                    <button 
                      onClick={() => handleApprovalClick(true)}
                      className="bg-[var(--color-vert)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700 transition-colors"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              )}
              
              {/* Message pour entreprise rejetée */}
              {enterprise.enterpriseState === 'REJECTED' && (
                <div className="bg-red-50 rounded-lg shadow-md p-6 mb-6 border border-red-200">
                  <h2 className="text-xl font-semibold mb-2 text-red-800">Entreprise rejetée</h2>
                  <p className="text-red-700">Cette entreprise a été rejetée et a reçu une notification de rejet.</p>
                </div>
              )}
              
              {/* Zone de danger */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h2>
                <p className="text-gray-600 mb-4">
                  La suppression du compte entreprise est irréversible. Toutes les données associées seront perdues.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
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
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer l'entreprise"
        message={`Êtes-vous sûr de vouloir supprimer le compte de l'entreprise "${enterprise?.name}" ? Cette action est irréversible et toutes les données associées seront perdues.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
      
      <ConfirmationModal
        isOpen={showApprovalModal}
        title={approvalAction ? "Approuver l'entreprise" : "Rejeter l'entreprise"}
        message={
          approvalAction 
            ? `Êtes-vous sûr de vouloir approuver l'entreprise "${enterprise?.name}" comme partenaire ? Elle pourra publier des offres de stage.`
            : `Êtes-vous sûr de vouloir rejeter l'entreprise "${enterprise?.name}" ? Elle sera marquée comme rejetée et recevra une notification de rejet.`
        }
        confirmText={approvalAction ? "Approuver" : "Rejeter"}
        cancelText="Annuler"
        onConfirm={confirmApproval}
        onCancel={() => {
          setShowApprovalModal(false);
          setApprovalAction(null);
        }}
        type={approvalAction ? "info" : "warning"}
      />
    </div>
  );
};

export default EnterpriseDetail;