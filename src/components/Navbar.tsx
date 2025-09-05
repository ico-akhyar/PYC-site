import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type User = {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch logged-in user from backend; fallback to localStorage
    (async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          // keep a local copy for UI fallback
          try { localStorage.setItem("user", JSON.stringify(data)); } catch {}
        } else {
          // fallback to client-stored user (dev/demo)
          const raw = localStorage.getItem("user");
          if (raw) setUser(JSON.parse(raw));
          else setUser(null);
        }
      } catch (err) {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
        else setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/">
          <a className="flex items-center gap-2">
            {/* replace /logo.png with your team logo */}
            <Image src="/logo.png" alt="logo" width={36} height={36} />
            <span className="font-semibold text-lg">YourSite</span>
          </a>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/explore"><a className="text-sm">Explore</a></Link>

        {!loading && user ? (
          // clickable profile area (replaces static 'Profile' label)
          <Link href="/profile">
            <a className="flex items-center gap-3 px-2 py-1 rounded hover:bg-gray-100">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-sm select-none">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium leading-4">
                  {user.name || user.email}
                </span>
                <span className="text-xs text-gray-500">View profile</span>
              </div>
            </a>
          </Link>
        ) : (
          <>
            <Link href="/login"><a className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Login</a></Link>
            <Link href="/register"><a className="px-3 py-1 rounded border text-sm">Register</a></Link>
          </>
        )}
      </div>
    </nav>
  );
}
