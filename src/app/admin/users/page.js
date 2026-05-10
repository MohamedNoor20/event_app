"use client";

import { useEffect, useState } from "react";

// This page gives authority to admin to see users ,change and delete them
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

useEffect(() => {
// Load users on opening of page
fetchUsers();
  }, []);

const fetchUsers = async () => {
try {
  const res = await fetch("/api/admin/users");
  const data = await res.json();
  setUsers(data.users || []);
    } 
catch (error) {
  setMessage("Failed to load users");
    } 
 finally {
  setLoading(false);
    }
  };
  // Changing user role
const updateRole = async (userId, newRole) => {
 try {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole })
  });
if (res.ok) {
  setMessage("Role updated successfully");
  fetchUsers(); // Refresh the list
  setTimeout(() => setMessage(""), 2000);
      } 
else {
  setMessage("Failed to update role");
      }
    } 
catch (error) {
 setMessage("Error updating role");
    }
  };

  // Deleting user
const deleteUser = async (userId) => {
const confirmed = confirm("Do you want to delete user? This will  delete all their events and bookings.");
    if (!confirmed) return;
try {
      const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE"
      });
if (res.ok) {
      setMessage("User deleted successfully");
      fetchUsers(); // Refresh the list
      setTimeout(() => setMessage(""), 2000);
      } 
else {
    setMessage("Failed to delete user");
      }
    }
 catch (error) {
  setMessage("Error deleting user");
    }
  };

if (loading) {
  return <div className="text-center p-10">Loading users...</div>;
  }
}