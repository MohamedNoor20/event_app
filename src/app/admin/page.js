"use client";

import { useEffect, useState } from "react";

// Page.js is admin dashboard homepage
// It shows how many users are there, events and bookings
export default function AdminDashboard() {
const [stats, setStats] = useState({
totalUsers: 0,
totalEvents: 0,
totalBookings: 0
  });
const [loading, setLoading] = useState(true);
useEffect(() => {
// Fetch stats when page loads
fetchStats();
  }, []);
const fetchStats = async () => {
try {
  const res = await fetch("/api/admin/stats");
  const data = await res.json();
  setStats(data);
    } 
catch (error) {
  console.error("Failed to fetch stats", error);
    } 
finally {
      setLoading(false);
    }
  };
if (loading) {
    return <div className="text-center p-10">Loading stats...</div>;
  }
// Returning the actual dashboard content
  return (
  <div>
  <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-gray-500 text-sm">Total Users</h2>
  <p className="text-3xl font-bold">{stats.totalUsers}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-gray-500 text-sm">Total Events</h2>
  <p className="text-3xl font-bold">{stats.totalEvents}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-gray-500 text-sm">Total Bookings</h2>
  <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
      </div>
    </div>
  );
}