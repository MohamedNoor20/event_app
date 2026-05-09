"use client";

import { useEffect, useState } from "react";

//Page.js is admin dashboard homepage
// It shows how many users are there , events and bookings
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
// Fetching while loads
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading stats...</div>;
  }
}