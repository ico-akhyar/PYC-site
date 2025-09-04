// Updated Registrations.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Users, CheckCircle, ArrowLeft } from 'lucide-react';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  previousExperience?: string;
  socialMedia?: string;
  status: 'pending' | 'contacted';
}

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'teamRegistrations'));
      const data: Registration[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Registration)
      }));
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading registrations:', error);
      alert('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'pending' ? 'contacted' : 'pending';
    try {
      await updateDoc(doc(db, 'teamRegistrations', id), { status: newStatus });
      setRegistrations(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus as 'pending' | 'contacted' } : r))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Team Registrations
            </h1>
            <p className="text-gray-600 mt-2">Admin Access Required - Manage team registrations</p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <p className="mt-2 text-gray-600">Loading registrations...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-gray-100">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Registrations Yet</h3>
            <p className="text-gray-500">No one has registered to join the team yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map(reg => (
              <div
                key={reg.id}
                className={`p-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                  reg.status === 'contacted'
                    ? 'bg-gray-100 border-2 border-gray-300' // Grey for contacted
                    : 'bg-green-50 border-2 border-green-400' // Green for pending (not contacted yet)
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className={reg.status === 'contacted' ? 'text-gray-500' : 'text-green-600'} size={20} />
                    <h3 className="text-lg font-bold text-gray-800">{reg.name}</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reg.status === 'contacted'}
                      onChange={() => toggleStatus(reg.id, reg.status)}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-600">Contacted</span>
                  </label>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700"><span className="font-semibold">Email:</span> {reg.email}</p>
                  <p className="text-gray-700"><span className="font-semibold">Phone:</span> {reg.phone}</p>
                  <p className="text-gray-700"><span className="font-semibold">City:</span> {reg.city}</p>
                  
                  {reg.previousExperience && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Experience:</span> {reg.previousExperience}
                    </p>
                  )}
                  
                  {reg.socialMedia && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Social Media:</span> {reg.socialMedia}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <CheckCircle 
                    size={16} 
                    className={reg.status === 'contacted' ? 'text-green-600' : 'text-gray-400'} 
                  />
                  <span className={reg.status === 'contacted' ? 'text-green-700 font-medium' : 'text-gray-600'}>
                    {reg.status === 'contacted' ? 'Contacted' : 'Pending - Not Contacted Yet'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrations;