"use client";

import { useEffect, useState } from "react";
// this page manages users , delete users , update their roles
export default function ManageUsers() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
useEffect(() => {
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
// function to update role of user
const updateRole = async (userId, newRole) => {
try {
const res = await fetch(`/api/admin/users/${userId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role: newRole }),
      });
if (res.ok) {
  setMessage("Role updated successfully");
  fetchUsers();
  setTimeout(() => setMessage(""), 2000);
      } 
else {
  const data = await res.json();
  setMessage(data.message || "Failed to update role");
      }
    } 
  catch (error) {
  setMessage("Error updating role");
    }
  };
// function to delete user
  const deleteUser = async (userId, userName) => {
  if (!confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) return;
  try {
  const res = await fetch(`/api/admin/users/${userId}`, {
   method: "DELETE",
      });
  const data = await res.json();
  if (res.ok) {
     setMessage("User deleted successfully");
     fetchUsers();
     setTimeout(() => setMessage(""), 2000);
      }
   else {
   setMessage(data.message || "Failed to delete user");
      }
    }
   catch (error) {
  setMessage("Error deleting user");
    }
  };
if (loading) {
return <div style={{ textAlign: "center", padding: "40px" }}>Loading users...</div>;
  }
return (
<div>
<h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Manage Users</h1>
{message && (
  <div style={{
   backgroundColor: "#d4edda",
   color: "#155724",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px"
        }}>{message} </div>
      )}
{users.length === 0 ? (
<p>No users found.</p>
      ) : (
    <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px" }}>
    <thead style={{ backgroundColor: "#f3f4f6" }}>
    <tr>
      <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>ID</th>
       <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>First Name</th>
       <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Last Name</th>
       <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Username</th>
       <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Role</th>
       <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Actions</th>
     </tr>
        </thead>
 <tbody>
  {users.map((user) => (
    <tr key={user.UserID} style={{ borderBottom: "1px solid #e5e7eb" }}>
     <td style={{ padding: "12px" }}>{user.UserID}</td>
     <td style={{ padding: "12px" }}>{user.Firstname}</td>
      <td style={{ padding: "12px" }}>{user.Lastname}</td>
      <td style={{ padding: "12px" }}>{user.Username}</td>
      <td style={{ padding: "12px" }}>
  <select
     value={user.Role}
     onChange={(e) => updateRole(user.UserID, e.target.value)}
  style={{
       padding: "5px 10px",
       borderRadius: "5px",
       border: "1px solid #ccc",
       backgroundColor: "white"}}
                    >
  <option value="attendee">Attendee</option>
  <option value="organiser">Organiser</option>
  <option value="admin">Admin</option></select>
</td>
  <td style={{ padding: "12px" }}>
    <button
      onClick={() => deleteUser(user.UserID, user.Firstname)}
      style={{
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      padding: "5px 12px",
      borderRadius: "5px",
      cursor: "pointer"    }}
     onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
    onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}>  Delete</button>
</td>
    </tr>
    ))}
    </tbody>
      </table>
        </div>
      )}
    </div>
  );
}