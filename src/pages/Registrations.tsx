// Updated Registrations.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Users, CheckCircle, ArrowLeft, UserCheck } from 'lucide-react';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  previousExperience?: string;
  socialMedia?: string;
  status: 'pending' | 'contacted' | 'accepted';
  userId?: string; // Add userId field to store Firebase Auth UID
}

const Registrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to find user by email and get their UID
  const findUserByEmail = async (email: string): Promise<string | null> => {
    try {
      // This would typically involve calling your backend or Firebase Admin SDK
      // For now, we'll assume the user ID is stored in the registration or we'll need to implement this properly
      console.log('Looking for user with email:', email);
      return null; // Placeholder - you'll need to implement this properly
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  };

  const createMember = async (registrationData: Registration, userId: string) => {
    try {
      await addDoc(collection(db, 'members'), {
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        city: registrationData.city,
        previousExperience: registrationData.previousExperience || '',
        socialMedia: registrationData.socialMedia || '',
        status: 'accepted',
        memberSince: serverTimestamp(),
        streakCount: 0,
        lastCheckin: null,
        createdAt: serverTimestamp(),
        userId: userId // Store the Firebase Auth UID
      });
    } catch (error) {
      console.error('Error creating member:', error);
      alert('Failed to create member record');
    }
  };

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

  const acceptUser = async (id: string, registrationData: Registration) => {
    try {
      // First try to find the user by email to get their UID
      const userId = await findUserByEmail(registrationData.email);
      
      if (!userId) {
        alert('Could not find user account. Please ensure the user has signed up first.');
        return;
      }

      // Update registration status
      await updateDoc(doc(db, 'teamRegistrations', id), { 
        status: 'accepted',
        userId: userId 
      });
      
      // Create member record with the user's actual UID
      await createMember(registrationData, userId);
      
      // Update local state
      setRegistrations(prev =>
        prev.map(r => (r.id === id ? { ...r, status: 'accepted', userId } : r))
      );
      
      alert('User accepted and member record created!');
    } catch (error) {
      console.error('Error accepting user:', error);
      alert('Failed to accept user');
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
                    ? 'bg-blue-50 border-2 border-blue-400'
                    : reg.status === 'accepted'
                    ? 'bg-green-50 border-2 border-green-400'
                    : 'bg-gray-50 border-2 border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className={
                      reg.status === 'accepted' ? 'text-green-600' : 
                      reg.status === 'contacted' ? 'text-blue-600' : 'text-gray-500'
                    } size={20} />
                    <h3 className="text-lg font-bold text-gray-800">{reg.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reg.status === 'contacted' || reg.status === 'accepted'}
                        onChange={() => {
                          if (reg.status === 'pending') {
                            toggleStatus(reg.id, reg.status);
                          } else if (reg.status === 'contacted') {
                            toggleStatus(reg.id, reg.status);
                          }
                        }}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        disabled={reg.status === 'accepted'}
                      />
                      <span className="text-sm text-gray-600">Contacted</span>
                    </label>
                    {reg.status === 'contacted' && (
                      <button
                        onClick={() => acceptUser(reg.id, reg)}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
                        title="Accept User"
                      >
                        <UserCheck size={16} className="mr-1" />
                        Accept
                      </button>
                    )}
                  </div>
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
                    className={
                      reg.status === 'accepted' ? 'text-green-600' : 
                      reg.status === 'contacted' ? 'text-blue-600' : 'text-gray-400'
                    } 
                  />
                  <span className={
                    reg.status === 'accepted' ? 'text-green-700 font-medium' : 
                    reg.status === 'contacted' ? 'text-blue-700 font-medium' : 'text-gray-600'
                  }>
                    {reg.status === 'accepted' ? 'Accepted Member' : 
                     reg.status === 'contacted' ? 'Contacted - Pending Acceptance' : 'Pending - Not Contacted Yet'}
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