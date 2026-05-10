"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function UserInfo() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const getCookie = (name) => {
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(name + "="));

    return match ? match.split("=")[1] : null;
  };

  const loadUser = () => {
    const session = getCookie("session");
    const role = getCookie("role");

    if (session && role) {
      setUser({ session, role });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, [pathname]); 

  const logout = () => {
    document.cookie = "session=; Max-Age=0; path=/";
    document.cookie = "role=; Max-Age=0; path=/";

    setUser(null);
    router.push("/sign/in");
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {user ? (
        <>
          <p>
            Logged in as <b>{user.role}</b>
          </p>

          <button onClick={logout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        </>
      ) : (
        <Link href="/sign/in">Login</Link>
      )}
    </div>
  );
}