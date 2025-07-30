
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterStepper from './components/RegisterStepper';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardEtudiant from './components/DashboardEtudiant';
import DashboardEnseignant from './components/DashboardEnseignant';
import DashboardEntreprise from './components/DashboardEntreprise';
// import RoleRedirector from './components/RoleRedirector';
import ListStagesEtudiant from './components/ListStagesEtudiant';
import MonStageEtudiant from './components/MonStageEtudiant';
import Felicitations from './components/Felicitations';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route racine : redirection automatique selon le rôle */}
        <Route path="/" element={<MonStageEtudiant />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterStepper />} />

        {/* Route protégée pour les étudiants */}
        <Route element={<ProtectedRoute allowedRoles={['etudiant']} />}> 
          <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
          <Route path="/etudiant" element={<Navigate to="/dashboard-etudiant" replace />} />
          <Route path="/etudiant/stages" element={<ListStagesEtudiant />} />
          <Route path="/etudiant/monstage" element={<MonStageEtudiant />} />
        </Route>

        {/* Page de félicitations après création de compte */}
        <Route path="/felicitations" element={<Felicitations />} />

        {/* Route protégée pour les enseignants */}
        <Route element={<ProtectedRoute allowedRoles={['enseignant']} />}> 
          <Route path="/dashboard-enseignant" element={<DashboardEnseignant />} />
          <Route path="/enseignant" element={<Navigate to="/dashboard-enseignant" replace />} />
        </Route>

        {/* Route protégée pour les entreprises */}
        <Route element={<ProtectedRoute allowedRoles={['entreprise']} />}>
          <Route path="/dashboard-entreprise" element={<DashboardEntreprise />} />
          <Route path="/entreprise" element={<Navigate to="/dashboard-entreprise" replace />} />
        </Route>


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
