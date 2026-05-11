"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // Close menu when clicking outside
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

  // Fetch user role from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const role = data.user.Role;
            setUserRole(role ? role.toLowerCase() : null);
          } else {
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="nav-cont" ref={menuRef}>
        <nav className="nav">
          <div className="ul-cont">
            <ul className="navList">
              <li className="navItem">
                <Link href="/">Home</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }

  const isAdmin = userRole === "admin";
  const isOrganiser = userRole === "organiser";

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

            {(isAdmin || isOrganiser) && (
              <li className="navItem">
                <Link href="/Create_event" onClick={closeMenu}>Create Event</Link>
              </li>
            )}

            {(isAdmin || isOrganiser) && (
              <li className="navItem">
                <Link href="/Event_control" onClick={closeMenu}>Event Control</Link>
              </li>
            )}

            {isAdmin && (
              <li className="navItem">
                <Link href="/admin" onClick={closeMenu}>Admin</Link>
              </li>
            )}

            <li className="navItem">
              <Link href="/Roles" onClick={closeMenu}>Roles</Link>
            </li>

            {/* Login button only - NO Logout button */}
            {!userRole && (
              <li className="navItem">
                <Link href="/sign/in" onClick={closeMenu}>Login</Link>
              </li>
            )}
          </ul>
        </div>

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