import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOffer, getEnterpriseInfo } from '../api/enterpriseApi';
import type { OfferRequestDto } from '../types/offer';
import EnterpriseHeader from './EnterpriseHeader';

const defaultState: OfferRequestDto = {
  title: '',
  description: '',
  domain: '',
  job: '',
  requirements: '',
  typeOfInternship: '',
  startDate: '',
  endDate: '',
};

type EnterpriseInfo = {
  name: string;
  logoUrl?: string;
  description?: string;
  sector?: string;
  location?: string;
  languages?: string[];
  conventionYear?: string;
};

const CreerOffreEntreprise: React.FC = () => {
  const [form, setForm] = useState<OfferRequestDto>(defaultState);
  const [pdfConvention, setPdfConvention] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // --- Ajout pour infos entreprise dynamiques ---
  const [enterpriseInfo, setEnterpriseInfo] = useState<EnterpriseInfo | null>(null);
  const [enterpriseLoading, setEnterpriseLoading] = useState(true);
  const [enterpriseError, setEnterpriseError] = useState<string | null>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    setEnterpriseLoading(true);
    getEnterpriseInfo()
      .then(data => setEnterpriseInfo(data))
      .catch(() => setEnterpriseError("Impossible de charger les informations de l'entreprise"))
      .finally(() => setEnterpriseLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfConvention(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation stricte : tous les champs doivent être remplis
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.domain.trim() ||
      !form.job.trim() ||
      !form.requirements.trim() ||
      !form.typeOfInternship.trim() ||
      !form.startDate.trim() ||
      !form.endDate.trim() ||
      !pdfConvention
    ) {
      setError('Tous les champs sont obligatoires, y compris la convention PDF.');
      return;
    }

    setLoading(true);
    try {
      await createOffer({ ...form, pdfConvention });
      setSuccess(true);
      setTimeout(() => navigate('/entreprise/dashboard'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création de l'offre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#e1d3c1] text-[#2d2d2d]">
      <EnterpriseHeader />
      <div className="w-full flex justify-center items-start py-12">
        <div className="bg-[#f5ede3] rounded-2xl shadow-xl p-8 max-w-4xl w-full border border-[#e1d3c1] flex flex-row gap-8 relative">
          {/* Colonne gauche : formulaire */}
          <div className="flex-1 min-w-[320px]">
            <div className="flex items-center mb-6">
              <button type="button" className="mr-2 text-xl" onClick={() => navigate(-1)}>
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-xl font-semibold">Creer une offre de stage</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="font-medium">Titre du stage
                <input id="title" name="title" value={form.title} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1" />
              </label>
              <label className="font-medium">Description de la mission principale de l'étudiant
                <textarea id="description" name="description" value={form.description} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 min-h-[48px]" />
              </label>
              <label className="font-medium">Exigences concernant l'étudiant
                <textarea id="requirements" name="requirements" value={form.requirements} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 min-h-[48px]" />
              </label>
              <label className="font-medium">Domaine de l'offre
                <input id="domain" name="domain" value={form.domain} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1" />
              </label>
              <label className="font-medium">Type de stage
                <input id="typeOfInternship" name="typeOfInternship" value={form.typeOfInternship} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1" />
              </label>
              <label className="font-medium">Nombre de place
                <input id="places" name="places" type="number" min="1" className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1" onChange={handleChange} />
              </label>
              <div className="flex gap-2">
                <label className="flex-1 font-medium">Date de debut
                  <input id="startDate" type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1" />
                </label>
                <label className="flex-1 font-medium">Date de fin
                  <input id="endDate" type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1" />
                </label>
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="paid" /> Stage payant
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="remote" /> En remote
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="onStudy" /> Sur etude de dossier
                </label>
              </div>
              <label className="font-medium">Tags
                <textarea id="tags" name="tags" className="w-full px-2 py-1 rounded border border-gray-300 bg-white mt-1 min-h-[32px]" onChange={handleChange} />
              </label>
              <label className="font-medium">Convention de stage
                <input id="pdfConvention" type="file" accept="application/pdf" onChange={handleFileChange} className="block mt-1" />
                {pdfConvention && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src="/pdf-icon.png" alt="PDF" className="w-12 h-12 object-contain border" />
                    <span className="text-xs">{pdfConvention.name}</span>
                  </div>
                )}
              </label>
              {error && <div className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">{error}</div>}
              {success && <div className="text-green-700 text-xs font-medium bg-green-50 border border-green-200 rounded px-3 py-2 mt-2">Offre créée avec succès !</div>}
              <div className="flex gap-4 mt-4">
                <button type="button" className="flex-1 bg-gray-200 text-gray-500 border border-gray-300 rounded py-2" disabled>Supprimer l'offre</button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#4c7a4c] text-white rounded py-2 font-semibold hover:bg-[#6a9a6a] transition-colors disabled:opacity-60">
                  {loading ? 'Création...' : 'Créer l\'offre'}
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
                <img
                  src={enterpriseInfo.logoUrl || '/logo-placeholder.png'}
                  alt="Logo entreprise"
                  className="w-20 h-20 object-contain rounded mb-2 border"
                />
                <div className="text-xs text-center">
                  {enterpriseInfo.name}<br />
                  <span className="flex justify-center gap-1 mt-1">
                    {enterpriseInfo.languages?.includes('fr') && (
                      <img src="/flag-fr.png" alt="FR" className="w-5 inline" />
                    )}
                    {enterpriseInfo.languages?.includes('en') && (
                      <img src="/flag-en.png" alt="EN" className="w-5 inline" />
                    )}
                    {enterpriseInfo.languages?.includes('es') && (
                      <img src="/flag-es.png" alt="ES" className="w-5 inline" />
                    )}
                  </span>
                  <div className="mt-2">{enterpriseInfo.sector} • {enterpriseInfo.location}<br />{enterpriseInfo.description}</div>
                </div>
                <div className="mt-4">
                  <img src="/pdf-icon.png" alt="PDF" className="w-16 h-16 object-contain mx-auto" />
                  <div className="text-xs text-center mt-1">Convention {enterpriseInfo.conventionYear || 'N/A'}</div>
                </div>
              </>
            ) : null}
          </div>
          {/* Décor bas droit (optionnel) */}
        </div>
      </div>
    </div>
  );
};

export default CreerOffreEntreprise;
