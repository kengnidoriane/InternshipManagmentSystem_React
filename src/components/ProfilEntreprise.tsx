import React, { useState, useEffect } from 'react';
import { getEnterpriseLogo, uploadProfilePhoto, getCurrentEnterpriseInfo, updateContact, updateLocation, updateLogo } from '../api/enterpriseApi';
import EnterpriseHeader from './entreprise/EnterpriseHeader';

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
  const [loadingStates, setLoadingStates] = useState({
    contact: false,
    location: false,
    logo: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enterpriseResponse = await getCurrentEnterpriseInfo();
        
        const profileData = {
          id: enterpriseResponse.data.id || 0,
          name: enterpriseResponse.data.name || 'Mon Entreprise',
          email: enterpriseResponse.data.email || '',
          country: enterpriseResponse.data.country || '',
          city: enterpriseResponse.data.city || '',
          sectorOfActivity: enterpriseResponse.data.sectorOfActivity || '',
          contact: enterpriseResponse.data.contact || '',
          location: enterpriseResponse.data.location || '',
          matriculation: enterpriseResponse.data.matriculation || '',
          inPartnership: enterpriseResponse.data.inPartnership || false
        };
        setProfile(profileData);
        setEditForm(profileData);

        try {
          const logoResponse = await getEnterpriseLogo();
          if (logoResponse.data && logoResponse.data.size > 0) {
            const logoBlob = new Blob([logoResponse.data]);
            const logoObjectUrl = URL.createObjectURL(logoBlob);
            setLogoUrl(logoObjectUrl);
          }
        } catch (logoErr) {
          console.log('Aucun logo disponible');
          setLogoUrl(null);
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement du profil:', err);
        
        const fallbackProfile = {
          id: 0,
          name: 'Mon Entreprise',
          email: '',
          country: '',
          city: '',
          sectorOfActivity: '',
          contact: '',
          location: '',
          matriculation: '',
          inPartnership: false
        };
        setProfile(fallbackProfile);
        setEditForm(fallbackProfile);
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

  const handleUpdateContact = async () => {
    if (!editForm?.contact) return;
    setLoadingStates(prev => ({ ...prev, contact: true }));
    try {
      await updateContact(editForm.contact);
      setProfile(prev => prev ? { ...prev, contact: editForm.contact } : null);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du contact:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, contact: false }));
    }
  };

  const handleUpdateLocation = async () => {
    if (!editForm?.location) return;
    setLoadingStates(prev => ({ ...prev, location: true }));
    try {
      await updateLocation(editForm.location);
      setProfile(prev => prev ? { ...prev, location: editForm.location } : null);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la localisation:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, location: false }));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    setLoadingStates(prev => ({ ...prev, logo: true }));
    try {
      await updateLogo(profile.id, file);
      
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
    } catch (err: any) {
      console.error('Erreur lors de l\'upload du logo:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, logo: false }));
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
            <>
              <h1 className="text-2xl font-light text-[var(--color-jaune)] text-center mb-8">
                Profil de l'entreprise
              </h1>
              
              <div className="flex items-start gap-8">
                <div className="flex-grow text-white space-y-3">
                  <h2 className="text-xl font-light mb-6">{profile.name}</h2>
                  
                  <div><span className="font-medium">Email :</span> {profile.email || 'Non renseigné'}</div>
                  <div><span className="font-medium">Pays :</span> {profile.country || 'Non renseigné'}</div>
                  <div><span className="font-medium">Ville :</span> {profile.city || 'Non renseigné'}</div>
                  <div><span className="font-medium">Domaine d'activité :</span> {profile.sectorOfActivity || 'Non renseigné'}</div>
                  <div><span className="font-medium">Téléphone :</span> {profile.contact || 'Non renseigné'}</div>
                  <div><span className="font-medium">Localisation :</span> {profile.location || 'Non renseigné'}</div>
                </div>

                <div className="flex-shrink-0">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo entreprise" 
                      className="w-24 h-auto object-contain bg-white rounded"
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
            <>
              <h1 className="text-2xl font-light text-[var(--color-jaune)] text-center mb-8">
                Modification de profil
              </h1>

              <div className="bg-transparent border border-[var(--color-jaune)] rounded p-6">
                <p className="text-white text-sm mb-6">Modification du profil entreprise</p>
                
                <div className="space-y-6">
                  {/* Contact */}
                  <div>
                    <label className="block text-white text-sm mb-1">Contact</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="contact"
                        value={editForm?.contact || ''}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-gray-200 rounded text-black outline-none"
                      />
                      <button
                        onClick={handleUpdateContact}
                        disabled={loadingStates.contact}
                        className="bg-[var(--color-vert)] text-white px-4 py-2 rounded hover:bg-[#6b7d4b] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loadingStates.contact ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-white text-sm mb-1">Localisation</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="location"
                        value={editForm?.location || ''}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-gray-200 rounded text-black outline-none"
                      />
                      <button
                        onClick={handleUpdateLocation}
                        disabled={loadingStates.location}
                        className="bg-[var(--color-vert)] text-white px-4 py-2 rounded hover:bg-[#6b7d4b] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {loadingStates.location ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </div>
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="block text-white text-sm mb-2">Logo de l'entreprise</label>
                    <div className="flex items-center gap-4">
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
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <button
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          disabled={loadingStates.logo}
                          className="bg-[var(--color-vert)] text-white px-4 py-2 rounded hover:bg-[#6b7d4b] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {loadingStates.logo ? 'Upload...' : 'Changer le logo'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Fermer
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