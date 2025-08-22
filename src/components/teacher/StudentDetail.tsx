import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeacherHeader from '../TeacherHeader';
import { getStudentsByDepartment, downloadStudentCV } from '../../api/teacherApi';
import type { StudentResponseDto } from '../../types/student';
import type { OfferResponseDto } from '../../types/offer';

interface StudentWithInternship extends StudentResponseDto {
  internship?: OfferResponseDto;
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentWithInternship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // Récupérer la liste des étudiants et filtrer pour obtenir celui demandé
    getStudentsByDepartment()
      .then(res => {
        const students = res.data as StudentResponseDto[];
        const foundStudent = students.find(s => s.id === parseInt(id));
        
        if (foundStudent) {
          // Pour l'instant, nous n'avons pas d'API pour récupérer le stage d'un étudiant spécifique
          // Nous allons donc simuler cette information
          const studentWithInternship: StudentWithInternship = {
            ...foundStudent,
            internship: foundStudent.onInternship ? {
              id: 1,
              title: 'Développement d\'une application web',
              description: 'Stage de développement web avec React et Spring Boot',
              domain: 'Développement web',
              startDate: '2023-06-01',
              endDate: '2023-08-31',
              status: 'En cours',
              enterprise: {
                id: 1,
                name: 'Entreprise XYZ',
                email: 'contact@xyz.com',
                sector: 'Informatique',
                matriculation: 'XYZ123',
              },
            } : undefined
          };
          
          setStudent(studentWithInternship);
          setError(null);
        } else {
          setError('Étudiant non trouvé');
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des détails de l\'étudiant:', err);
        setError('Impossible de récupérer les détails de l\'étudiant. Veuillez réessayer plus tard.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadCV = async () => {
    if (!student) return;
    
    try {
      const response = await downloadStudentCV(student.id.toString());
      
      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${student.name.replace(' ', '_')}_${student.firstName.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur lors du téléchargement du CV:', err);
      alert('Impossible de télécharger le CV. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="min-h-screen bg-login-gradient">
      <TeacherHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          {/* Bouton retour */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/enseignant/etudiants')}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-xl font-medium">Retour à la liste</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : student ? (
            <div>
              {/* Informations de l'étudiant */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start">
                  {/* Avatar de l'étudiant */}
                  <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden mr-6">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${student.name}+${student.firstName}&background=random&size=128`} 
                      alt={`${student.name} ${student.firstName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold text-[var(--color-dark)]">{student.name} {student.firstName}</h1>
                        <p className="text-gray-600">{student.email}</p>
                        <p className="mt-2">Département: <span className="font-semibold">{student.department}</span></p>
                        <p className="mt-1">Statut: 
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${student.onInternship ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {student.onInternship ? 'En stage' : 'Sans stage'}
                          </span>
                        </p>
                      </div>
                      
                      <button 
                        onClick={handleDownloadCV}
                        className="bg-[#e1d3c1] text-[var(--color-vert)] px-4 py-2 rounded font-medium hover:bg-[#d6c4af] transition flex items-center"
                      >
                        <span>Télécharger CV</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h2 className="text-lg font-semibold text-[var(--color-dark)] mb-2">Compétences</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">React</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">TypeScript</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Java</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Spring Boot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Informations sur le stage */}
              {student.onInternship && student.internship ? (
                <motion.div 
                  className="bg-white rounded-lg shadow-md p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold text-[var(--color-dark)] mb-4">Stage en cours</h2>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="text-lg font-medium text-[var(--color-dark)]">{student.internship.title}</h3>
                    <p className="text-gray-600 mb-2">{student.internship.enterprise.name}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Période</p>
                        <p className="font-medium">
                          {new Date(student.internship.startDate).toLocaleDateString('fr-FR')} - {new Date(student.internship.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Domaine</p>
                        <p className="font-medium">{student.internship.domain}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="mt-1">{student.internship.description}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="bg-white rounded-lg shadow-md p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-gray-600">Cet étudiant n'a pas encore de stage.</p>
                </motion.div>
              )}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}