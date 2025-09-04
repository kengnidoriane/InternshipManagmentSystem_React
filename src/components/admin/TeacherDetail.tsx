import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from './AdminHeader';
import ConfirmationModal from './ConfirmationModal';
import { getAllStudents } from '../../api/adminApi';
import type { StudentResponseDto } from '../../types/student';

interface Teacher {
  id: number;
  name: string;
  firstName: string;
  email: string;
  department: string;
}

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<StudentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // TODO: Remplacer par l'API réelle
    setTimeout(() => {
      const mockTeacher = {
        id: parseInt(id!),
        name: 'Dupont',
        firstName: 'Jean',
        email: 'jean.dupont@univ.fr',
        department: 'Informatique'
      };
      setTeacher(mockTeacher);
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (teacher) {
      fetchStudents();
    }
  }, [teacher]);

  const fetchStudents = async () => {
    if (!teacher) return;
    setStudentsLoading(true);
    try {
      const response = await getAllStudents();
      const departmentStudents = response.data.filter(
        (student: StudentResponseDto) => student.department === teacher.department
      );
      setStudents(departmentStudents);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const getInitials = (name: string, firstName: string) => {
    return `${firstName.charAt(0)}${name.charAt(0)}`.toUpperCase();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: Implémenter la suppression
    console.log('Suppression du compte enseignant:', teacher?.id);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-login-gradient">
        <AdminHeader />
        <div className="container mx-auto p-6">
          <div className="text-center py-8">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-login-gradient">
        <AdminHeader />
        <div className="container mx-auto p-6">
          <div className="text-center py-8">Enseignant non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-login-gradient">
      <AdminHeader />
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/admin/teachers')}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Retour à la liste
        </button>

        {/* Détails de l'enseignant */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {getInitials(teacher.name, teacher.firstName)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{teacher.firstName} {teacher.name}</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Email:</strong> {teacher.email}</div>
                <div><strong>Département:</strong> {teacher.department}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des étudiants du département */}
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-dark)] mb-6">
            Étudiants du département {teacher.department} ({students.length})
          </h2>
          
          {studentsLoading ? (
            <div className="flex justify-center py-8">Chargement des étudiants...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Aucun étudiant dans ce département.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <motion.div 
                  key={student.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4">
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-dark)]">
                          Étudiant
                          {student.onInternship && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              En stage
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{student.name} {student.firstName}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
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

        {/* Zone de danger */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h2>
          <p className="text-gray-600 mb-4">
            La suppression du compte enseignant est irréversible. Toutes les données associées seront perdues.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Supprimer le compte
          </button>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer le compte enseignant"
        message="Êtes-vous sûr de vouloir supprimer ce compte enseignant ? Cette action est irréversible."
        type="danger"
      />
    </div>
  );
}