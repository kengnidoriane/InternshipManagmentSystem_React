
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import OffersList from './components/teacher/OffersList';
import EntreprisesList from './components/teacher/EntreprisesList';
import EnterpriseDetail from './components/teacher/EnterpriseDetail';
import StudentsList from './components/teacher/StudentsList';
import StudentDetail from './components/teacher/StudentDetail';
import CreerOffreEntreprise from './components/entreprise/CreerOffreEntreprise';
import ListeOffresEntreprise from './components/entreprise/ListeOffresEntreprise';
import OfferDetail from './components/OfferDetail';
import CandidaturesEntreprise from './components/entreprise/CandidaturesEntreprise';
import DetailCandidature from './components/entreprise/DetailCandidature';
import ProfilEntreprise from './components/ProfilEntreprise';
import TeacherOfferDetail from './components/teacher/OfferDetail';
import DebugTeacher from './components/teacher/DebugTeacher';
import LoginPage from './components/LoginPage';
import ResetPassword from './components/ResetPassword';
import RegisterStepper from './components/RegisterStepper';
import RegisterSuccess from './components/RegisterSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import StageDetail from './components/StageDetail';
import RoleRedirector from './components/RoleRedirector';
import UserSettings from './components/UserSettings';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEnterprisesList from './components/admin/EnterprisesList';
import AdminEnterpriseDetail from './components/admin/EnterpriseDetail';
import AdminTeachersList from './components/admin/TeachersList';
import AdminTeacherDetail from './components/admin/TeacherDetail';
import AdminStudentsList from './components/admin/StudentsList';
import AdminStudentDetail from './components/admin/StudentDetail';

import ListStagesEtudiant from './components/etudiant/ListStagesEtudiant';
import MonStageEtudiant from './components/etudiant/MonStageEtudiant';
import MonProfil from './components/etudiant/MonProfil';
import Felicitations from './components/Felicitations';
// Les dashboards spécifiques n'existent pas, routes simplifiées


const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><RoleRedirector /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterStepper /></PageWrapper>} />
        <Route path="/register-success" element={<PageWrapper><RegisterSuccess /></PageWrapper>} />
        <Route path="/stage/:id" element={<PageWrapper><StageDetail /></PageWrapper>} />

        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}> 
          <Route path="/etudiant/stages" element={<PageWrapper><ListStagesEtudiant /></PageWrapper>} />
          <Route path="/etudiant/mon-stage" element={<PageWrapper><MonStageEtudiant /></PageWrapper>} />
          <Route path="/etudiant/profil" element={<PageWrapper><MonProfil /></PageWrapper>} />
          <Route path="/etudiant/parametres" element={<PageWrapper><UserSettings /></PageWrapper>} />
        </Route>

        <Route path="/felicitations" element={<PageWrapper><Felicitations /></PageWrapper>} />

        <Route element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']} />}>
          <Route path="/enseignant/debug" element={<DebugTeacher />} />
          <Route path="/enseignant/offres" element={<OffersList />} />
          <Route path="/enseignant/offres/:id" element={<TeacherOfferDetail />} />
          <Route path="/enseignant/entreprises" element={<EntreprisesList />} />
          <Route path="/enseignant/entreprises/:id" element={<EnterpriseDetail />} />
          <Route path="/enseignant/etudiants" element={<StudentsList />} />
          <Route path="/enseignant/etudiants/:id" element={<StudentDetail />} />
          <Route path="/enseignant/parametres" element={<UserSettings />} />
        </Route>

        {/* Routes entreprises (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['ENTERPRISE', 'ADMIN']} />}>
          <Route path="/entreprise/candidatures" element={<CandidaturesEntreprise />} />
          <Route path="/entreprise/candidatures/:applicationId" element={<DetailCandidature />} />
          <Route path="/entreprise/offres" element={<ListeOffresEntreprise />} />
          <Route path="/entreprise/offres/:id" element={<OfferDetail />} />
          <Route path="/entreprise/creer-offre" element={<CreerOffreEntreprise />} />
          <Route path="/entreprise/offres/:id/edit" element={<CreerOffreEntreprise />} />
          <Route path="/entreprise/profil" element={<ProfilEntreprise />} />
          <Route path="/entreprise/parametres" element={<UserSettings />} />
        </Route>

        {/* Routes admin (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/enterprises" element={<AdminEnterprisesList />} />
          <Route path="/admin/enterprises/:id" element={<AdminEnterpriseDetail />} />
          <Route path="/admin/teachers" element={<AdminTeachersList />} />
          <Route path="/admin/teachers/:id" element={<AdminTeacherDetail />} />
          <Route path="/admin/students" element={<AdminStudentsList />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/offres" element={<OffersList />} />
          <Route path="/admin/offres/:id" element={<TeacherOfferDetail />} />
          <Route path="/admin/settings" element={<UserSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
