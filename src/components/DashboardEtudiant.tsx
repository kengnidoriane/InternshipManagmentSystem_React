import React from 'react';

const DashboardEtudiant: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-login-gradient">
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 max-w-lg w-full mt-10">
        <h1 className="text-3xl font-bold text-[#58693e] mb-6 text-center">Bienvenue, étudiant !</h1>
        <div className="mb-6 text-center">
          <p className="text-lg text-[#B79056] font-semibold">Résumé de votre profil</p>
          <ul className="text-gray-700 text-sm mt-2">
            <li><b>Nom :</b> [Nom étudiant]</li>
            <li><b>Email :</b> [Email étudiant]</li>
            <li><b>Département :</b> [Département]</li>
          </ul>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-[#58693e] mb-2">Mes derniers stages</p>
          <table className="w-full text-left text-sm border">
            <thead>
              <tr className="bg-[#e1d3c1]">
                <th className="px-2 py-1">Entreprise</th>
                <th className="px-2 py-1">Sujet</th>
                <th className="px-2 py-1">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Sopra Steria</td>
                <td className="px-2 py-1">Développement React</td>
                <td className="px-2 py-1 text-green-700">Validé</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Capgemini</td>
                <td className="px-2 py-1">Data Science</td>
                <td className="px-2 py-1 text-yellow-700">En attente</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <button className="bg-[#B79056] text-white font-semibold py-2 px-6 rounded hover:bg-[#a07b3d] transition-colors">Voir tous mes stages</button>
          <button className="bg-[#58693e] text-white font-semibold py-2 px-6 rounded hover:bg-[#40512d] transition-colors">Candidater à un stage</button>
          <button className="bg-gray-200 text-[#58693e] font-semibold py-2 px-6 rounded hover:bg-gray-300 transition-colors">Mettre à jour mon profil</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtudiant;
