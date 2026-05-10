"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me");

      if (!res.ok) return;

      const data = await res.json();

      if (data.success) {
        setRole(data.user.Role.toLowerCase());
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  fetchUser();
}, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="nav-cont" ref={menuRef}>
      <nav className="nav">
        
        <div className={`ul-cont ${isOpen ? "open" : ""}`}>
          <ul className="navList">

            <li className="navItem">
              <Link href="/" onClick={closeMenu}>Home</Link>
            </li>


            <li className="navItem">
              <Link href="/Event" onClick={closeMenu}>Events</Link>
            </li>

            {(role === "organiser" || role === "admin") && (
              <li className="navItem">
                <Link href="/Create_event" onClick={closeMenu}>Create Event</Link>
              </li>
            )}

            {(role === "organiser" || role === "admin") && (
              <li className="navItem">
                <Link href="/Event_control" onClick={closeMenu}>Event Control</Link>
              </li>
            )}

            <li className="navItem">
              <Link href="/Roles" onClick={closeMenu}>Roles</Link>
            </li>

            {role === "admin" && (
              <li className="navItem">
                <Link href="/user_control" onClick={closeMenu}>Admin</Link>
              </li>
            )}

          </ul>
        </div>

        {/* ✅ HAMBURGER */}
        <div
          className={`ham-menu ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

      </nav>
    </div>
  );
}