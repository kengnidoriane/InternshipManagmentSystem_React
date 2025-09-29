import React, { useState } from 'react';
import { useNewEndpoints } from '../hooks/useNewEndpoints';
import { enableFeature, disableFeature } from '../utils/apiCompatibility';

// Composant pour tester les nouveaux endpoints (à utiliser en dev uniquement)
export const TestNewEndpoints: React.FC = () => {
  const { getStudentProfile, checkStudentStatus, loading, error } = useNewEndpoints();
  const [results, setResults] = useState<any>(null);

  const testStudentProfile = async () => {
    const profile = await getStudentProfile();
    setResults({ type: 'profile', data: profile });
  };

  const testStudentStatus = async () => {
    const status = await checkStudentStatus();
    setResults({ type: 'status', data: status });
  };

  // Afficher seulement en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>🧪 Test Nouveaux Endpoints</h4>
      
      <button onClick={testStudentProfile} disabled={loading}>
        Test Profil Étudiant
      </button>
      
      <button onClick={testStudentStatus} disabled={loading}>
        Test Statut Étudiant
      </button>
      
      <button onClick={() => enableFeature('useNewStudentProfile')}>
        ✅ Activer Profil
      </button>
      
      <button onClick={() => disableFeature('useNewStudentProfile')}>
        ❌ Désactiver Profil
      </button>

      {loading && <p>⏳ Chargement...</p>}
      {error && <p style={{color: 'red'}}>❌ {error}</p>}
      {results && (
        <pre style={{fontSize: '10px', maxHeight: '100px', overflow: 'auto'}}>
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
};