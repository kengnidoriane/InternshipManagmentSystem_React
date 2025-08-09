
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardEntreprise from './components/DashboardEntreprise';
import DashboardEnseignant from './components/DashboardEnseignant';
import CreerOffreEntreprise from './components/CreerOffreEntreprise';
import ListeOffresEntreprise from './components/ListeOffresEntreprise';
import LoginPage from './components/LoginPage';
import RegisterStepper from './components/RegisterStepper';
import RegisterSuccess from './components/RegisterSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import StageDetail from './components/StageDetail';

import ListStagesEtudiant from './components/ListStagesEtudiant';
import MonStageEtudiant from './components/MonStageEtudiant';
import Felicitations from './components/Felicitations';
// Les dashboards spécifiques n'existent pas, routes simplifiées


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route racine : redirection automatique selon le rôle */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterStepper />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/stage/:id" element={<StageDetail />} />

        {/* Route protégée pour les étudiants */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}> 
          <Route path="/etudiant/stages" element={<ListStagesEtudiant />} />
          <Route path="/dashboard-etudiant" element={<MonStageEtudiant />} />
        </Route>

        {/* Page de félicitations après création de compte */}
        <Route path="/felicitations" element={<Felicitations />} />

        {/* Routes enseignant (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route path="/enseignant/offres" element={<DashboardEnseignant />} />
          {/* Ajoute ici d'autres routes enseignant si besoin */}
        </Route>

        {/* Routes entreprises (protégées) */}
        <Route element={<ProtectedRoute allowedRoles={['ENTERPRISE']} />}>
          <Route path="/entreprise/dashboard" element={<DashboardEntreprise />} />
          <Route path="/entreprise/offres" element={<ListeOffresEntreprise />} />
          <Route path="/entreprise/creer-offre" element={<CreerOffreEntreprise />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
