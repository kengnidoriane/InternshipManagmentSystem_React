
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OffersList from './components/teacher/OffersList';
import EntreprisesList from './components/teacher/EntreprisesList';
import EnterpriseDetail from './components/teacher/EnterpriseDetail';
import StudentsList from './components/teacher/StudentsList';
import StudentDetail from './components/teacher/StudentDetail';
import CreerOffreEntreprise from './components/CreerOffreEntreprise';
import ListeOffresEntreprise from './components/ListeOffresEntreprise';
import OfferDetail from './components/OfferDetail';
import CandidaturesEntreprise from './components/CandidaturesEntreprise';
import DetailCandidature from './components/DetailCandidature';
import ProfilEntreprise from './components/ProfilEntreprise';
import TeacherOfferDetail from './components/teacher/OfferDetail';
import LoginPage from './components/LoginPage';
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

import ListStagesEtudiant from './components/ListStagesEtudiant';
import MonStageEtudiant from './components/MonStageEtudiant';
import MonProfil from './components/etudiant/MonProfil';
import Felicitations from './components/Felicitations';
// Les dashboards spécifiques n'existent pas, routes simplifiées


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route racine : redirection automatique selon le rôle */}
        <Route path="/" element={<RoleRedirector />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterStepper />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/stage/:id" element={<StageDetail />} />

        {/* Route protégée pour les étudiants */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}> 
          <Route path="/etudiant/stages" element={<ListStagesEtudiant />} />
          <Route path="/etudiant/mon-stage" element={<MonStageEtudiant />} />
          <Route path="/etudiant/profil" element={<MonProfil />} />
          <Route path="/etudiant/parametres" element={<UserSettings />} />
        </Route>

        {/* Page de félicitations après création de compte */}
        <Route path="/felicitations" element={<Felicitations />} />

        {/* Routes enseignant (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']} />}>
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
    </Router>
  );
};

export default App;
