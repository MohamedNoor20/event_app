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
}