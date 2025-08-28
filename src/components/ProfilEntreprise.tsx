import React, { useState, useEffect } from 'react';
import { getEnterpriseLogo, uploadProfilePhoto } from '../api/enterpriseApi';
import { getUserEmail, updateEmail } from '../api/profileApi';
import EnterpriseHeader from './EnterpriseHeader';

interface EnterpriseProfile {
  id: number;
  name: string;
  email: string;
  country?: string;
  city?: string;
  sectorOfActivity?: string;
  contact?: string;
  location?: string;
  matriculation?: string;
  inPartnership?: boolean;
}

const ProfilEntreprise: React.FC = () => {
  const [profile, setProfile] = useState<EnterpriseProfile | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EnterpriseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'email de l'utilisateur connecté
        const emailResponse = await getUserEmail();
        const userEmail = emailResponse.data;
        
        // Créer un profil par défaut avec l'email récupéré
        const profileData = {
          id: 1,
          name: 'Mon Entreprise',
          email: userEmail,
          country: '',
          city: '',
          sectorOfActivity: '',
          contact: '',
          location: '',
          matriculation: '',
          inPartnership: false
        };
        setProfile(profileData);
        setEditForm(profileData);

        // Essayer de récupérer le logo
        try {
          const logoResponse = await getEnterpriseLogo();
          if (logoResponse.data && logoResponse.data.size > 0) {
            const logoBlob = new Blob([logoResponse.data]);
            const logoObjectUrl = URL.createObjectURL(logoBlob);
            setLogoUrl(logoObjectUrl);
          }
        } catch (logoErr) {
          // Pas de logo disponible ou erreur serveur
          console.log('Aucun logo disponible');
          setLogoUrl(null);
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement du profil:', err);
        console.error('Détails de l\'erreur:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInitials = (name: string | undefined) => {
    if (!name) return 'EN';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!editForm) return;
    setSaving(true);
    try {
      // Note: Les endpoints pour mettre à jour les informations d'entreprise
      // ne sont pas disponibles dans le backend. Seule la mise à jour d'email est possible.
      if (editForm.email !== profile?.email) {
        await updateEmail(editForm.email);
      }
      
      // Sauvegarder localement les autres informations
      setProfile(editForm);
      setIsEditing(false);
      alert('Profil mis à jour avec succès!');
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      const errorMessage = err?.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadProfilePhoto(file);
      // Recharger le logo
      try {
        const logoResponse = await getEnterpriseLogo();
        if (logoResponse.data && logoResponse.data.size > 0) {
          const logoBlob = new Blob([logoResponse.data]);
          const logoObjectUrl = URL.createObjectURL(logoBlob);
          if (logoUrl) URL.revokeObjectURL(logoUrl);
          setLogoUrl(logoObjectUrl);
        }
      } catch (logoErr) {
        console.log('Erreur lors du rechargement du logo');
      }
      alert('Logo mis à jour avec succès!');
    } catch (err: any) {
      console.error('Erreur lors de l\'upload du logo:', err);
      const errorMessage = err?.response?.data?.message || 'Erreur lors de l\'upload du logo';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-login-gradient">
        <EnterpriseHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-white">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-login-gradient">
        <EnterpriseHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-white">Profil non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <EnterpriseHeader />
      <div className="flex justify-center items-center min-h-[80vh] p-8">
        <div className="bg-transparent border-2 border-[var(--color-jaune)] rounded-lg p-8 max-w-2xl w-full">
          {!isEditing ? (
            // Vue d'affichage
            <>
              <h1 className="text-2xl font-light text-[var(--color-jaune)] text-center mb-8">
                Profil de l'entreprise
              </h1>
              
              <div className="flex items-start gap-8">
                {/* Informations à gauche */}
                <div className="flex-grow text-white space-y-3">
                  <h2 className="text-xl font-light mb-6">{profile.name}</h2>
                  
                  <div><span className="font-medium">Email :</span> {profile.email || 'Non renseigné'}</div>
                  <div><span className="font-medium">Pays :</span> {profile.country || 'Non renseigné'}</div>
                  <div><span className="font-medium">Ville :</span> {profile.city || 'Non renseigné'}</div>
                  <div><span className="font-medium">Domaine d'activé :</span> {profile.sectorOfActivity || 'Non renseigné'}</div>
                  <div><span className="font-medium">Telephone :</span> {profile.contact || 'Non renseigné'}</div>
                </div>

                {/* Logo à droite */}
                <div className="flex-shrink-0">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo entreprise" 
                      className="w-24 h-24 object-contain bg-white rounded p-2"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white rounded flex items-center justify-center text-black font-bold text-xl">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[var(--color-vert)] text-white px-6 py-2 rounded cursor-pointer"
                >
                  Modifier le profil
                </button>
              </div>
            </>
          ) : (
            // Vue de modification
            <>
              <h1 className="text-2xl font-light text-[var(--color-jaune)] text-center mb-8">
                Modification de profil
              </h1>

              <div className="bg-transparent border border-[var(--color-jaune)] rounded p-6">
                <p className="text-white text-sm mb-6">Définissez les informations du profil</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm?.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-200 rounded text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-1">Pays</label>
                    <input
                      type="text"
                      name="country"
                      value={editForm?.country || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-200 rounded text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-1">Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm?.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-200 rounded text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-1">Domaine d'activé</label>
                    <select
                      name="sectorOfActivity"
                      value={editForm?.sectorOfActivity || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-200 rounded text-black outline-none"
                    >
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
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-1">Telephone</label>
                    <input
                      type="tel"
                      name="contact"
                      value={editForm?.contact || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-200 rounded text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-1">Localisation</label>
                    <input
                      type="text"
                      name="location"
                      value={editForm?.location || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-200 rounded text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Logo de l'entreprise</label>
                    <div className="bg-white rounded p-4 w-32">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Logo entreprise" 
                          className="w-full h-20 object-contain"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-300 rounded flex items-center justify-center text-black font-bold">
                          {getInitials(profile.name)}
                        </div>
                      )}
                      <p className="text-xs text-gray-600 text-center mt-1">Photo de couverture</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="w-full bg-[var(--color-vert)] text-white text-xs py-1 rounded mt-2 cursor-pointer block text-center"
                      >
                        Importer un fichier
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 text-[var(--color-light)] py-2 rounded border border-[var(--color-jaune)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[var(--color-vert)] text-[var(--color-light)] py-2 rounded cursor-pointer  disabled:opacity-60"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilEntreprise;