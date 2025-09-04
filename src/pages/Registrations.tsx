import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Users, CheckCircle } from 'lucide-react';

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
    const snapshot = await getDocs(collection(db, 'teamRegistrations'));
    const data: Registration[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Registration)
    }));
    setRegistrations(data);
    setLoading(false);
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'pending' ? 'contacted' : 'pending';
    await updateDoc(doc(db, 'teamRegistrations', id), { status: newStatus });
    setRegistrations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus as 'pending' | 'contacted' } : r))
    );
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Team Registrations
          </h1>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading registrations...</p>
        ) : registrations.length === 0 ? (
          <p className="text-center text-gray-500">No registrations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map(reg => (
              <div
                key={reg.id}
                className={`p-6 rounded-xl shadow-lg border-2 transition-all ${
                  reg.status === 'contacted'
                    ? 'bg-gray-100 border-gray-300'
                    : 'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="text-red-500" />
                    <h3 className="text-lg font-bold">{reg.name}</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reg.status === 'contacted'}
                      onChange={() => toggleStatus(reg.id, reg.status)}
                    />
                    <span className="text-sm text-gray-600">Contacted</span>
                  </label>
                </div>
                <p className="text-sm text-gray-700"><b>Email:</b> {reg.email}</p>
                <p className="text-sm text-gray-700"><b>Phone:</b> {reg.phone}</p>
                <p className="text-sm text-gray-700"><b>City:</b> {reg.city}</p>
                {reg.previousExperience && <p className="text-sm text-gray-700"><b>Exp:</b> {reg.previousExperience}</p>}
                {reg.socialMedia && <p className="text-sm text-gray-700"><b>Social:</b> {reg.socialMedia}</p>}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <CheckCircle size={14} className={reg.status === 'contacted' ? 'text-green-600' : 'text-gray-400'} />
                  {reg.status === 'contacted' ? 'Contacted' : 'Pending'}
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
