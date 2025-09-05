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
      // First try to find user in members collection by userId field
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

      // If not found in members, try registrations collection by userId
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

      // Fallback: try to find by email (for backward compatibility)
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

      // If nothing found, create basic user object
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
      // Determine which collection to update based on user status
      let docRef;
      let collectionName;
      
      if (user.status === 'accepted' && userDocId) {
        // Update in members collection
        collectionName = 'members';
        docRef = doc(db, 'members', userDocId);
      } else if (userDocId) {
        // Update in registrations collection
        collectionName = 'teamRegistrations';
        docRef = doc(db, 'teamRegistrations', userDocId);
      } else {
        // Create new registration if no ID exists
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

      // Verify the document exists before updating
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
      // Use new Date() to handle any type of date input
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
      
      // Safely convert lastCheckin to Date object if it exists
      if (user.lastCheckin) {
        lastCheckinDate = new Date(user.lastCheckin);
      }
      
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
      
      // Find the member document by userId
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
            lastCheckin: new Date(),   // local update for UI
            streakCount: newStreak
          } : prev);
          
        
        setMessage("Check-in recorded. Keep up the streak!");
      } else {
        // If not found in members, try to create a member record
        try {
          const newMemberDoc = await addDoc(collection(db, 'members'), {
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            social: user.social || {},
            previousExperience: user.previousExperience,
            socialMedia: user.socialMedia,
            status: 'accepted',
            memberSince: serverTimestamp(),
            streakCount: newStreak,
            lastCheckin: serverTimestamp(),
            userId: currentUser.uid,
            createdAt: serverTimestamp()
          });
          
          setUserDocId(newMemberDoc.id);
          setUser(prev => prev ? { 
            ...prev, 
            lastCheckin: new Date(),   // local update
            streakCount: newStreak,
            status: 'accepted',
            id: newMemberDoc.id
          } : prev);
          
          
          setMessage("Member record created and check-in recorded!");
        } catch (createError) {
          console.error('Error creating member record:', createError);
          setMessage("Member record not found and could not be created. Please contact admin.");
        }
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
        scale: 8,                // higher scale → crisp output
        backgroundColor: "#ffffff" // fallback white background
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
        scale: 8,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
  
      // Use real ID-1 card dimensions at 300 DPI (~1011x639 px)
      const mmToPt = (mm: number) => (mm * 72) / 25.4; // convert mm → PDF points
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
                  onChange={(e) => updateSocialField("twitter", e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Instagram</label>
                <input
                  value={user?.social?.instagram || ""}
                  onChange={(e) => updateSocialField("instagram", e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">LinkedIn</label>
                <input
                  value={user?.social?.linkedin || ""}
                  onChange={(e) => updateSocialField("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center disabled:opacity-50"
              >
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {message && (
                <div className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </div>
              )}
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
                    <span className="text-blue-600 flex items-center">
                      <Clock className="mr-1" size={18} />
                      Contacted / In review
                    </span>
                  ) : (
                    <span className="text-gray-600 flex items-center">
                      <Clock className="mr-1" size={18} />
                      Pending Registration
                    </span>
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

              {user?.status === "accepted" && (
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
                      disabled={hasCheckedInToday() || checkinLoading}
                      className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                        hasCheckedInToday()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      <Clock className="mr-2" size={16} />
                      {checkinLoading ? "Checking..." : hasCheckedInToday() ? "Checked In" : "Check In"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user?.status === "accepted" && (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <Download className="mr-2 text-blue-500" size={24} />
      Membership Card
    </h2>

    {/* Card preview */}
    <div
      ref={cardRef}
      className="relative rounded-lg shadow-md text-white overflow-hidden"
      style={{
        width: "325px",     // ~ standard card at 96 DPI
        height: "205px",    // maintains 1.586 aspect ratio
        aspectRatio: "1.586 / 1",
        background: "linear-gradient(135deg, #ef4444, #22c55e)", // red→green
        padding: "16px",
      }}
    >
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.35) 0,
              rgba(255,255,255,0.35) 4px,
              transparent 4px,
              transparent 8px
            )
          `,
        }}
      ></div>

      {/* Watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-white font-bold select-none"
          style={{
            fontSize: "64px",
            opacity: 0.08,
            transform: "rotate(-30deg)",
            whiteSpace: "nowrap",
          }}
        >
          PYC MEMBERSHIP
        </span>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Logo + user info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              src="/assets/pyc_logo_webp.webp"
              alt="Team Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <div className="text-xs opacity-90">Pakistan Youth Council</div>
            <div className="text-lg font-bold leading-tight">{user?.name}</div>
            <div className="text-xs opacity-90 mt-1">
              Member since: {formatDatePretty(user.memberSince)}
            </div>
          </div>
        </div>

        {/* User ID */}
        <div className="text-center text-xs opacity-90 font-mono mb-2">
          ID: {user.userId}
        </div>
      </div>

      {/* Bottom double ribbon strips */}
      <div
        className="absolute bottom-0 left-0 w-full h-8"
        style={{
          background: "linear-gradient(135deg, #dc2626, #16a34a)",
          clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-full h-6 opacity-80"
        style={{
          background: "linear-gradient(45deg, #dc2626, #16a34a)",
          clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
        }}
      ></div>
    </div>

    {/* Download buttons */}
    <div className="grid grid-cols-2 gap-3 mt-4">
      <button
        onClick={downloadCardPNG}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
      >
        <Download className="mr-2" size={16} />
        PNG
      </button>
      <button
        onClick={downloadCardPDF}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
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