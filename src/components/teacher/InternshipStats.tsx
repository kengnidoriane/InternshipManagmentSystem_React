import React, { useState, useEffect } from 'react';
import { getInternshipStats } from '../../api/teacherApi';
import TeacherHeader from '../TeacherHeader';

interface InternshipStat {
  department: string;
  count: number;
}

const InternshipStats: React.FC = () => {
  const [stats, setStats] = useState<InternshipStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getInternshipStats();
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-login-gradient">
      <TeacherHeader />
      
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-[var(--color-jaune)] mb-6">
          Statistiques des stages par département
        </h1>
        
        {loading ? (
          <div className="text-center text-white">Chargement...</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.department} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{stat.department}</h3>
                  <p className="text-2xl font-bold text-blue-600">{stat.count} stages</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipStats;