import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getStageDetail, downloadConvention, submitApplication } from "../api/stageApi";
import type { OfferResponseDto } from '../types/offer';
import EtudiantHeader from './EtudiantHeader';
import EnterpriseLogo from './entreprise/EnterpriseLogo';
import { useStudentStatus } from '../hooks/useStudentStatus';
import { validateApplicationEligibility, getApplicationButtonText, isApplicationButtonDisabled } from '../utils/applicationUtils';
import ConfirmationModal from './admin/ConfirmationModal';

const StageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCandidatureForm, setShowCandidatureForm] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'info' | 'danger' | 'warning';
  } | null>(null);
  const studentStatus = useStudentStatus();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    

    
    getStageDetail(Number(id))
      .then((offerData: OfferResponseDto) => {
        console.log('=== DONNÉES OFFRE REÇUES ===');
        console.log('Offre complète:', offerData);
        console.log('Entreprise:', offerData.enterprise);
        console.log('Nom entreprise:', offerData.enterprise?.name);
        console.log('Pays:', offerData.enterprise?.country);
        console.log('Ville:', offerData.enterprise?.city);
        console.log('Secteur:', offerData.enterprise?.sectorOfActivity);
        console.log('=== FIN DONNÉES ===');
        setOffer(offerData);
        setError(null);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement de l\'offre:', error);
        setError('Offre non trouvée');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-16 text-center text-[var(--color-jaune)] text-lg">Chargement...</div>;
  if (error || !offer) return <div className="py-16 text-center text-red-600 text-lg">{error || "Stage introuvable."}</div>;

  const tags = [offer.domain, offer.typeOfInternship].filter(Boolean);
  const exigences = offer.requirements || 'Aucune exigence spécifiée';

  // Fonction de téléchargement de la convention
  const handleDownloadConvention = async () => {
    if (!id) return;
    try {
      const blob = await downloadConvention(Number(id));
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `convention_stage_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch {
      console.error('Erreur lors du téléchargement de la convention.');
    }
  };

  // Fonction pour gérer l'affichage du formulaire de candidature
  const handleCandidaterClick = () => {
    if (!id) return;
    
    const offerId = Number(id);
    const validation = validateApplicationEligibility(offerId, studentStatus);
    
    if (!validation.canApply) {
      setModalConfig({
        title: 'Candidature impossible',
        message: validation.message,
        type: 'warning'
      });
      setShowModal(true);
      return;
    }
    
    setShowCandidatureForm(!showCandidatureForm);
  };

  // Fonction pour gérer le changement de fichier CV
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // Fonction pour gérer le changement de lettre de motivation
  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverLetterFile(e.target.files[0]);
    }
  };

  // Fonction pour soumettre la candidature
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !cvFile || !coverLetterFile) {
      setModalConfig({
        title: 'Fichiers manquants',
        message: 'Veuillez sélectionner un CV et une lettre de motivation.',
        type: 'warning'
      });
      setShowModal(true);
      return;
    }

    const offerId = Number(id);
    
    // Vérification finale avant soumission
    if (studentStatus.hasApplicationForOffer(offerId)) {
      setModalConfig({
        title: 'Candidature impossible',
        message: 'Vous avez déjà candidaté à cette offre. Impossible de candidater 2 fois.',
        type: 'warning'
      });
      setShowModal(true);
      setShowCandidatureForm(false);
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication(offerId, cvFile, coverLetterFile);
      setSubmitSuccess(true);
      // Rafraîchir le statut de l'étudiant
      await studentStatus.refresh();
      // Fermer le formulaire et réinitialiser les fichiers
      setShowCandidatureForm(false);
      setCvFile(null);
      setCoverLetterFile(null);
      setTimeout(() => {
        setSubmitSuccess(false);
        navigate('/etudiant/mon-stage');
      }, 2000);
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      console.error('Status:', error?.response?.status);
      console.error('Message:', error?.response?.data?.message);
      
      // Gestion d'erreurs spécifiques
      if (error?.response?.status === 409 || error?.response?.status === 400 || error?.message?.includes('already applied') || error?.response?.data?.message?.includes('déjà candidaté') || error?.response?.data?.message?.includes('already applied')) {
        setModalConfig({
          title: 'Candidature impossible',
          message: 'Vous avez déjà candidaté à cette offre. Impossible de candidater 2 fois.',
          type: 'warning'
        });
        setShowModal(true);
        await studentStatus.refresh();
        setShowCandidatureForm(false);
      } else if (error?.response?.status === 403) {
        setModalConfig({
          title: 'Candidature impossible',
          message: 'Vous ne pouvez plus candidater car vous êtes déjà en stage.',
          type: 'warning'
        });
        setShowModal(true);
        await studentStatus.refresh();
        setShowCandidatureForm(false);
      } else {
        setModalConfig({
          title: 'Erreur',
          message: error?.response?.data?.message || 'Erreur lors de la soumission de votre candidature.',
          type: 'danger'
        });
        setShowModal(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient flex flex-col">
      <EtudiantHeader />
      <div className="flex flex-col items-center w-full mt-8 mb-2 px-4">
        <div className="w-full max-w-[950px]">
          <div className="w-full bg-[var(--color-light)] shadow-xl p-8 border border-[#e1d3c1] relative rounded-lg">
            <div style={{ position: 'relative', width: '100%' }}>
              <div className="flex flex-row justify-between items-center mb-6">
                <div className="flex items-center">
                  <button 
                    onClick={() => navigate(-1)}
                    className="mr-4 p-2 text-[var(--color-dark)] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-bold text-[var(--color-dark)]">Detail de stage</h1>
                </div>
                {!isApplicationButtonDisabled(Number(id || 0), studentStatus) ? (
                  <button 
                    onClick={handleCandidaterClick}
                    className="bg-[var(--color-vert)] text-[var(--color-light)] px-5 py-2 rounded-lg font-semibold transition cursor-pointer"

                  >
                    {showCandidatureForm ? 'Annuler' : 'Candidater'}
                  </button>
                ) : (
                  <div className="bg-gray-200 text-gray-600 px-5 py-2 rounded-lg font-semibold">
                    {getApplicationButtonText(Number(id || 0), studentStatus)}
                  </div>
                )}
              </div>
              
              <div className="flex flex-row gap-10">
                <div className="flex-1 max-w-[60%]">
                  <div className="text-2xl font-semibold text-[var(--color-dark)] mb-4">{offer.title}</div>
                  
                  <div className="mb-5">
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="text-base text-[var(--color-dark)]">Type de stage: <b>{offer.typeOfInternship || 'Non spécifié'}</b></div>
                      <div className="text-base text-[var(--color-dark)]">Stage payant: <b>{offer.paying ? 'OUI' : 'NON'}</b></div>
                      <div className="text-base text-[var(--color-dark)]">🗓️ Période du stage: <b>{offer.startDate} - {offer.endDate}</b></div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">
                        {offer.remote ? 'En remote' : 'En présentiel'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e1d3c1] text-[var(--color-vert)] border border-[var(--color-vert)]">
                        {offer.paying ? 'Payant' : 'Non payant'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Description de la mission:</div>
                    <div className="text-base text-[var(--color-dark)] whitespace-pre-line">{offer.description}</div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Convention de stage:</div>
                    <button
                      onClick={handleDownloadConvention}
                      className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-[var(--color-vert)] text-white rounded shadow hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] cursor-pointer"
                    >
                      Télécharger la convention de stage
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 16a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1zm-5.707-3.707a1 1 0 0 1 1.414 0L11 14.586V5a1 1 0 0 1 2 0v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414z"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-[var(--color-dark)] mb-1">Requirements</div>
                    <div className="text-base text-[var(--color-dark)]">{exigences}</div>
                  </div>
                  
                  <div className="flex flex-row gap-3 mt-2">
                    {!isApplicationButtonDisabled(Number(id || 0), studentStatus) ? (
                      <button 
                        onClick={handleCandidaterClick}
                        className="bg-[var(--color-vert)] text-[var(--color-light)] px-5 py-2 rounded-lg font-semibold cursor-pointer"
                      >
                        {showCandidatureForm ? 'Annuler' : 'Candidater'}
                      </button>
                    ) : (
                      <div className="bg-gray-200 text-gray-600 px-5 py-2 rounded-lg font-semibold">
                        {getApplicationButtonText(Number(id || 0), studentStatus)}
                      </div>
                    )}
                    <button className="bg-white border border-[var(--color-jaune)] text-[var(--color-jaune)] px-5 py-2 rounded-lg font-semibold hover:bg-[var(--color-jaune)] hover:text-[var(--color-dark)] transition cursor-pointer">
                      Voir des stages similaires
                    </button>
                  </div>
                </div>
                
                <div className="min-w-[260px] max-w-[320px] flex flex-col items-center p-5 mt-1">
                  <EnterpriseLogo 
                    enterpriseName={offer.enterprise.name}
                    enterpriseId={offer.enterprise.id}
                    hasLogo={offer.enterprise.hasLogo?.hasLogo}
                    size="xl"
                    className="mb-2"
                  />
                  <div className="text-base font-bold text-[var(--color-dark)] text-center mb-1">{offer.enterprise?.name || 'Entreprise'}</div>
                  <div className="flex flex-row gap-2 mb-1">
                    <span className="text-xs text-[var(--color-dark)]">{offer.enterprise?.country || 'Pays'} • {offer.enterprise?.city || 'Ville'}</span>
                  </div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">{offer.enterprise?.sectorOfActivity || 'Secteur d\'activité'}</div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">Nombre de place <b>{offer.numberOfPlaces || '1'}</b></div>
                  <div className="text-xs text-[var(--color-dark)] mb-1">Domaine <b>{offer.domain || 'Non spécifié'}</b></div>
                  <div className="flex flex-wrap gap-2 mt-2 mb-1 justify-center">
                    {tags.map((t, index) => (
                      <span key={index} className="bg-[var(--color-vert)] text-white px-2 py-0.5 rounded-full text-xs border border-[var(--color-vert)]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <img src="/ornement.png" alt="ornement" className="pointer-events-none select-none absolute bottom-0 right-0 w-32 opacity-80 z-0" />
            </div>
          </div>
          
        </div>
        
        {/* Popup Modal de candidature */}
        <AnimatePresence>
          {showCandidatureForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-[#e1d3c1] rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              >
                <button
                  onClick={() => setShowCandidatureForm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
                
                <div className="relative">
                  <h2 className="text-xl font-bold text-[var(--color-vert)] mb-6 text-center">Candidature</h2>
                  
                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="text-[var(--color-vert)] text-lg font-semibold mb-2">✅ Candidature envoyée avec succès!</div>
                      <div className="text-[var(--color-dark)] text-sm">Votre candidature a été transmise à l'entreprise.</div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitApplication}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-dark)] mb-4">Lettre de motivation</h3>
                          <div className="bg-[#d4c4b0] rounded-lg p-6 h-48 flex flex-col items-center justify-center border-2 border-dashed border-[#a89580]">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCoverLetterChange}
                              className="hidden"
                              id="motivation-letter-upload"
                              aria-label="Uploader la lettre de motivation"
                            />
                            <div className="cursor-pointer flex flex-col items-center" onClick={() => document.getElementById('motivation-letter-upload')?.click()}>
                              <div className="w-16 h-20 bg-white rounded border border-gray-300 flex flex-col items-center justify-center mb-2 shadow-sm">
                                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">PDF</div>
                              </div>
                              <span className="text-sm text-[var(--color-dark)] font-medium">
                                {coverLetterFile ? coverLetterFile.name : 'Lettre de motivation'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => document.getElementById('motivation-letter-upload')?.click()}
                            className="w-full mt-3 bg-[var(--color-vert)] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#6b7d4b] transition flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Uploader un fichier
                          </button>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-dark)] mb-4">Associer un CV</h3>
                          <div className="bg-[#d4c4b0] rounded-lg p-6 h-48 flex flex-col items-center justify-center border-2 border-dashed border-[#a89580]">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCvChange}
                              className="hidden"
                              id="cv-upload"
                              required
                              aria-label="Uploader le CV"
                            />
                            <div className="cursor-pointer flex flex-col items-center" onClick={() => document.getElementById('cv-upload')?.click()}>
                              <div className="w-16 h-20 bg-white rounded border border-gray-300 flex flex-col items-center justify-center mb-2 shadow-sm">
                                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">PDF</div>
                              </div>
                              <span className="text-sm text-[var(--color-dark)] font-medium">
                                {cvFile ? cvFile.name : 'CV'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => document.getElementById('cv-upload')?.click()}
                            className="w-full mt-3 bg-[var(--color-vert)] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#6b7d4b] transition flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Uploader un fichier
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setShowCandidatureForm(false)}
                          className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || !cvFile || !coverLetterFile}
                          className="bg-[var(--color-vert)] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#6b7d4b] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Envoi en cours...' : 'Envoyer la candidature'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {modalConfig && (
          <ConfirmationModal
            isOpen={showModal}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            confirmText="OK"
            onConfirm={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StageDetail;