import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { getPendingEnterprises, approveEnterprise, downloadInternshipsExcel, getAllTeachers, getAllStudents, getEnterpriseInPartnership } from '../../api/adminApi';
import type { EnterpriseResponseDto } from '../../types/enterprise';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [pendingEnterprises, setPendingEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [partnerEnterprises, setPartnerEnterprises] = useState<EnterpriseResponseDto[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [enterprisesRes, partnerRes, teachersRes, studentsRes] = await Promise.all([
        getPendingEnterprises(),
        getEnterpriseInPartnership(),
        getAllTeachers(),
        getAllStudents()
      ]);
      setPendingEnterprises(enterprisesRes.data || []);
      setPartnerEnterprises(partnerRes.data || []);
      setTeachersCount(teachersRes.data?.length || 0);
      setStudentsCount(studentsRes.data?.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
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
    <div className="min-h-screen w-full bg-login-gradient">
      <AdminHeader />
      
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#e8e0d0] rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-[#2d2d2d] mb-6">Tableau de bord administrateur</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Entreprises en attente</h3>
              <p className="text-3xl font-bold text-orange-600">{pendingEnterprises.length}</p>
              <p className="text-xs text-gray-500 mt-1">En attente de validation</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Entreprises partenaires</h3>
              <p className="text-3xl font-bold text-green-600">{partnerEnterprises.length}</p>
              <p className="text-xs text-gray-500 mt-1">Approuvées</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Enseignants</h3>
              <p className="text-3xl font-bold text-blue-600">{teachersCount}</p>
              <p className="text-xs text-gray-500 mt-1">Inscrits</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Étudiants</h3>
              <p className="text-3xl font-bold text-purple-600">{studentsCount}</p>
              <p className="text-xs text-gray-500 mt-1">Inscrits</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">Répartition des entreprises</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'En attente', value: pendingEnterprises.length, color: '#f59e0b' },
                      { name: 'Approuvées', value: partnerEnterprises.length, color: '#10b981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    <Cell fill="#f59e0b" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">Utilisateurs par type</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Étudiants', count: studentsCount, color: '#8b5cf6' },
                  { name: 'Enseignants', count: teachersCount, color: '#3b82f6' },
                  { name: 'Entreprises', count: partnerEnterprises.length, color: '#10b981' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">Actions rapides</h3>
              <div className="space-y-3 mb-4">
                <button
                  onClick={handleDownloadExcel}
                  className="w-full bg-[#4c7a4c] text-white px-4 py-2 rounded hover:bg-[#6a9a6a] transition-colors"
                >
                  Télécharger rapport Excel
                </button>
                <button
                  onClick={fetchData}
                  className="w-full bg-[#6a9a6a] text-white px-4 py-2 rounded hover:bg-[#4c7a4c] transition-colors"
                >
                  Actualiser les données
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux d'approbation</span>
                  <span className="font-semibold text-green-600">
                    {pendingEnterprises.length + partnerEnterprises.length > 0 
                      ? Math.round((partnerEnterprises.length / (pendingEnterprises.length + partnerEnterprises.length)) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ratio Étudiants/Enseignants</span>
                  <span className="font-semibold text-blue-600">
                    {teachersCount > 0 ? Math.round(studentsCount / teachersCount) : 0}:1
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#2d2d2d]">Entreprises en attente de validation</h2>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">Chargement...</div>
            ) : pendingEnterprises.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucune entreprise en attente de validation
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingEnterprises.map((enterprise) => (
                    <div key={enterprise.id} className="bg-[#f5ede3] rounded-lg p-4 border border-[#d2bfa3]">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#4c7a4c] rounded-md flex items-center justify-center text-white font-bold">
                          {enterprise.name.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2d2d2d] mb-1">{enterprise.name}</h3>
                          <p className="text-xs text-gray-600 mb-1">{enterprise.email}</p>
                          <p className="text-xs text-gray-600 mb-3">{enterprise.sectorOfActivity}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(enterprise.id, true)}
                              className="bg-[#4c7a4c] text-white px-3 py-1 rounded text-xs hover:bg-[#6a9a6a] transition-colors"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleApprove(enterprise.id, false)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                            >
                              Rejeter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;