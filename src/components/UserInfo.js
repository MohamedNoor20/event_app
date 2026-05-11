"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function UserInfo() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [pathname]); // Re-run when pathname changes

  const handleLogout = () => {
    // Clear session cookies
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Refresh the router state and redirect to sign in
    setUser(null);
    router.refresh();
    router.push("/sign/in");
  };

  // Check if we are exactly on the root path
  const isHomePage = pathname === '/';

  return (
    <div className="userinfo" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      {user ? (
        <>
          <p style={{ margin: 0, fontWeight: "bold"}}>
            Hello, <b>{user.Firstname}</b>
          </p>

          {/* Only show the Logout button if the current path is exactly the Home page ("/") */}
          {isHomePage && (
            <button 
              className="dangerBorder userinfoBtn" 
              onClick={handleLogout}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", cursor: "pointer" }}
            >
              Logout
            </button>
          )}
        </>
      ) : (
        <Link href="/sign/in" style={{ color: "white", textDecoration: "underline" }}>Login</Link>
      )}
    </div>
  );
}