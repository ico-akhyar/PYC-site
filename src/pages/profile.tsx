import { useEffect, useRef, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { User, Mail, Phone, MapPin, Calendar, Award, Download, CheckCircle, Clock } from 'lucide-react';

type UserData = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  social?: { twitter?: string; instagram?: string; linkedin?: string; [k: string]: string | undefined };
  memberSince?: any;
  status?: "pending" | "contacted" | "accepted";
  lastCheckin?: any;
  streakCount?: number;
  previousExperience?: string;
  socialMedia?: string;
  userId?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const { currentUser } = useAuth();
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // First try to find user in members collection by userId field
      const membersQuery = query(
        collection(db, 'members'), 
        where('userId', '==', currentUser.uid)
      );
      const membersSnapshot = await getDocs(membersQuery);
      
      if (!membersSnapshot.empty) {
        const memberDoc = membersSnapshot.docs[0];
        setUser({ id: memberDoc.id, ...memberDoc.data() });
        return;
      }

      // If not found in members, try registrations collection by userId
      const registrationsQuery = query(
        collection(db, 'teamRegistrations'), 
        where('userId', '==', currentUser.uid)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);
      
      if (!registrationsSnapshot.empty) {
        const regDoc = registrationsSnapshot.docs[0];
        setUser({ id: regDoc.id, ...regDoc.data() });
        return;
      }

      // Fallback: try to find by email (for backward compatibility)
      const emailRegistrationsQuery = query(
        collection(db, 'teamRegistrations'), 
        where('email', '==', currentUser.email)
      );
      const emailRegistrationsSnapshot = await getDocs(emailRegistrationsQuery);
      
      if (!emailRegistrationsSnapshot.empty) {
        const regDoc = emailRegistrationsSnapshot.docs[0];
        setUser({ id: regDoc.id, ...regDoc.data() });
        return;
      }

      // If nothing found, create basic user object
      setUser({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        status: 'pending'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Failed to load profile data');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  function updateField<K extends keyof UserData>(field: K, value: UserData[K]) {
    setUser(prev => prev ? { ...prev, [field]: value } : prev);
  }

  async function saveProfile() {
    if (!user || !currentUser) return;
    setSaving(true);
    setMessage(null);
    try {
      // Determine which collection to update based on user status
      let docRef;
      
      if (user.status === 'accepted' && user.id) {
        // Update in members collection
        docRef = doc(db, 'members', user.id);
      } else if (user.id) {
        // Update in registrations collection
        docRef = doc(db, 'teamRegistrations', user.id);
      } else {
        // Create new registration if no ID exists
        const newDoc = await addDoc(collection(db, 'teamRegistrations'), {
          name: user.name,
          email: currentUser.email,
          phone: user.phone,
          city: user.city,
          social: user.social,
          previousExperience: user.previousExperience,
          socialMedia: user.socialMedia,
          status: 'pending',
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        setUser(prev => prev ? { ...prev, id: newDoc.id, status: 'pending' } : prev);
        setMessage("Profile saved successfully! Your registration is pending.");
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
        return;
      }
      
      await updateDoc(docRef, {
        name: user.name,
        phone: user.phone,
        city: user.city,
        social: user.social,
        previousExperience: user.previousExperience,
        socialMedia: user.socialMedia
      });
      
      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage("Failed to save profile");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  function formatDatePretty(timestamp: any) {
    if (!timestamp) return "-";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch {
      return "-";
    }
  }

  function hasCheckedInToday() {
    if (!user || !user.lastCheckin) return false;
    try {
      const lastCheckinDate = user.lastCheckin.toDate();
      const today = new Date();
      return lastCheckinDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  }

  async function doCheckin() {
    if (!user || !currentUser || user.status !== 'accepted') return;
    setCheckinLoading(true);
    setMessage(null);
    try {
      const today = new Date();
      const lastCheckinDate = user.lastCheckin ? user.lastCheckin.toDate() : null;
      
      let newStreak = user.streakCount || 0;
      
      // Check if last checkin was yesterday to continue streak
      if (lastCheckinDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCheckinDate.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastCheckinDate.toDateString() !== today.toDateString()) {
          // Reset streak if not consecutive
          newStreak = 1;
        }
      } else {
        // First checkin
        newStreak = 1;
      }
      
      // Update in Firestore - find the member document by userId
      const membersQuery = query(
        collection(db, 'members'), 
        where('userId', '==', currentUser.uid)
      );
      const membersSnapshot = await getDocs(membersQuery);
      
      if (!membersSnapshot.empty) {
        const memberDoc = membersSnapshot.docs[0];
        await updateDoc(doc(db, 'members', memberDoc.id), {
          lastCheckin: serverTimestamp(),
          streakCount: newStreak
        });
        
        // Update local state
        setUser(prev => prev ? { 
          ...prev, 
          lastCheckin: { toDate: () => today },
          streakCount: newStreak
        } : prev);
        
        setMessage("Check-in recorded. Keep up the streak!");
      } else {
        setMessage("Member record not found. Please contact admin.");
      }
    } catch (error) {
      console.error('Error recording check-in:', error);
      setMessage("Failed to record check-in");
    } finally {
      setCheckinLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function downloadCardPNG() {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${(user?.name || "member").replace(/\s+/g,"_")}-card.png`;
      a.click();
    } catch (err) {
      setMessage("Could not generate image.");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function downloadCardPDF() {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width + 40, canvas.height + 40],
      });
      pdf.addImage(imgData, "PNG", 20, 20, canvas.width, canvas.height);
      pdf.save(`${(user?.name || "member").replace(/\s+/g,"_")}-card.pdf`);
    } catch (err) {
      setMessage("Could not generate PDF.");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-l-4 border-red-500">
          <div className="bg-gradient-to-r from-red-600 to-green-600 p-6 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="opacity-90">Manage your account information and membership details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="mr-2 text-red-500" size={24} />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    value={user?.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    value={user?.email || currentUser?.email || ""}
                    readOnly
                    className="pl-10 w-full px-4 py-3 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    value={user?.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+92 300 0000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    value={user?.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience</label>
              <textarea
                value={user?.previousExperience || ""}
                onChange={(e) => updateField("previousExperience", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Any previous political or volunteer experience?"
              />
            </div>

            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="mr-2 text-red-500" size={20} />
              Social Media Profiles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Twitter</label>
                <input
                  value={user?.social?.twitter || ""}
                  onChange={(e) => updateField("social", { ...(user?.social || {}), twitter: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Instagram</label>
                <input
                  value={user?.social?.instagram || ""}
                  onChange={(e) => updateField("social", { ...(user?.social || {}), instagram: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">LinkedIn</label>
                <input
                  value={user?.social?.linkedin || ""}
                  onChange={(e) => updateField("social", { ...(user?.social || {}), linkedin: e.target.value })}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {message && <div className="text-sm text-green-600">{message}</div>}
            </div>
          </div>

          {/* Membership Card & Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2 text-green-500" size={24} />
                Membership Status
              </h2>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Current Status</div>
                <div className="mt-1 font-medium">
                  {user?.status === "accepted" ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="mr-1" size={18} />
                      Accepted Member
                    </span>
                  ) : user?.status === "contacted" ? (
                    <span className="text-blue-600">Contacted / In review</span>
                  ) : (
                    <span className="text-gray-600">Pending Registration</span>
                  )}
                </div>
              </div>

              {user?.memberSince && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Member since</div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="mr-2" size={16} />
                    {formatDatePretty(user.memberSince)}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Daily streak</div>
                    <div className="text-2xl font-bold text-red-600">{user?.streakCount || 0} days</div>
                    <div className="text-xs text-gray-500">
                      Last check-in: {user?.lastCheckin ? formatDatePretty(user.lastCheckin) : "Never"}
                    </div>
                  </div>

                  <button
                    onClick={doCheckin}
                    disabled={hasCheckedInToday() || checkinLoading || user?.status !== 'accepted'}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      hasCheckedInToday() || user?.status !== 'accepted' 
                        ? "bg-gray-300 text-gray-500" 
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    <Clock className="mr-2" size={16} />
                    {checkinLoading ? "Checking..." : hasCheckedInToday() ? "Checked In" : "Check In"}
                  </button>
                </div>
              </div>
            </div>

            {user?.status === "accepted" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Download className="mr-2 text-blue-500" size={24} />
                  Membership Card
                </h2>

                <div ref={cardRef} className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-green-500 text-white mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <User className="text-red-500" size={32} />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Pakistan Youth Council</div>
                      <div className="text-xl font-bold">{user?.name}</div>
                      <div className="text-xs opacity-80">
                        Member since: {formatDatePretty(user.memberSince)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={downloadCardPNG} 
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Download className="mr-2" size={16} />
                    PNG
                  </button>
                  <button 
                    onClick={downloadCardPDF} 
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Download className="mr-2" size={16} />
                    PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}