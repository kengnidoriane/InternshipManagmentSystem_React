
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardEntreprise from './components/DashboardEntreprise';
import DashboardEnseignant from './components/DashboardEnseignant';
import OffersList from './components/teacher/OffersList';
import OfferDetail from './components/teacher/OfferDetail';
import EntreprisesList from './components/teacher/EntreprisesList';
import EnterpriseDetail from './components/teacher/EnterpriseDetail';
import StudentsList from './components/teacher/StudentsList';
import StudentDetail from './components/teacher/StudentDetail';
import CreerOffreEntreprise from './components/CreerOffreEntreprise';
import ListeOffresEntreprise from './components/ListeOffresEntreprise';
import LoginPage from './components/LoginPage';
import RegisterStepper from './components/RegisterStepper';
import RegisterSuccess from './components/RegisterSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import StageDetail from './components/StageDetail';
import RoleRedirector from './components/RoleRedirector';
import UserSettings from './components/UserSettings';

import ListStagesEtudiant from './components/ListStagesEtudiant';
import MonStageEtudiant from './components/MonStageEtudiant';
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
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}> 
          <Route path="/etudiant/stages" element={<ListStagesEtudiant />} />
          <Route path="/etudiant/mon-stage" element={<MonStageEtudiant />} />
          <Route path="/etudiant/parametres" element={<UserSettings />} />
        </Route>

        {/* Page de félicitations après création de compte */}
        <Route path="/felicitations" element={<Felicitations />} />

        {/* Routes enseignant (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          {/* <Route path="/enseignant/offres" element={<DashboardEnseignant />} /> */}
          <Route path="/teacher/offers" element={<OffersList />} />
          <Route path="/teacher/offers/:id" element={<OfferDetail />} />
          <Route path="/enseignant/entreprises" element={<EntreprisesList />} />
          <Route path="/enseignant/entreprises/:id" element={<EnterpriseDetail />} />
          <Route path="/enseignant/etudiants" element={<StudentsList />} />
          <Route path="/enseignant/etudiants/:id" element={<StudentDetail />} />
          <Route path="/enseignant/parametres" element={<UserSettings />} />
        </Route>

        {/* Routes entreprises (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['ENTERPRISE']} />}>
          <Route path="/entreprise/candidatures" element={<DashboardEntreprise />} />
          <Route path="/entreprise/offres" element={<ListeOffresEntreprise />} />
          {/* <Route path="/entreprise/creer-offre" element={<CreerOffreEntreprise />} /> */}
          <Route path="/entreprise/parametres" element={<UserSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
