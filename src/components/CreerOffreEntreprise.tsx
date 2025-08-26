import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOffer, updateOffer, getEnterpriseInfo, getOfferById, getEnterpriseLogo } from '../api/enterpriseApi';
import type { OfferRequestDto } from '../types/offer';
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
  numberOfPlaces: '1',
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
        const enterpriseResponse = await getEnterpriseInfo();
        setEnterpriseInfo(enterpriseResponse.data);
        
        // Charger le logo de l'entreprise
        try {
          const logoResponse = await getEnterpriseLogo();
          if (logoResponse.data && logoResponse.data.size > 0) {
            const logoBlob = new Blob([logoResponse.data]);
            const logoObjectUrl = URL.createObjectURL(logoBlob);
            setLogoUrl(logoObjectUrl);
          }
        } catch (logoErr) {
          setLogoUrl(null);
        }
        
        // Si on est en mode édition, charger l'offre existante
        if (isEditing && id) {
          const offerResponse = await getOfferById(parseInt(id));
          const offer = offerResponse.data;
          setForm({
            title: offer.title,
            description: offer.description,
            domain: offer.domain,
            typeOfInternship: offer.typeOfInternship || '',
            job: offer.job,
            requirements: offer.requirements || '',
            numberOfPlaces: offer.numberOfPlaces || '1',
            startDate: offer.startDate,
            endDate: offer.endDate,
            paying: offer.paying || false,
            remote: offer.remote || false
          });
        }
      } catch (error) {
        setEnterpriseError("Impossible de charger les informations");
      } finally {
        setEnterpriseLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfConvention(e.target.files[0]);
    }
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation stricte : tous les champs doivent être remplis
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.domain.trim() ||
      !form.typeOfInternship.trim() ||
      !form.job.trim() ||
      !form.requirements.trim() ||
      !form.startDate.trim() ||
      !form.endDate.trim() ||
      (!pdfConvention && !isEditing)
    ) {
      setError(`Tous les champs sont obligatoires${!isEditing ? ', y compris la convention PDF' : ''}.`);
      return;
    }

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
      console.log('=== FORM DATA BEING SENT ===');
      console.log('Form:', form);
      console.log('PDF Convention:', pdfConvention);
      console.log('Is Editing:', isEditing);
      console.log('============================');
      
      if (isEditing && id) {
        await updateOffer(parseInt(id), { ...form, pdfConvention: pdfConvention || undefined });
        setSuccess(true);
        setTimeout(() => navigate(`/entreprise/offres/${id}`), 2000);
      } else {
        await createOffer({ ...form, pdfConvention: pdfConvention || undefined });
        setSuccess(true);
        setTimeout(() => navigate('/entreprise/offres'), 2000);
      }
    } catch (err: any) {
      console.error('Error details:', err.response?.data);
      setError(err?.response?.data?.message || `Erreur lors de ${isEditing ? 'la modification' : 'la création'} de l'offre`);
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
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-xl font-semibold">{isEditing ? 'Modifier l\'offre de stage' : 'Creer une offre de stage'}</h2>
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
                <input id="numberOfPlaces" name="numberOfPlaces" type="number" min="1" value={form.numberOfPlaces} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 outline-none" />
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
                <input id="pdfConvention" type="file" accept="application/pdf" onChange={handleFileChange} className="block mt-1" />
                {pdfConvention && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src="/pdf-icon.png" alt="PDF" className="w-12 h-12 object-contain border" />
                    <span className="text-xs">{pdfConvention.name}</span>
                  </div>
                )}
              </label>
              {!showPreview && error && <div className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">{error}</div>}
              {success && <div className="text-green-700 text-xs font-medium bg-green-50 border border-green-200 rounded px-3 py-2 mt-2">Votre offre a bien été envoyée !</div>}
              <div className="flex gap-4 mt-4">
                <button type="button" className="flex-1 bg-gray-200 text-gray-500 border border-gray-300 rounded py-2" disabled>Supprimer l'offre</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#4c7a4c] text-white rounded py-2 font-semibold hover:bg-[#6a9a6a] transition-colors disabled:opacity-60 cursor-pointer">
                  {showPreview ? (isEditing ? 'Mettre l\'offre à jour' : 'Créer l\'offre') : (isEditing ? 'Modifier l\'offre' : 'Créer l\'offre')}
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

      {/* Aperçu de l'offre - en dessous avec la même largeur */}
      {showPreview && (
        <div className="w-full flex justify-center items-start">
          <div className="bg-[#e9dbc7] shadow-xl p-8 max-w-4xl w-full border border-[#d1c3b1]">
            <h2 className="text-2xl font-bold text-[#2d2d2d] mb-6">Aperçu de l'offre de stage</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Titre */}
                <h3 className="text-2xl font-bold text-[#2d2d2d]">{form.title}</h3>

                {/* Résumé */}
                <div>
                  <h4 className="text-lg font-semibold text-[#2d2d2d] mb-3">Résumé</h4>
                  <div className="space-y-2 text-sm text-[#2d2d2d]">
                    <div><span className="font-medium">Type de stage:</span> {form.job}</div>
                    <div><span className="font-medium">Stage payant:</span> {form.paying ? 'OUI' : 'NON'}</div>
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
                    Fichier: {pdfConvention?.name}
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
                    <span className="px-2 py-1 bg-[#6a9a6a] text-white text-xs rounded">{form.job}</span>
                  </div>
                  {form.paying && (
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-[#b79056] text-white text-xs rounded">Payant</span>
                    </div>
                  )}
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
