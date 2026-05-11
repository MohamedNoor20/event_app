"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// It checks whether user is admin , if not it takes to homepage
export default function AdminLayout({ children }) {
const [isAdmin, setIsAdmin] = useState(false);
const [loading, setLoading] = useState(true);
// router ro redirect users
const router = useRouter();
//it runs when the componets loads
useEffect(() => {
const getCookie = (name) => {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${name}=`);
if (parts.length === 2)return parts.pop().split(";").shift();
 return null;
    };
// getting the role of user using cookie
const userRole = getCookie("role");
if (userRole !== "admin") {
  router.push("/");
    } 
else {
setIsAdmin(true);
    }
setLoading(false);
  }, [router]);
// Show a loading message
if (loading) {
return (
<div style={{ display: "flex", justifyContent: "center", alignItems: "center",  height: "100vh",fontSize: "18px"}}>
  Loading...
      </div>
    );
  }
if (!isAdmin) {
return null;
  }
// Admin dashboard layout with navigation
  return (
<div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6",fontFamily: "Arial, sans-serif"}}>
{/* Navigation Bar with Button Styles */}
<div style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",padding: "16px 24px",
  borderBottom: "1px solid #e5e7eb"
      }}>
<div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "16px",flexWrap: "wrap"}}>
  <Link href="/admin" 
  style={{ 
  padding: "10px 20px",
  backgroundColor: "#3b82f6",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "500",
  transition: "background-color 0.2s"}}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}>Dashboard</Link>
<Link href="/admin/users" 
  style={{ 
  padding: "10px 20px",
  backgroundColor: "#10b981",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "500",
  transition: "background-color 0.2s"
            }}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}>Manage Users</Link>
  <Link href="/admin/events" 
  style={{
    padding: "10px 20px",
    backgroundColor: "#8b5cf6",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s"}}
    onMouseEnter={(e) => e.target.style.backgroundColor = "#7c3aed"}
    onMouseLeave={(e) => e.target.style.backgroundColor = "#8b5cf6"}> Manage Events</Link>
      </div>
      </div>
{/* Page Content */}
  <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
  {children}
      </main>
    </div>
  );
}