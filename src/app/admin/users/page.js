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
  // Change a user's role (attendee, organiser, or admin)
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
}