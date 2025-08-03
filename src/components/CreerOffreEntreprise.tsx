import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOffer } from '../api/enterpriseApi';
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

const CreerOffreEntreprise: React.FC = () => {
  const [form, setForm] = useState<OfferRequestDto>(defaultState);
  const [pdfConvention, setPdfConvention] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createOffer({ ...form, pdfConvention: pdfConvention || undefined });
      setSuccess(true);
      setTimeout(() => navigate('/entreprise/dashboard'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-gradient)]">
      <EnterpriseHeader />
      <div className="w-full flex justify-center items-center py-12">
  <div className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-[var(--color-jaune)]">
    <h2 className="text-2xl font-semibold text-[var(--color-vert)] mb-6 text-center tracking-wide">Créer une nouvelle offre de stage</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="block mb-1 text-[var(--color-dark)] font-medium">Titre du stage</label>
        <input id="title" name="title" placeholder="ex: Développeur React" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50" />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1 text-[var(--color-dark)] font-medium">Description</label>
        <textarea id="description" name="description" placeholder="Décrivez la mission, l'environnement..." value={form.description} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50 min-h-[80px]" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="domain" className="block mb-1 text-[var(--color-dark)] font-medium">Domaine</label>
          <input id="domain" name="domain" placeholder="ex: Informatique" value={form.domain} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50" />
        </div>
        <div className="flex-1">
          <label htmlFor="job" className="block mb-1 text-[var(--color-dark)] font-medium">Poste</label>
          <input id="job" name="job" placeholder="ex: Développeur" value={form.job} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50" />
        </div>
      </div>
      <div>
        <label htmlFor="requirements" className="block mb-1 text-[var(--color-dark)] font-medium">Pré-requis</label>
        <textarea id="requirements" name="requirements" placeholder="Compétences, outils, niveau..." value={form.requirements} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50 min-h-[60px]" />
      </div>
      <div>
        <label htmlFor="typeOfInternship" className="block mb-1 text-[var(--color-dark)] font-medium">Type de stage</label>
        <select id="typeOfInternship" name="typeOfInternship" value={form.typeOfInternship} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50">
          <option value="">Sélectionnez un type</option>
          <option value="conventionné">Conventionné</option>
          <option value="alternance">Alternance</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div>
        <label htmlFor="pdfConvention" className="block mb-1 text-[var(--color-dark)] font-medium">Convention (PDF)</label>
        <input id="pdfConvention" type="file" accept="application/pdf" onChange={handleFileChange} className="w-full px-3 py-2 rounded border border-gray-300 bg-gray-50" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block mb-1 text-[var(--color-dark)] font-medium">Date de début</label>
          <input id="startDate" type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50" />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block mb-1 text-[var(--color-dark)] font-medium">Date de fin</label>
          <input id="endDate" type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-[var(--color-vert)] bg-gray-50" />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">{error}</div>}
      {success && <div className="text-green-700 text-sm font-medium bg-green-50 border border-green-200 rounded px-3 py-2 mt-2">Offre créée avec succès !</div>}
      <button type="submit" disabled={loading} className="w-full bg-[var(--color-vert)] hover:bg-[var(--color-jaune)] text-white font-semibold py-2 rounded transition-colors mt-2 disabled:opacity-60">
        {loading ? 'Création...' : 'Créer l\'offre'}
      </button>
    </form>
  </div>
</div>
    </div>
  );
};

export default CreerOffreEntreprise;
