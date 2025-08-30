import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import type { StudentResponseDto } from '../../types/student';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Récupérer depuis le state de navigation
        const stateAny = location.state as unknown as { student?: StudentResponseDto } | undefined;
        if (stateAny && stateAny.student) {
          setStudent(stateAny.student);
          setLoading(false);
          return;
        }
        
        setError('Aucune donnée d\'étudiant disponible');
        setLoading(false);
        
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'étudiant');
        console.error(err);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id, location.state]);

  const handleDeleteAccount = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte étudiant ?')) {
      // TODO: Implémenter la suppression quand l'endpoint sera disponible
      console.log('Suppression du compte étudiant:', student?.id);
      navigate('/admin/students');
    }
  };

  const getInitials = (name: string, firstName: string) => {
    return `${firstName.charAt(0)}${name.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen w-full bg-login-gradient">
      <AdminHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          {/* Bouton retour */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/admin/students')}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-xl font-medium">Retour aux étudiants</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : student ? (
            <div>
              <div className="bg-[#e7e1e1be] rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start">
                  {/* Avatar de l'étudiant */}
                  <div className="w-32 h-32 rounded-md flex items-center justify-center mr-6 overflow-hidden">
                    <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center text-4xl">
                      {getInitials(student.name, student.firstName)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{student.firstName} {student.name}</h1>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                          student.onInternship 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {student.onInternship ? 'En stage' : 'Disponible'}
                        </span>
                        <p className="text-gray-700">{student.department}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold mb-2">Informations de contact</h2>
                      <p className="text-gray-700">Email: {student.email}</p>
                      {student.department && (
                        <p className="text-gray-700">Département: {student.department}</p>
                      )}
                      
                      {/* Liens sociaux */}
                      {((student as any).githubLink || (student as any).linkedinLink) && (
                        <div className="mt-4">
                          <h3 className="text-md font-semibold mb-2">Liens professionnels</h3>
                          <div className="flex gap-4">
                            {(student as any).githubLink && (
                              <a 
                                href={(student as any).githubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <span>🐈</span> GitHub
                              </a>
                            )}
                            {(student as any).linkedinLink && (
                              <a 
                                href={(student as any).linkedinLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <span>💼</span> LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Debug: Afficher toutes les propriétés disponibles */}
                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                        <h4 className="font-semibold mb-1">Données disponibles:</h4>
                        <pre className="text-xs overflow-auto">{JSON.stringify(student, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Zone de danger */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h2>
                <p className="text-gray-600 mb-4">
                  La suppression du compte étudiant est irréversible. Toutes les données associées seront perdues.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4">Aucune information disponible pour cet étudiant.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDetail;