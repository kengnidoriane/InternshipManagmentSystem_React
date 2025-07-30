import React from 'react';

const DashboardEntreprise: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-login-gradient">
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 max-w-lg w-full mt-10">
        <h1 className="text-3xl font-bold text-[var(--color-jaune)] mb-6 text-center">Bienvenue, entreprise !</h1>
        <div className="mb-6 text-center">
          <p className="text-lg text-[var(--color-vert)] font-semibold">Résumé de l'entreprise</p>
          <ul className="text-gray-700 text-sm mt-2">
            <li><b>Nom :</b> [Nom entreprise]</li>
            <li><b>Email :</b> [Email entreprise]</li>
            <li><b>Secteur :</b> [Secteur]</li>
          </ul>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-[var(--color-jaune)] mb-2">Mes offres récentes</p>
          <table className="w-full text-left text-sm border">
            <thead>
              <tr className="bg-[#e1d3c1]">
                <th className="px-2 py-1">Intitulé</th>
                <th className="px-2 py-1">Candidats</th>
                <th className="px-2 py-1">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Stage Dev Fullstack</td>
                <td className="px-2 py-1">4</td>
                <td className="px-2 py-1 text-green-700">Ouvert</td>
              </tr>
              <tr>
                <td className="px-2 py-1">Stage Marketing</td>
                <td className="px-2 py-1">2</td>
                <td className="px-2 py-1 text-red-700">Fermé</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <button className="bg-[var(--color-jaune)] text-white font-semibold py-2 px-6 rounded hover:bg-[#a07b3d] transition-colors">Créer une nouvelle offre</button>
          <button className="bg-[var(--color-vert)] text-white font-semibold py-2 px-6 rounded hover:bg-[#40512d] transition-colors">Voir toutes les candidatures</button>
          <button className="bg-gray-200 text-[var(--color-jaune)] font-semibold py-2 px-6 rounded hover:bg-gray-300 transition-colors">Mettre à jour le profil</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEntreprise;
