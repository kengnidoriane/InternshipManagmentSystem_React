import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeacherHeader from '../TeacherHeader';
import { getStudentsByDepartment } from '../../api/teacherApi';
import type { StudentResponseDto } from '../../types/student';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getStudentsByDepartment()
      .then(res => {
        const students = res.data as StudentResponseDto[];
        const foundStudent = students.find(s => s.id === parseInt(id));
        
        if (foundStudent) {
          setStudent(foundStudent);
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



  return (
    <div className="min-h-screen bg-login-gradient">
      <TeacherHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
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
                    

                  </div>
                </div>
              </motion.div>
              
              {/* Statut du stage */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {student.onInternship ? (
                  <div className="text-green-600">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Étudiant en stage</h3>
                    <p className="text-gray-600">Cet étudiant effectue actuellement un stage.</p>
                  </div>
                ) : (
                  <div className="text-yellow-600">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Étudiant sans stage</h3>
                    <p className="text-gray-600">Cet étudiant n'a pas encore trouvé de stage.</p>
                  </div>
                )}
              </motion.div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}