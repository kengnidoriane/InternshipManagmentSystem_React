import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { approveEnterprise } from '../../api/adminApi';
import { getEnterpriseById, getEnterpriseLogoById } from '../../api/enterpriseApi';
import { getTeacherOffers } from '../../api/teacherApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import type { OfferResponseDto } from '../../types/offer';

const EnterpriseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto | null>(
    location.state?.enterprise || null
  );
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!enterprise);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!enterprise && id) {
      fetchEnterpriseDetails();
    }
    if (enterprise?.inPartnership) {
      fetchOffers();
    }
    if (enterprise?.hasLogo?.hasLogo && id) {
      fetchLogo();
    }
  }, [enterprise, id]);

  const fetchEnterpriseDetails = async () => {
    try {
      const response = await getEnterpriseById(parseInt(id!));
      setEnterprise(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await getTeacherOffers();
      setOffers(response.data.filter((offer: OfferResponseDto) => 
        offer.enterprise.id === parseInt(id!)
      ));
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    }
  };

  const fetchLogo = async () => {
    try {
      const response = await getEnterpriseLogoById(parseInt(id!));
      if (response.data) {
        const logoBlob = new Blob([response.data]);
        const logoObjectUrl = URL.createObjectURL(logoBlob);
        setLogoUrl(logoObjectUrl);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du logo:', error);
    }
  };

  const handleApprove = async (approved: boolean) => {
    if (!enterprise) return;
    
    setActionLoading(true);
    try {
      await approveEnterprise(enterprise.id, approved);
      setEnterprise(prev => prev ? { ...prev, inPartnership: approved } : null);
      if (approved) {
        fetchOffers();
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!enterprise || !confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) return;
    
    // TODO: Implémenter la suppression via API admin
    console.log('Suppression du compte:', enterprise.id);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="container mx-auto p-6">
          <div className="text-center py-8">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!enterprise) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="container mx-auto p-6">
          <div className="text-center py-8">Entreprise non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate('/admin/enterprises')}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Retour à la liste
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
              ) : (
                getInitials(enterprise.name)
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{enterprise.name}</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Email:</strong> {enterprise.email}</div>
                <div><strong>Matricule:</strong> {enterprise.matriculation}</div>
                <div><strong>Secteur:</strong> {enterprise.sectorOfActivity}</div>
                <div><strong>Localisation:</strong> {enterprise.city}, {enterprise.country}</div>
              </div>
              
              <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  enterprise.inPartnership
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {enterprise.inPartnership ? 'Entreprise Approuvée' : 'En attente d\'approbation'}
                </span>
              </div>
            </div>
          </div>

          {!enterprise.inPartnership && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">Actions d'approbation</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(true)}
                  disabled={actionLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleApprove(false)}
                  disabled={actionLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Rejeter
                </button>
              </div>
            </div>
          )}
        </div>

        {enterprise.inPartnership && offers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Offres de stage ({offers.length})</h2>
            <div className="grid gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/admin/offers/${offer.id}`)}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <h3 className="font-semibold">{offer.title}</h3>
                  <p className="text-sm text-gray-600">{offer.domain} • {offer.typeOfInternship}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      offer.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h2>
          <p className="text-gray-600 mb-4">
            La suppression du compte est irréversible. Toutes les données associées seront perdues.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDetail;