import { useEffect, useRef, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { User, Mail, Phone, MapPin, Calendar, Award, Download, CheckCircle, Clock, Save } from 'lucide-react';

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
  const [userDocId, setUserDocId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const membersQuery = query(
        collection(db, 'members'), 
        where('userId', '==', currentUser.uid)
      );
      const membersSnapshot = await getDocs(membersQuery);
      
      if (!membersSnapshot.empty) {
        const memberDoc = membersSnapshot.docs[0];
        const memberData = memberDoc.data();
        setUserDocId(memberDoc.id);
        setUser({ 
          id: memberDoc.id, 
          ...memberData,
          social: typeof memberData.social === 'object' ? memberData.social : {}
        });
        setLoading(false);
        return;
      }

      const registrationsQuery = query(
        collection(db, 'teamRegistrations'), 
        where('userId', '==', currentUser.uid)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);
      
      if (!registrationsSnapshot.empty) {
        const regDoc = registrationsSnapshot.docs[0];
        const regData = regDoc.data();
        setUserDocId(regDoc.id);
        setUser({ 
          id: regDoc.id, 
          ...regData,
          social: typeof regData.social === 'object' ? regData.social : {}
        });
        setLoading(false);
        return;
      }

      const emailRegistrationsQuery = query(
        collection(db, 'teamRegistrations'), 
        where('email', '==', currentUser.email)
      );
      const emailRegistrationsSnapshot = await getDocs(emailRegistrationsQuery);
      
      if (!emailRegistrationsSnapshot.empty) {
        const regDoc = emailRegistrationsSnapshot.docs[0];
        const regData = regDoc.data();
        setUserDocId(regDoc.id);
        setUser({ 
          id: regDoc.id, 
          ...regData,
          social: typeof regData.social === 'object' ? regData.social : {}
        });
        setLoading(false);
        return;
      }

      setUser({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        status: 'pending',
        social: {}
      });
      setUserDocId(null);
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

  function updateSocialField(field: string, value: string) {
    setUser(prev => prev ? { 
      ...prev, 
      social: { ...(prev.social || {}), [field]: value } 
    } : prev);
  }

  async function saveProfile() {
    if (!user || !currentUser) return;
    setSaving(true);
    setMessage(null);
    try {
      let docRef;
      let collectionName;
      
      if (user.status === 'accepted' && userDocId) {
        collectionName = 'members';
        docRef = doc(db, 'members', userDocId);
      } else if (userDocId) {
        collectionName = 'teamRegistrations';
        docRef = doc(db, 'teamRegistrations', userDocId);
      } else {
        const newDoc = await addDoc(collection(db, 'teamRegistrations'), {
          name: user.name,
          email: currentUser.email,
          phone: user.phone,
          city: user.city,
          social: user.social || {},
          previousExperience: user.previousExperience,
          socialMedia: user.socialMedia,
          status: 'pending',
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        setUserDocId(newDoc.id);
        setUser(prev => prev ? { ...prev, id: newDoc.id, status: 'pending' } : prev);
        setMessage("Profile saved successfully! Your registration is pending.");
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Document not found in ${collectionName} collection`);
      }

      await updateDoc(docRef, {
        name: user.name,
        phone: user.phone,
        city: user.city,
        social: user.social || {},
        previousExperience: user.previousExperience,
        socialMedia: user.socialMedia,
        updatedAt: serverTimestamp()
      });
      
      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  function formatDatePretty(timestamp: any) {
    if (!timestamp) return "-";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "-";
    }
  }

  function hasCheckedInToday() {
    if (!user || !user.lastCheckin) return false;
    try {
      const lastCheckinDate = new Date(user.lastCheckin);
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
      let lastCheckinDate: Date | null = null;
      
      if (user.lastCheckin) {
        lastCheckinDate = new Date(user.lastCheckin);
      }
      
      let newStreak = user.streakCount || 0;
      if (lastCheckinDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCheckinDate.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastCheckinDate.toDateString() !== today.toDateString()) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      
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
        
        setUser(prev => prev ? { 
            ...prev, 
            lastCheckin: new Date(),   
            streakCount: newStreak
          } : prev);
        setMessage("Check-in recorded. Keep up the streak!");
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
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2,
        backgroundColor: null
      });
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
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2,
        backgroundColor: null
      });
      const imgData = canvas.toDataURL("image/png");
  
      const mmToPt = (mm: number) => (mm * 72) / 25.4;
      const cardWidth = mmToPt(85.60);
      const cardHeight = mmToPt(53.98);
  
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [cardWidth, cardHeight],
      });
  
      pdf.addImage(imgData, "PNG", 0, 0, cardWidth, cardHeight);
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-l-4 border-red-500">
          <div className="bg-gradient-to-r from-red-600 to-green-600 p-6 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="opacity-90">Manage your account information and membership details</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <User className="mr-2 text-red-500" size={24} />
            Personal Information
          </h2>
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                value={user?.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Your full name"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                value={user?.email || currentUser?.email || ""}
                readOnly
                className="w-full px-4 py-3 border rounded-lg bg-gray-50"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                value={user?.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="+92 300 0000000"
              />
            </div>
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                value={user?.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Your city"
              />
            </div>
          </div>

          {/* Save */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        </div>

        {/* Membership Card Section */}
        {user?.status === "accepted" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Download className="mr-2 text-blue-500" size={24} />
              Digital Membership Card
            </h2>

            {/* Card Preview */}
            <div
              ref={cardRef}
              className="relative mx-auto"
              style={{
                width: "1300px",
                height: "820px",
                backgroundImage: "url('/assets/card_template.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "50px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                padding: "40px",
              }}
            >
              {/* Top */}
              <div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "32.8px", color: "#c9966b" }}>
                  Pakistan Youth Council
                </div>
                <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "43.5px", fontWeight: 700, color: "#ffc99c" }}>
                  {user?.name}
                </div>
                <div style={{ fontFamily: "Sarabun, sans-serif", fontSize: "28.8px", color: "#c9966b" }}>
                  Verified Member
                </div>
              </div>

              {/* Bottom */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontFamily: "Sarabun, sans-serif", fontSize: "18px", color: "#a4a7a5" }}>
                  Member Since: {formatDatePretty(user.memberSince)}
                </div>
                <div style={{ fontFamily: "Alegreya Sans, sans-serif", fontSize: "27.6px", color: "#c9966b" }}>
                  User ID: {user.userId}
                </div>
              </div>
            </div>

            {/* Download buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={downloadCardPNG} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Download className="mr-2" size={16} /> PNG
              </button>
              <button onClick={downloadCardPDF} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Download className="mr-2" size={16} /> PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
