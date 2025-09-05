import { useEffect, useRef, useState } from "react";

/**
 * Profile page
 * - editable profile fields (name, phone, social handles)
 * - daily check-in streak (uses server time via /api/time and /api/checkin)
 * - shows digital membership card if user.status === 'accepted' (downloadable PNG/PDF)
 *
 * Dependencies (install):
 *   npm i html2canvas jspdf
 *
 * Replace /logo.png with your actual logo file path.
 */

type ApiUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  social?: { twitter?: string; instagram?: string; linkedin?: string; [k: string]: string | undefined };
  memberSince?: string; // ISO date
  status?: "pending" | "contacted" | "accepted";
  lastCheckin?: string; // ISO date
  streakCount?: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [serverDate, setServerDate] = useState<string | null>(null); // yyyy-mm-dd from server
  const [checkinLoading, setCheckinLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // fallback to local (demo)
          const raw = localStorage.getItem("user");
          if (raw) setUser(JSON.parse(raw));
        }
      } catch (err) {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    })();

    // fetch server time for streak correctness
    (async () => {
      try {
        const r = await fetch("/api/time");
        if (r.ok) {
          const j = await r.json();
          // expected { serverTime: "2025-09-05T13:00:00Z" }
          const d = new Date(j.serverTime);
          setServerDate(d.toISOString().slice(0, 10));
        } else {
          // fallback to remote worldtime if you want
          const alt = await fetch("https://worldtimeapi.org/api/ip");
          const altj = await alt.json();
          setServerDate(new Date(altj.utc_datetime).toISOString().slice(0, 10));
        }
      } catch {
        // last resort: local device date (not secure) — still set for UI
        setServerDate(new Date().toISOString().slice(0, 10));
      }
    })();
  }, []);

  function updateField<K extends keyof ApiUser>(field: K, value: ApiUser[K]) {
    setUser(prev => prev ? { ...prev, [field]: value } : prev);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (res.ok) {
        const j = await res.json();
        setUser(j);
        try { localStorage.setItem("user", JSON.stringify(j)); } catch {}
        setMessage("Profile saved.");
      } else {
        setMessage("Save failed.");
      }
    } catch (err) {
      setMessage("Network error while saving.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  function formatDatePretty(iso?: string) {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso.slice(0,10);
    }
  }

  function hasCheckedInToday() {
    if (!user) return false;
    if (!user.lastCheckin || !serverDate) return false;
    return user.lastCheckin.slice(0, 10) === serverDate;
  }

  async function doCheckin() {
    if (!user) return;
    setCheckinLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ /* optional payload */ }),
      });
      if (res.ok) {
        const j = await res.json();
        // expects { lastCheckin: iso, streakCount: number, serverTime?: iso }
        setUser(prev => prev ? { ...prev, lastCheckin: j.lastCheckin, streakCount: j.streakCount } : prev);
        if (j.serverTime) setServerDate(new Date(j.serverTime).toISOString().slice(0,10));
        setMessage("Check-in recorded. Nice streak!");
      } else {
        const txt = await res.text();
        setMessage(`Check-in failed: ${txt}`);
      }
    } catch (err) {
      setMessage("Network/server error for check-in.");
    } finally {
      setCheckinLoading(false);
      setTimeout(()=>setMessage(null), 3000);
    }
  }

  // digital card download handlers
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
      setMessage("Could not generate image. Make sure html2canvas is installed.");
      setTimeout(()=>setMessage(null), 3000);
    }
  }

  async function downloadCardPDF() {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // create landscape-ish PDF that fits the card
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width + 40, canvas.height + 40],
      });
      pdf.addImage(imgData, "PNG", 20, 20, canvas.width, canvas.height);
      pdf.save(`${(user?.name || "member").replace(/\s+/g,"_")}-card.pdf`);
    } catch (err) {
      setMessage("Could not generate PDF. Make sure jspdf & html2canvas are installed.");
      setTimeout(()=>setMessage(null), 3000);
    }
  }

  if (loading) return <div className="p-6">Loading profile…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* left: form */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-medium mb-3">Account information</h2>

          <div className="space-y-3">
            <label className="block">
              <div className="text-sm text-gray-600">Full name</div>
              <input
                value={user?.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Your full name"
              />
            </label>

            <label className="block">
              <div className="text-sm text-gray-600">Email (cannot be changed here)</div>
              <input
                value={user?.email || ""}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-50"
              />
            </label>

            <label className="block">
              <div className="text-sm text-gray-600">Phone</div>
              <input
                value={user?.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="+92 300 0000000"
              />
            </label>

            <div>
              <div className="text-sm text-gray-600 mb-2">Social handles</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  value={user?.social?.twitter || ""}
                  onChange={(e) => updateField("social", { ...(user?.social || {}), twitter: e.target.value })}
                  placeholder="@twitter"
                  className="border rounded px-3 py-2"
                />
                <input
                  value={user?.social?.instagram || ""}
                  onChange={(e) => updateField("social", { ...(user?.social || {}), instagram: e.target.value })}
                  placeholder="@instagram"
                  className="border rounded px-3 py-2"
                />
                <input
                  value={user?.social?.linkedin || ""}
                  onChange={(e) => updateField("social", { ...(user?.social || {}), linkedin: e.target.value })}
                  placeholder="linkedin.com/in/..."
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>

              <button
                onClick={() => {
                  try { localStorage.removeItem("user"); setMessage("Local demo cleared."); setTimeout(()=>setMessage(null),2000); } catch {}
                }}
                className="px-3 py-2 border rounded"
              >
                Clear local demo
              </button>

              {message && <div className="text-sm text-gray-700">{message}</div>}
            </div>
          </div>
        </div>

        {/* right: membership / streak / card */}
        <div className="bg-white p-4 rounded shadow-sm space-y-4">
          <div>
            <div className="text-xs text-gray-500">Member status</div>
            <div className="mt-1 font-medium">
              {user?.status === "accepted" ? (
                <span className="text-green-600">Accepted — Member</span>
              ) : user?.status === "contacted" ? (
                <span className="text-yellow-600">Contacted / In review</span>
              ) : (
                <span className="text-gray-600">Pending</span>
              )}
            </div>

            <div className="text-sm text-gray-500 mt-1">Member since: {formatDatePretty(user?.memberSince)}</div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Daily streak</div>
                <div className="text-lg font-semibold">{user?.streakCount || 0} day(s)</div>
                <div className="text-xs text-gray-500">Last check-in: {user?.lastCheckin ? formatDatePretty(user.lastCheckin) : "-"}</div>
              </div>

              <div>
                <button
                  onClick={doCheckin}
                  disabled={hasCheckedInToday() || checkinLoading}
                  className={`px-4 py-2 rounded ${hasCheckedInToday() ? "bg-gray-300" : "bg-blue-600 text-white"}`}
                >
                  {checkinLoading ? "Checking…" : hasCheckedInToday() ? "Already checked" : "Check in"}
                </button>
                <div className="text-xs text-gray-400 mt-1">Server date: {serverDate || "—"}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="text-sm text-gray-700 mb-2">Digital membership card</div>

            {user?.status === "accepted" ? (
              <>
                <div ref={cardRef} className="p-3 rounded shadow-sm bg-gradient-to-r from-white via-gray-50 to-white" style={{width:320}}>
                  <div className="flex items-center gap-3">
                    <div style={{width:72, height:72}} className="rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img src="/logo.png" alt="logo" width={72} height={72} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Member</div>
                      <div className="text-lg font-bold">{user?.name}</div>
                      <div className="text-xs text-gray-500">Member since: {formatDatePretty(user?.memberSince)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={downloadCardPNG} className="px-3 py-2 border rounded">Download PNG</button>
                  <button onClick={downloadCardPDF} className="px-3 py-2 border rounded">Download PDF</button>
                </div>

                <div className="text-xs text-gray-500 mt-2">Tip: PDF works best for printing. PNG saves the visual card.</div>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Membership card is available only after your registration is accepted by the team.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
