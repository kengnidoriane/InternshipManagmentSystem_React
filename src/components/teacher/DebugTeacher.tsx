import React, { useState, useEffect } from 'react';
import { getOffersToReviewByDepartment, getEnterpriseInPartnership, getStudentsByDepartment } from '../../api/teacherApi';

const DebugTeacher: React.FC = () => {
  const [debug, setDebug] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        setLoading(true);
        
        // Test des 3 endpoints principaux
        const [offersRes, enterprisesRes, studentsRes] = await Promise.allSettled([
          getOffersToReviewByDepartment(),
          getEnterpriseInPartnership(),
          getStudentsByDepartment()
        ]);

        setDebug({
          offers: offersRes.status === 'fulfilled' ? offersRes.value.data : offersRes.reason,
          enterprises: enterprisesRes.status === 'fulfilled' ? enterprisesRes.value.data : enterprisesRes.reason,
          students: studentsRes.status === 'fulfilled' ? studentsRes.value.data : studentsRes.reason,
        });
      } catch (error) {
        console.error('Debug error:', error);
        setDebug({ error: error });
      } finally {
        setLoading(false);
      }
    };

    fetchDebugData();
  }, []);

  if (loading) {
    return <div className="p-8 bg-white">Chargement debug...</div>;
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Enseignant</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Offres à réviser:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debug.offers, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Entreprises partenaires:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debug.enterprises, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Étudiants du département:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debug.students, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugTeacher;