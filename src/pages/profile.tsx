import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Download,
  CheckCircle,
  Clock,
  Save,
} from "lucide-react";

type UserData = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    [k: string]: string | undefined;
  };
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

  // -------- Profile Load --------
  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const membersQuery = query(
        collection(db, "members"),
        where("userId", "==", currentUser.uid)
      );
      const membersSnapshot = await getDocs(membersQuery);

      if (!membersSnapshot.empty) {
        const memberDoc = membersSnapshot.docs[0];
        const memberData = memberDoc.data();
        setUserDocId(memberDoc.id);
        setUser({
          id: memberDoc.id,
          ...memberData,
          social:
            typeof memberData.social === "object" ? memberData.social : {},
        });
        setLoading(false);
        return;
      }

      const registrationsQuery = query(
        collection(db, "teamRegistrations"),
        where("userId", "==", currentUser.uid)
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);

      if (!registrationsSnapshot.empty) {
        const regDoc = registrationsSnapshot.docs[0];
        const regData = regDoc.data();
        setUserDocId(regDoc.id);
        setUser({
          id: regDoc.id,
          ...regData,
          social: typeof regData.social === "object" ? regData.social : {},
        });
        setLoading(false);
        return;
      }

      setUser({
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        status: "pending",
        social: {},
      });
      setUserDocId(null);
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage("Failed to load profile data");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // -------- Update Helpers --------
  function updateField<K extends keyof UserData>(field: K, value: UserData[K]) {
    setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function updateSocialField(field: string, value: string) {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            social: { ...(prev.social || {}), [field]: value },
          }
        : prev
    );
  }

  async function saveProfile() {
    if (!user || !currentUser) return;
    setSaving(true);
    setMessage(null);
    try {
      let docRef;
      let collectionName;

      if (user.status === "accepted" && userDocId) {
        collectionName = "members";
        docRef = doc(db, "members", userDocId);
      } else if (userDocId) {
        collectionName = "teamRegistrations";
        docRef = doc(db, "teamRegistrations", userDocId);
      } else {
        const newDoc = await addDoc(collection(db, "teamRegistrations"), {
          name: user.name,
          email: currentUser.email,
          phone: user.phone,
          city: user.city,
          social: user.social || {},
          previousExperience: user.previousExperience,
          socialMedia: user.socialMedia,
          status: "pending",
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        });
        setUserDocId(newDoc.id);
        setUser((prev) =>
          prev ? { ...prev, id: newDoc.id, status: "pending" } : prev
        );
        setMessage(
          "Profile saved successfully! Your registration is pending."
        );
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Document not found in ${collectionName}`);
      }

      await updateDoc(docRef, {
        name: user.name,
        phone: user.phone,
        city: user.city,
        social: user.social || {},
        previousExperience: user.previousExperience,
        socialMedia: user.socialMedia,
        updatedAt: serverTimestamp(),
      });

      setMessage("Profile saved successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
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
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
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
    if (!user || !currentUser || user.status !== "accepted") return;
    setCheckinLoading(true);
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
        collection(db, "members"),
        where("userId", "==", currentUser.uid)
      );
      const membersSnapshot = await getDocs(membersQuery);

      if (!membersSnapshot.empty) {
        const memberDoc = membersSnapshot.docs[0];
        await updateDoc(doc(db, "members", memberDoc.id), {
          lastCheckin: serverTimestamp(),
          streakCount: newStreak,
        });
        setUser((prev) =>
          prev
            ? {
                ...prev,
                lastCheckin: new Date(),
                streakCount: newStreak,
              }
            : prev
        );
        setMessage("Check-in recorded. Keep up the streak!");
      }
    } catch (error) {
      console.error("Error recording check-in:", error);
      setMessage("Failed to record check-in");
    } finally {
      setCheckinLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  // --------- DOWNLOAD: High-Res Canvas Draw ---------
  async function renderCardCanvas(): Promise<HTMLCanvasElement> {
    const bg = new Image();
    bg.src = "/assets/card_template.webp"; // 👈 High-res template (1300x820)
    await new Promise((res) => (bg.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = 1300;
    canvas.height = 820;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bg, 0, 0, 1300, 820);

    // Text overlay (scaled to 1300x820)
    ctx.textAlign = "center";

    // Council Name
    ctx.font = "32.8px Montserrat";
    ctx.fillStyle = "#c9966b";
    ctx.fillText("Pakistan Youth Council", 650, 100);

    // User Name
    ctx.font = "bold 43.5px Poppins";
    ctx.fillStyle = "#ffc99c";
    ctx.fillText(user?.name || "Member Name", 650, 180);

    // Verified Member
    ctx.font = "28.8px Sarabun";
    ctx.fillStyle = "#c9966b";
    ctx.fillText("Verified Member", 650, 230);

    // Bottom
    ctx.font = "18px Sarabun";
    ctx.fillStyle = "#a4a7a5";
    ctx.fillText(
      `Member Since: ${formatDatePretty(user?.memberSince)}`,
      650,
      700
    );

    ctx.font = "27.6px Alegreya Sans";
    ctx.fillStyle = "#c9966b";
    ctx.fillText(`User ID: ${user?.userId}`, 650, 750);

    return canvas;
  }

  async function downloadCardPNG() {
    try {
      const canvas = await renderCardCanvas();
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${(user?.name || "member").replace(/\s+/g, "_")}-card.png`;
      a.click();
    } catch {
      setMessage("Could not generate PNG");
    }
  }

  async function downloadCardPDF() {
    try {
      const { jsPDF } = await import("jspdf");
      const canvas = await renderCardCanvas();
      const imgData = canvas.toDataURL("image/png");

      const mmToPt = (mm: number) => (mm * 72) / 25.4;
      const cardWidth = mmToPt(85.6);
      const cardHeight = mmToPt(53.98);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [cardWidth, cardHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, cardWidth, cardHeight);
      pdf.save(`${(user?.name || "member").replace(/\s+/g, "_")}-card.pdf`);
    } catch {
      setMessage("Could not generate PDF");
    }
  }

  // ---------------- UI ----------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-l-4 border-red-500">
          <div className="bg-gradient-to-r from-red-600 to-green-600 p-6 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="opacity-90">
              Manage your account information and membership details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="mr-2 text-red-500" size={24} />
              Personal Information
            </h2>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  value={user?.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Your full name"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  value={user?.email || currentUser?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  value={user?.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="+92 300 0000000"
                />
              </div>
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  value={user?.city || ""}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Your city"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Experience
              </label>
              <textarea
                value={user?.previousExperience || ""}
                onChange={(e) => updateField("previousExperience", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Any previous volunteer or political experience?"
              />
            </div>

            {/* Social Links */}
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="mr-2 text-red-500" size={20} />
              Social Media Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                value={user?.social?.twitter || ""}
                onChange={(e) => updateSocialField("twitter", e.target.value)}
                placeholder="Twitter @username"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                value={user?.social?.instagram || ""}
                onChange={(e) => updateSocialField("instagram", e.target.value)}
                placeholder="Instagram @username"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                value={user?.social?.linkedin || ""}
                onChange={(e) => updateSocialField("linkedin", e.target.value)}
                placeholder="LinkedIn profile"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg"
              >
                <Save size={18} className="mr-2 inline" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {message && (
                <div
                  className={`text-sm ${
                    message.includes("Failed")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Right: Status + Card */}
          <div className="space-y-6">
            {/* Status */}
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
                      <CheckCircle className="mr-1" size={18} /> Accepted Member
                    </span>
                  ) : user?.status === "contacted" ? (
                    <span className="text-blue-600 flex items-center">
                      <Clock className="mr-1" size={18} /> Contacted
                    </span>
                  ) : (
                    <span className="text-yellow-600">Pending Review</span>
                  )}
                </div>
              </div>

              {/* Streak */}
              {user?.status === "accepted" && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Daily Streak</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold">{user.streakCount || 0}</span>{" "}
                    days
                  </div>
                  <button
                    onClick={doCheckin}
                    disabled={hasCheckedInToday() || checkinLoading}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-red-500 to-green-500 text-white rounded-lg"
                  >
                    {hasCheckedInToday()
                      ? "Checked in today ✅"
                      : checkinLoading
                      ? "Checking in..."
                      : "Check-in"}
                  </button>
                </div>
              )}
            </div>

            {/* Membership Card */}
            {user?.status === "accepted" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Download className="mr-2 text-blue-500" size={24} />
                  Digital Membership Card
                </h2>

                {/* Small Preview */}
                <div
                  ref={cardRef}
                  style={{
                    width: "325px",
                    height: "205px",
                    backgroundImage: "url('/assets/card_template.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "12px",
                      color: "#c9966b",
                    }}
                  >
                    Pakistan Youth Council
                  </div>
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#ffc99c",
                    }}
                  >
                    {user?.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "Sarabun, sans-serif",
                      fontSize: "11px",
                      color: "#c9966b",
                    }}
                  >
                    Verified Member
                  </div>
                  <div
                    style={{
                      fontFamily: "Sarabun, sans-serif",
                      fontSize: "8px",
                      color: "#a4a7a5",
                      marginTop: "8px",
                    }}
                  >
                    Member Since: {formatDatePretty(user?.memberSince)}
                  </div>
                  <div
                    style={{
                      fontFamily: "Alegreya Sans, sans-serif",
                      fontSize: "10px",
                      color: "#c9966b",
                    }}
                  >
                    User ID: {user?.userId}
                  </div>
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
