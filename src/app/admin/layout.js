import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

// The layout page covers  all admin pages
// It makes checks , it make sures the user getting logged in is an admin or not 
//  if the user isnot admin it redirects him homepage
export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
// This function gets value of cookie by its name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };


    const userRole = getCookie("role");
    
//using if else logic to make sure only admin can access.
    if (userRole !== "admin") {
      router.push("/");
    } else {
      setIsAdmin(true);
    }
    setLoading(false);
  }, [router]);
// While making a check , show loading there
  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

// If the user is not admin , show nothing
  if (!isAdmin) {
    return null;
  }  
 return (
<div className="min-h-screen bg-gray-100">
 {/* Navigation bar*/}
   <nav className="bg-white shadow-md p-4">
    <div className="max-w-6xl mx-auto flex gap-6">
     <Link href="/admin" className="hover:text-blue-600">Dashboard</Link>
       <Link href="/admin/users" className="hover:text-blue-600">Manage Users</Link>
         <Link href="/admin/events" className="hover:text-blue-600">Manage Events</Link>
    </div>
 </nav>
<main className="max-w-6xl mx-auto p-6">
  {children}
      </main>
    </div>
  );
}