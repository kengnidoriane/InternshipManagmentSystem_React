import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOffer, addConventionToOffer, getEnterpriseLogo, getEnterpriseOffers, getCurrentEnterpriseInfo } from '../../api/enterpriseApi';
import type { OfferRequestDto } from '../../types/offer';
import EnterpriseHeader from './EnterpriseHeader';

const defaultState: OfferRequestDto = {
  title: '',
  description: '',
  domain: '',
  typeOfInternship: '',
  job: '',
  requirements: '',
  startDate: '',
  endDate: '',
  numberOfPlaces: 1,
  paying: false,
  remote: false,
};

type EnterpriseInfo = {
  name: string;
  sectorOfActivity?: string;
  location?: string;
  country?: string;
  city?: string;
};

const CreerOffreEntreprise: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [form, setForm] = useState<OfferRequestDto>(defaultState);
  const [pdfConvention, setPdfConvention] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Ajout pour infos entreprise dynamiques ---
  const [enterpriseInfo, setEnterpriseInfo] = useState<EnterpriseInfo | null>(null);
  const [enterpriseLoading, setEnterpriseLoading] = useState(true);
  const [enterpriseError, setEnterpriseError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      setEnterpriseLoading(true);
      try {
        console.log('=== RÉCUPÉRATION INFOS ENTREPRISE ===');
        
        // Récupérer les informations de l'entreprise
        const enterpriseResponse = await getCurrentEnterpriseInfo();
        console.log('Infos entreprise récupérées:', enterpriseResponse.data);
        
        // Vérifier si l'entreprise est partenaire
        if (enterpriseResponse.data.inPartnership === false) {
          setError('Votre entreprise doit être approuvée comme partenaire pour créer des offres de stage.');
          setTimeout(() => navigate('/entreprise/offres'), 3000);
          return;
        }
        
        setEnterpriseInfo({
          name: enterpriseResponse.data.name || 'Mon Entreprise',
          sectorOfActivity: enterpriseResponse.data.sectorOfActivity || 'Secteur d\'activité',
          location: `${enterpriseResponse.data.country || 'Pays'} • ${enterpriseResponse.data.city || 'Ville'}`,
          country: enterpriseResponse.data.country || 'Pays',
          city: enterpriseResponse.data.city || 'Ville'
        });
        
        // Charger le logo de l'entreprise
        try {
          const logoResponse = await getEnterpriseLogo();
          if (logoResponse.data && logoResponse.data.size > 0) {
            const logoBlob = new Blob([logoResponse.data]);
            const logoObjectUrl = URL.createObjectURL(logoBlob);
            setLogoUrl(logoObjectUrl);
            console.log('Logo chargé avec succès');
          }
        } catch (logoErr) {
          console.log('Pas de logo disponible:', logoErr);
          setLogoUrl(null);
        }
        
        // Mode édition non supporté - les endpoints getEnterpriseInfo et getOfferById n'existent pas
        if (isEditing && id) {
          setError('La modification d\'offres n\'est pas disponible actuellement');
          navigate('/entreprise/offres');
          return;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des infos entreprise:', error);
        setEnterpriseError("Impossible de charger les informations");
      } finally {
        setEnterpriseLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, id, navigate]);

  // Cleanup séparé pour le logoUrl
  React.useEffect(() => {
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [logoUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfConvention(e.target.files[0]);
    }
  };

  // Fonction de validation séparée pour améliorer la lisibilité
  const validateForm = (): string | null => {
    const requiredFields = [
      { value: form.title.trim(), name: 'Titre' },
      { value: form.description.trim(), name: 'Description' },
      { value: form.domain.trim(), name: 'Domaine' },
      { value: form.typeOfInternship.trim(), name: 'Type de stage' },
      { value: form.job.trim(), name: 'Poste/Job' },
      { value: form.requirements.trim(), name: 'Exigences' },
      { value: form.startDate.trim(), name: 'Date de début' },
      { value: form.endDate.trim(), name: 'Date de fin' }
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        return `Le champ "${field.name}" est obligatoire.`;
      }
    }

    if (!pdfConvention) {
      return 'La convention PDF est obligatoire.';
    }

    // Validation des dates
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    if (startDate >= endDate) {
      return 'La date de fin doit être postérieure à la date de début.';
    }

    // Validation du nombre de places
    if (!form.numberOfPlaces || form.numberOfPlaces < 1) {
      return 'Le nombre de places doit être un nombre positif.';
    }

    return null;
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('=== VALIDATION DES DONNÉES AVANT APERÇU ===');
    console.log('Form complet:', form);
    console.log('PDF Convention:', pdfConvention);
    
    const validationError = validateForm();
    if (validationError) {
      console.log('Erreur de validation:', validationError);
      setError(validationError);
      return;
    }

    console.log('=== DONNÉES VALIDÉES POUR APERÇU ===');
    console.log('Titre:', form.title);
    console.log('Description:', form.description);
    console.log('Job/Poste:', form.job);
    console.log('Domaine:', form.domain);
    console.log('Type de stage:', form.typeOfInternship);
    console.log('Exigences:', form.requirements);
    console.log('Date début:', form.startDate);
    console.log('Date fin:', form.endDate);
    console.log('Nombre de places:', form.numberOfPlaces);
    console.log('Payant:', form.paying);
    console.log('Remote:', form.remote);
    console.log('Convention PDF:', pdfConvention?.name);
    
    setShowPreview(true);
  };

  const handleCancel = () => {
    setShowPreview(false);
    setError(null);
    setSuccess(false);
  };

  const handleSubmitOffer = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      // Mode création uniquement (édition non supportée)
      const offerResponse = await createOffer(form);
      
      // Vérifier si l'ID est retourné dans la réponse
      const createdOfferId = offerResponse.data?.id;
      
      if (pdfConvention) {
        if (createdOfferId) {
          // Utiliser l'ID retourné si disponible
          await addConventionToOffer(createdOfferId, pdfConvention);
        } else {
          // Fallback: chercher l'offre par titre (plus fiable)
          const offersResponse = await getEnterpriseOffers();
          const matchingOffer = offersResponse.data.find(offer => 
            offer.title === form.title && 
            offer.description === form.description
          );
          if (matchingOffer?.id) {
            await addConventionToOffer(matchingOffer.id, pdfConvention);
          }
        }
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/entreprise/offres'), 2000);
    } catch (err: any) {
      // Éviter l'injection de logs - ne pas logger les données utilisateur
      const errorMessage = err?.response?.data?.message || 'Erreur lors de la création de l\'offre';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient text-[#2d2d2d]">
      <EnterpriseHeader />
      <div className="w-full flex justify-center items-start py-12">
        <div className="bg-[#f5ede3] shadow-xl p-8 max-w-4xl w-full border border-[#e1d3c1] flex flex-row gap-8 relative">
          {/* Colonne gauche : formulaire */}
          <div className="flex-1 min-w-[320px]">
            <div className="flex items-center mb-6">
              <button type="button" className="mr-2 text-xl cursor-pointer" onClick={() => navigate(-1)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">Créer une offre de stage</h2>
            </div>
            <form onSubmit={handlePreview} className="flex flex-col gap-3">
              <label className="font-medium">Titre du stage
                <input id="title" name="title" value={form.title} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none" />
              </label>
              <label className="font-medium">Description de la mission principale de l'étudiant
                <textarea id="description" name="description" value={form.description} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 min-h-[48px] outline-none" />
              </label>
              <label className="font-medium">Exigences concernant l'étudiant
                <textarea id="requirements" name="requirements" value={form.requirements} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 min-h-[48px] outline-none" />
              </label>
              <label className="font-medium">Domaine de l'offre
                <select id="domain" name="domain" value={form.domain} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none">
                  <option value="">-- Sélectionnez un domaine --</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Génie mécanique">Génie mécanique</option>
                  <option value="Administration des affaires">Administration des affaires</option>
                  <option value="Psychologie">Psychologie</option>
                  <option value="Biologie">Biologie</option>
                  <option value="Droit">Droit</option>
                  <option value="Économie">Économie</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Sciences politiques">Sciences politiques</option>
                  <option value="Sciences environnementales">Sciences environnementales</option>
                </select>
              </label>
              <label className="font-medium">Type de stage
                <select id="typeOfInternship" name="typeOfInternship" value={form.typeOfInternship} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none">
                  <option value="">-- Sélectionnez un type --</option>
                  <option value="Initiation">Initiation</option>
                  <option value="Perfectionnement">Perfectionnement</option>
                  <option value="Pré-emploi">Pré-emploi</option>
                </select>
              </label>
              <label className="font-medium">Poste/Job
                <input id="job" name="job" value={form.job} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none" />
              </label>
              <label className="font-medium">Nombre de places
                <input id="numberOfPlaces" name="numberOfPlaces" type="number" min="1" value={form.numberOfPlaces} onChange={(e) => setForm(prev => ({ ...prev, numberOfPlaces: parseInt(e.target.value) || 1 }))} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none" />
              </label>
              <div className="flex gap-2">
                <label className="flex-1 font-medium">Date de debut
                  <input id="startDate" type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none" />
                </label>
                <label className="flex-1 font-medium">Date de fin
                  <input id="endDate" type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none" />
                </label>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="paying" checked={form.paying} onChange={(e) => setForm(prev => ({ ...prev, paying: e.target.checked }))} /> Stage payant
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="remote" checked={form.remote} onChange={(e) => setForm(prev => ({ ...prev, remote: e.target.checked }))} /> Télétravail
                </label>
              </div>
              <label className="font-medium">Convention de stage
                <div className="mt-2">
                  <div className="bg-[#d4c4b0] rounded-lg p-4 h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#a89580]">
                    <input
                      id="pdfConvention"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="cursor-pointer flex flex-col items-center" onClick={() => document.getElementById('pdfConvention')?.click()}>
                      <div className="w-12 h-14 bg-white rounded border border-gray-300 flex flex-col items-center justify-center mb-2 shadow-sm">
                        <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">PDF</div>
                      </div>
                      <span className="text-sm text-[var(--color-dark)] font-medium text-center">
                        {pdfConvention ? pdfConvention.name : 'Convention de stage'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('pdfConvention')?.click()}
                    className="w-full mt-2 bg-[var(--color-vert)] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#6b7d4b] transition flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Uploader un fichier
                  </button>
                </div>
              </label>
              {!showPreview && error && <div className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">{error}</div>}
              {success && <div className="text-green-700 text-xs font-medium bg-green-50 border border-green-200 rounded px-3 py-2 mt-2">Votre offre a bien été envoyée !</div>}
              <div className="flex gap-4 mt-4">
                <button type="button" className="flex-1 bg-gray-200 text-gray-500 border border-gray-300 rounded py-2" disabled>Supprimer l'offre</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#4c7a4c] text-white rounded py-2 font-semibold hover:bg-[#6a9a6a] transition-colors disabled:opacity-60 cursor-pointer">
                  Créer l'offre
                </button>
              </div>
            </form>
          </div>
          {/* Colonne droite : logo, infos entreprise, vignette PDF, etc. */}
          <div className="w-64 min-w-[200px] flex flex-col items-center gap-4 pt-2">
            {/* Bloc dynamique infos entreprise */}
            {enterpriseLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs text-gray-400">Chargement des infos...</span>
              </div>
            ) : enterpriseError ? (
              <div className="text-xs text-red-600 text-center">Erreur lors du chargement des infos entreprise</div>
            ) : enterpriseInfo ? (
              <>
                <div className="w-20 h-20 bg-black rounded mb-2 flex items-center justify-center text-white font-bold text-lg">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo entreprise" 
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    getInitials(enterpriseInfo.name)
                  )}
                </div>
                <div className="text-xs text-center">
                  {enterpriseInfo.name}<br />
                  <div className="mt-2">{enterpriseInfo.sectorOfActivity || 'Secteur'} • {enterpriseInfo.location || 'Localisation'}</div>
                  <div>{enterpriseInfo.country || 'Pays'} • {enterpriseInfo.city || 'Ville'}</div>
                </div>
              </>
            ) : null}
          </div>
          {/* Décor bas droit (optionnel) */}
        </div>
      </div>

      {/* Modal d'aperçu de l'offre */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-[#e9dbc7] rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#2d2d2d]">Aperçu de l'offre de stage</h2>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-[#2d2d2d]">{form.title}</h3>

                  {/* Résumé */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#2d2d2d] mb-3">Résumé</h4>
                    <div className="space-y-2 text-sm text-[#2d2d2d]">
                      <div><span className="font-medium">Type de stage:</span> {form.typeOfInternship}</div>
                      <div><span className="font-medium">Poste:</span> {form.job}</div>
                      <div><span className="font-medium">Stage payant:</span> {form.paying ? 'OUI' : 'NON'}</div>
                      <div><span className="font-medium">Télétravail:</span> {form.remote ? 'OUI' : 'NON'}</div>
                      <div><span className="font-medium">Période du stage:</span> {formatDate(form.startDate)} - {formatDate(form.endDate)}</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {form.paying && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Payant</span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{form.domain}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#2d2d2d] mb-3">Description de la mission</h4>
                    <p className="text-sm text-[#2d2d2d]">{form.description}</p>
                  </div>

                  {/* Convention */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#2d2d2d] mb-3">Convention de stage</h4>
                    <div className="text-sm text-[#2d2d2d]">
                      Fichier: {pdfConvention?.name || 'Aucun fichier sélectionné'}
                    </div>
                  </div>

                  {/* Exigences */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#2d2d2d] mb-3">Exigences</h4>
                    <p className="text-sm text-[#2d2d2d]">{form.requirements}</p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="pt-6">
                    <div className="flex gap-4">
                      <button 
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 border border-gray-400 text-gray-600 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        disabled={submitting}
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={handleSubmitOffer}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-[#4c7a4c] text-white rounded hover:bg-[#6a9a6a] transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        {submitting ? 'Envoi...' : 'Envoyer l\'offre'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar droite */}
                <div className="space-y-6">
                  {/* Logo et infos entreprise */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Logo entreprise" 
                          className="w-full h-full object-contain rounded"
                        />
                      ) : (
                        enterpriseInfo ? getInitials(enterpriseInfo.name) : 'EN'
                      )}
                    </div>
                    <h4 className="font-semibold text-[#2d2d2d] mb-1">{enterpriseInfo?.name || 'Entreprise'}</h4>
                    <div className="text-xs text-[#2d2d2d] space-y-1">
                      <div>{enterpriseInfo?.location || 'Localisation'}</div>
                      <div>{enterpriseInfo?.sectorOfActivity || 'Secteur'}</div>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="space-y-3 text-sm text-[#2d2d2d]">
                    <div><span className="font-medium">Nombre de places:</span> {form.numberOfPlaces || '1'}</div>
                    <div><span className="font-medium">Domaine:</span> {form.domain}</div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-[#4c7a4c] text-white text-xs rounded">{form.domain}</span>
                      <span className="px-2 py-1 bg-[#6a9a6a] text-white text-xs rounded">{form.typeOfInternship}</span>
                      {form.remote && (
                        <span className="px-2 py-1 bg-[#8a7a5a] text-white text-xs rounded">Télétravail</span>
                      )}
                    </div>
                    {form.paying && (
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-[#b79056] text-white text-xs rounded">Payant</span>
                      </div>
                    )}
                    {console.log('Tags - Domaine:', form.domain, 'Type:', form.typeOfInternship, 'Remote:', form.remote, 'Payant:', form.paying)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreerOffreEntreprise;
