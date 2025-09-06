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

      const emailRegistrationsQuery = query(
        collection(db, "teamRegistrations"),
        where("email", "==", currentUser.email)
      );
      const emailRegistrationsSnapshot = await getDocs(
        emailRegistrationsQuery
      );

      if (!emailRegistrationsSnapshot.empty) {
        const regDoc = emailRegistrationsSnapshot.docs[0];
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

  async function downloadCard(format: "png" | "pdf") {
    if (!user) return;
    try {
      const bg = new Image();
      bg.src = "/assets/card_template.webp";
      await new Promise((resolve) => {
        bg.onload = resolve;
      });

      const width = 1300;
      const height = 820;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bg, 0, 0, width, height);

      // ratios
      const rx = width / 1300;
      const ry = height / 820;

      // Council Name
      ctx.font = `${32.8 * rx}px Montserrat`;
      ctx.fillStyle = "#c9966b";
      ctx.textAlign = "center";
      ctx.fillText("Pakistan Youth Council", width / 2, 120 * ry);

      // User Name
      ctx.font = `${43.5 * rx}px Poppins`;
      ctx.fillStyle = "#ffc99c";
      ctx.fillText(user.name || "", width / 2, 200 * ry);

      // Verified Member
      ctx.font = `${28.8 * rx}px Sarabun`;
      ctx.fillStyle = "#c9966b";
      ctx.fillText("Verified Member", width / 2, 260 * ry);

      // Member Since
      ctx.font = `${18 * rx}px Sarabun`;
      ctx.fillStyle = "#a4a7a5";
      ctx.fillText(
        `Member Since: ${formatDatePretty(user.memberSince)}`,
        width / 2,
        height - 80 * ry
      );

      // User ID
      ctx.font = `${27.6 * rx}px Alegreya Sans`;
      ctx.fillStyle = "#c9966b";
      ctx.fillText(`User ID: ${user.userId}`, width / 2, height - 40 * ry);

      if (format === "png") {
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${(user.name || "member").replace(
          /\s+/g,
          "_"
        )}-card.png`;
        a.click();
      } else {
        const { jsPDF } = await import("jspdf");
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
        pdf.save(`${(user.name || "member").replace(/\s+/g, "_")}-card.pdf`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Could not generate card.");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-l-4 border-red-500">
          <div className="bg-gradient-to-r from-red-600 to-green-600 p-6 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="opacity-90">
              Manage your account information and membership details
            </p>
          </div>
        </div>

        {/* Profile + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            {/* Personal info */}
            {/* ... (same form fields code as before) */}
          </div>

          {/* Membership Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2 text-green-500" size={24} />
                Membership Status
              </h2>
              {/* ... (status + streak code as before) */}
            </div>
          </div>
        </div>

        {/* Membership Card at bottom */}
        {user?.status === "accepted" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Download className="mr-2 text-blue-500" size={24} />
              Digital Membership Card
            </h2>

            {/* Small preview */}
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
                Member Since: {formatDatePretty(user.memberSince)}
              </div>
              <div
                style={{
                  fontFamily: "Alegreya Sans, sans-serif",
                  fontSize: "10px",
                  color: "#c9966b",
                }}
              >
                User ID: {user.userId}
              </div>
            </div>

            {/* Download buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => downloadCard("png")}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Download className="mr-2" size={16} />
                PNG
              </button>
              <button
                onClick={() => downloadCard("pdf")}
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
  );
}
