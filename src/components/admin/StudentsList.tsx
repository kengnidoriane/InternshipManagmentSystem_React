import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from './AdminHeader';
import { getAllStudents } from '../../api/adminStudentApi';
import type { StudentResponseDto } from '../../types/student';



export default function StudentsList() {
  const [students, setStudents] = useState<StudentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
      setLoading(false);
    }
  };

  const handleStudentClick = (studentId: number) => {
    navigate(`/admin/students/${studentId}`);
  };

  const getInitials = (name: string, firstName: string) => {
    return `${firstName.charAt(0)}${name.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-login-gradient">
      <AdminHeader />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-[var(--color-dark)] mb-6">
            Liste des étudiants ({students.length})
          </h1>
          
          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Aucun étudiant trouvé.</div>
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
                  onClick={() => handleStudentClick(student.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-dark)]">
                          Étudiant
                        </h3>
                        <p className="text-sm text-gray-600">{student.name} {student.firstName}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                        <p className="text-xs text-blue-600 font-medium">{student.department}</p>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            student.onInternship 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.onInternship ? 'En stage' : 'Disponible'}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(student.name, student.firstName)}
                      </div>
                    </div>
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