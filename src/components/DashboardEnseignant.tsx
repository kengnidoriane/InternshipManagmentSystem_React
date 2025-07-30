import React from 'react';

const DashboardEnseignant: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-login-gradient">
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 max-w-lg w-full mt-10">
        <h1 className="text-3xl font-bold text-[var(--color-vert)] mb-6 text-center">Bienvenue, enseignant !</h1>
        <div className="mb-6 text-center">
          <p className="text-lg text-[var(--color-jaune)] font-semibold">Résumé du profil</p>
          <ul className="text-gray-700 text-sm mt-2">
            <li><b>Nom :</b> [Nom enseignant]</li>
            <li><b>Email :</b> [Email enseignant]</li>
            <li><b>Département :</b> [Département]</li>
          </ul>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-[var(--color-vert)] mb-2">Étudiants à suivre</p>
          <ul className="list-disc pl-6 text-gray-700 text-sm">
            <li>Jean Dupont - Stage chez Orange - <span className="text-green-700">Validé</span></li>
            <li>Sarah Martin - Stage chez Total - <span className="text-yellow-700">En attente</span></li>
            <li>Alexandre Petit - Stage chez Capgemini - <span className="text-red-700">Refusé</span></li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <button className="bg-[var(--color-vert)] text-white font-semibold py-2 px-6 rounded hover:bg-[#40512d] transition-colors">Voir tous les étudiants</button>
          <button className="bg-[var(--color-jaune)] text-white font-semibold py-2 px-6 rounded hover:bg-[#a07b3d] transition-colors">Valider un stage</button>
          <button className="bg-gray-200 text-[var(--color-vert)] font-semibold py-2 px-6 rounded hover:bg-gray-300 transition-colors">Mettre à jour mon profil</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEnseignant;
