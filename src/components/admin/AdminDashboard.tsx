import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { getPendingEnterprises, approveEnterprise, downloadInternshipsExcel, getAllTeachers, getAllStudents } from '../../api/adminApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';

const AdminDashboard: React.FC = () => {
  const [pendingEnterprises, setPendingEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enterprisesRes, teachersRes, studentsRes] = await Promise.all([
        getPendingEnterprises(),
        getAllTeachers(),
        getAllStudents()
      ]);
      setPendingEnterprises(enterprisesRes.data);
      setTeachersCount(teachersRes.data.length);
      setStudentsCount(studentsRes.data.length);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleApprove = async (enterpriseId: number, approved: boolean) => {
    try {
      await approveEnterprise(enterpriseId, approved);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await downloadInternshipsExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `internships-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Entreprises en attente</h3>
            <p className="text-3xl font-bold text-orange-600">{pendingEnterprises.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Enseignants</h3>
            <p className="text-3xl font-bold text-blue-600">{teachersCount}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Étudiants</h3>
            <p className="text-3xl font-bold text-green-600">{studentsCount}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Actions rapides</h3>
            <button
              onClick={handleDownloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Télécharger rapport Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Entreprises en attente de validation</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Chargement...</div>
          ) : pendingEnterprises.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Aucune entreprise en attente de validation
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Entreprise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Secteur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingEnterprises.map((enterprise) => (
                    <tr key={enterprise.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{enterprise.name}</div>
                        <div className="text-sm text-gray-500">{enterprise.matriculation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enterprise.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enterprise.sectorOfActivity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleApprove(enterprise.id, true)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => handleApprove(enterprise.id, false)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Rejeter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;