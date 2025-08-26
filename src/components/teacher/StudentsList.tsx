import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeacherHeader from '../TeacherHeader';
import { getStudentsByDepartment, downloadStudentCV } from '../../api/teacherApi';
import type { StudentResponseDto } from '../../types/student';

export default function StudentsList() {
  const [students, setStudents] = useState<StudentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getStudentsByDepartment()
      .then(res => {
        setStudents(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des étudiants:', err);
        setError('Impossible de récupérer la liste des étudiants. Veuillez réessayer plus tard.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCV = async (studentId: number, studentName: string) => {
    try {
      const response = await downloadStudentCV(studentId.toString());
      
      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${studentName.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur lors du téléchargement du CV:', err);
      alert('Impossible de télécharger le CV. Veuillez réessayer plus tard.');
    }
  };

  const handleStudentClick = (studentId: number) => {
    navigate(`/enseignant/etudiants/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-login-gradient">
      <TeacherHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-[var(--color-dark)] mb-6">Voir la liste de vos étudiants ({students.length})</h1>
          
          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Aucun étudiant trouvé dans votre département.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <motion.div 
                  key={student.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4" onClick={() => handleStudentClick(student.id)}>
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-dark)]">
                          Développeur front-end
                          {student.onInternship && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">En stage</span>}
                        </h3>
                        <p className="text-sm text-gray-600">{student.name} {student.firstName}</p>
                      </div>
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${student.name}+${student.firstName}&background=random`} 
                          alt={`${student.name} ${student.firstName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 flex justify-end items-center border-t border-gray-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCV(student.id, `${student.name}_${student.firstName}`);
                      }}
                      className="text-xs bg-[#e1d3c1] text-[var(--color-vert)] px-3 py-1 rounded font-medium hover:bg-[#d6c4af] transition flex items-center"
                    >
                      <span>Télécharger CV</span>
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}