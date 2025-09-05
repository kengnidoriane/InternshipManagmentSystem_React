import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherHeader from './TeacherHeader';
import AdminHeader from '../admin/AdminHeader';
import { getOffersToReviewByDepartment, validateOfferAndConvention, downloadConvention } from '../../api/teacherApi';
import { useLocation } from 'react-router-dom';
import EnterpriseLogo from '../entreprise/EnterpriseLogo';
import type { OfferResponseDto } from '../../types/offer';

const TeacherOfferDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState<OfferResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplications, setShowApplications] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const applications: any[] = [];
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!id) return;
    
    const fetchOffer = async () => {
      try {
        setLoading(true);
        
        // Essayer d'abord de récupérer depuis le state de navigation
        const stateOffer = location.state?.offer;
        if (stateOffer) {
          setOffer(stateOffer);
          return;
        }
        
        // Sinon, récupérer depuis l'API
        const response = await getOffersToReviewByDepartment();
        const offers = response.data || [];
        const foundOffer = offers.find((o: OfferResponseDto) => o.id === Number(id));
        setOffer(foundOffer || null);
      } catch (error) {
        console.error('Erreur:', error);
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffer();
  }, [id, location.state]);

  const handleApprove = async () => {
    if (!id || !offer) return;
    setProcessingAction(true);
    
    try {
      await validateOfferAndConvention(Number(id), {
        offerApproved: true,
        conventionApproved: true
      });
      setOffer({ ...offer, status: 'APPROVED' });
      console.log('Offre approuvée avec succès');
      setTimeout(() => navigate(isAdminRoute ? '/admin/offres' : '/enseignant/offres'), 1000);
    } catch (error: any) {
      console.error('Erreur:', error);
      console.error(error.message || 'Erreur lors de l\'approbation');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!id || !offer) return;
    setProcessingAction(true);
    
    try {
      await validateOfferAndConvention(Number(id), {
        offerApproved: false,
        conventionApproved: false
      });
      setOffer({ ...offer, status: 'REJECTED' });
      console.log('Offre refusée');
      setTimeout(() => navigate(isAdminRoute ? '/admin/offres' : '/enseignant/offres'), 1000);
    } catch (error: any) {
      console.error('Erreur:', error);
      console.error(error.message || 'Erreur lors du refus');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDownloadConvention = async () => {
    if (!id) return;
    
    try {
      const response = await downloadConvention(Number(id));
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `convention_${offer?.title || 'offre'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      console.error('Erreur lors du téléchargement de la convention');
    }
  };

  // Note: Les enseignants ne gèrent pas les candidatures - c'est le rôle des entreprises
  const handleAcceptApplication = async (applicationId: number) => {
    console.log('Les candidatures sont gérées par les entreprises, pas les enseignants.');
  };
  
  const handleRejectApplication = async (applicationId: number) => {
    console.log('Les candidatures sont gérées par les entreprises, pas les enseignants.');
  };

  const handleToggleApplications = () => {
    setShowApplications(!showApplications);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        {isAdminRoute ? <AdminHeader /> : <TeacherHeader />}
        <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-login-gradient flex flex-col">
        {isAdminRoute ? <AdminHeader /> : <TeacherHeader />}
        <div className="py-16 text-center text-red-600 text-lg">Offre introuvable.</div>
      </div>
    );
  }

  // Champs mockés
  const postulants = applications.length;
  const places = offer.numberOfPlaces;
  const exigences = offer.requirements || "L'étudiant doit avoir de bonnes connaissances en développement web et APIs REST";

  // Déterminer les boutons à afficher selon le statut
  const getStatusBadge = () => {
    switch (offer.status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">En attente de validation</span>;
      case 'APPROVED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Offre approuvée</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Offre refusée</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      {isAdminRoute ? <AdminHeader /> : <TeacherHeader />}
      <div className="flex flex-col items-center w-full mt-8 mb-2 px-4">
        <div className="w-full max-w-[950px]">
          <div className={`w-full bg-[var(--color-light)] shadow-xl p-8 border border-[#e1d3c1] relative`} style={{ borderRadius: showApplications ? '5px 5px 0 0' : '5px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <div className="flex flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-dark)]">Détail de l'offre de stage</h1>
                <div className="flex items-center gap-3">
                  {getStatusBadge()}
                  {offer.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={handleReject}
                        disabled={processingAction}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition cursor-pointer disabled:opacity-50"
                      >
                        {processingAction ? 'Traitement...' : 'Refuser'}
                      </button>
                      <button 
                        onClick={handleApprove}
                        disabled={processingAction}
                        className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer disabled:opacity-50"
                      >
                        {processingAction ? 'Traitement...' : 'Approuver'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleToggleApplications}
                      className="bg-[#e1d3c1] text-[var(--color-vert)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] transition cursor-pointer"
                    >
                      {showApplications ? 'Masquer les candidatures' : `Voir les candidatures (${applications.length})`}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-row gap-10">
                <div className="flex-1 max-w-[60%]">
                  <div className="text-2xl font-semibold text-[var(--color-dark)] mb-4">{offer.title}</div>
                  
                  <div className="mb-5">
                    <div className="flex flex-row flex-wrap gap-8 items-center mb-2">
                      <div className="text-base text-[var(--color-dark)]">Type de stage <b>{offer.typeOfInternship}</b></div>
                      <div className="text-base text-[var(--color-dark)]">Stage payant <b>{offer.paying ? 'OUI' : 'NON'}</b></div>
                      <div className="text-base text-[var(--color-dark)]">🗓️ Période du stage <b>{offer.startDate} - {offer.endDate}</b></div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">
                        {offer.remote ? 'En remote' : 'Sur site'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">
                        {offer.paying ? 'Payant' : 'Non payant'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Description de la mission</div>
                    <div className="text-base text-[var(--color-dark)] whitespace-pre-line">{offer.description}</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Exigences</div>
                    <div className="text-base text-[var(--color-dark)]">{exigences}</div>
                    
                    <button 
                      onClick={() => handleDownloadConvention()}
                      className="mt-4 bg-[var(--color-jaune)] text-[var(--color-dark)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-vert)] hover:text-white transition cursor-pointer"
                    >
                      Télécharger la convention
                    </button>
                  </div>
                  
                  <div className="flex flex-row gap-3 mt-6">
                    <button 
                      onClick={handleToggleApplications}
                      className="bg-[#e1d3c1] text-[var(--color-vert)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] transition cursor-pointer"
                    >
                      {showApplications ? 'Masquer les candidatures' : `Voir les candidatures (${postulants})`}
                    </button>
                    <button 
                      onClick={() => navigate(isAdminRoute ? '/admin/offres' : '/enseignant/offres')}
                      className="bg-white border border-[var(--color-jaune)] text-[var(--color-jaune)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition cursor-pointer"
                    >
                      Retour aux offres
                    </button>
                  </div>
                </div>
                
                <div className="min-w-[260px] max-w-[320px] flex flex-col items-center p-5 mt-1">
                  <EnterpriseLogo 
                    enterpriseName={offer.enterprise?.name || 'Entreprise'}
                    enterpriseId={offer.enterprise?.id}
                    hasLogo={offer.enterprise?.hasLogo?.hasLogo}
                    size="lg"
                    className="mb-2"
                  />
                  <div className="text-base font-bold text-[var(--color-dark)] text-center mb-1">{offer.enterprise?.name || 'Entreprise'}</div>
                  <div className="flex flex-row gap-2 mb-1">
                    <span role="img" aria-label="flag" className="text-xl">🇳🇬</span>
                    <span className="text-xs text-[var(--color-dark)]">{offer.enterprise?.country || 'Pays'} • {offer.enterprise?.city || 'Ville'}</span>
                  </div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">{offer.enterprise?.sectorOfActivity || 'Secteur'}</div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">Nombre de places <b>{places}</b></div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">Nombre de postulants <b>{postulants}</b></div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">Domaine <b>{offer.domain}</b></div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">Durée <b>{(() => {
                    const start = new Date(offer.startDate).getTime();
                    const end = new Date(offer.endDate).getTime();
                    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
                    return `${diffDays} jours`;
                  })()}</b></div>
                </div>
              </div>
              
              <img src="/ornement.png" alt="ornement" className="pointer-events-none select-none absolute bottom-0 right-0 w-32 opacity-80 z-0" />
            </div>
          </div>
          
          <AnimatePresence>
            {showApplications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-[#e1d3c1] shadow-xl p-8 border border-t-0 border-[#c4b5a0] overflow-hidden relative"
                style={{ 
                  width: '100%',
                  maxWidth: '950px',
                  borderRadius: '0 0 5px 5px',
                  boxSizing: 'border-box'
                }}
              >
                <div className="relative">
                  <img src="/ornement-1.png" alt="ornement" className="pointer-events-none select-none absolute top-0 right-0 w-32 opacity-80 z-0" />
                  <h2 className="text-xl font-bold text-[var(--color-vert)] mb-6 text-center">Candidatures reçues</h2>
                  
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-[var(--color-dark)] text-lg">Aucune candidature reçue pour le moment</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/80 p-4 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold text-[var(--color-dark)]">{app.studentName}</div>
                            <div className="text-sm text-gray-600">{app.studentEmail}</div>
                            <div className="text-xs text-gray-500 mt-1">Soumis le {app.submittedAt}</div>
                          </div>
                          <div className="flex gap-2">
                            {app.cvUrl && (
                              <button className="text-sm bg-[var(--color-vert)] text-white px-3 py-1 rounded hover:bg-[#6b7d4b] transition">
                                CV
                              </button>
                            )}
                            {app.coverLetterUrl && (
                              <button className="text-sm bg-[var(--color-vert)] text-white px-3 py-1 rounded hover:bg-[#6b7d4b] transition">
                                Lettre
                              </button>
                            )}
                            {app.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleAcceptApplication(app.id)}
                                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                >
                                  Accepter
                                </button>
                                <button 
                                  onClick={() => handleRejectApplication(app.id)}
                                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                  Refuser
                                </button>
                              </>
                            )}
                            {app.status === 'ACCEPTED' && (
                              <span className="text-sm px-3 py-1 rounded bg-green-100 text-green-800">Accepté</span>
                            )}
                            {app.status === 'REJECTED' && (
                              <span className="text-sm px-3 py-1 rounded bg-red-100 text-red-800">Refusé</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TeacherOfferDetail;
