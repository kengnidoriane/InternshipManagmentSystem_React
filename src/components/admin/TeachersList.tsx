import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from './AdminHeader';
import { getTeachersPagination } from '../../api/adminApi';

interface Teacher {
  id: number;
  name: string;
  firstName: string;
  email: string;
  department: string;
}

export default function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, [currentPage]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getTeachersPagination(currentPage, pageSize);
      const data = response.data;
      setTeachers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherClick = (teacherId: number) => {
    navigate(`/admin/teachers/${teacherId}`);
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
            Liste des enseignants ({totalElements})
          </h1>
          
          {loading ? (
            <div className="flex justify-center py-8">Chargement...</div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Aucun enseignant trouvé.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <motion.div 
                  key={teacher.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleTeacherClick(teacher.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-dark)]">
                          Enseignant
                        </h3>
                        <p className="text-sm text-gray-600">{teacher.name} {teacher.firstName}</p>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                        <p className="text-xs text-blue-600 font-medium">{teacher.department}</p>
                      </div>
                      <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(teacher.name, teacher.firstName)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Précédent
              </button>
              
              <span className="px-3 py-1">
                Page {currentPage + 1} sur {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}