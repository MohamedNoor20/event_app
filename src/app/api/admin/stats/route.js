import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
// Check for admin
 const cookieStore = await cookies();
 const userRole = cookieStore.get("role")?.value;
 if (userRole !== "admin") {
 return Response.json(
 { message: "Unauthorized" },
 { status: 403 });}
// Counting the users in the system
 const [usersCount] = await pool.query("SELECT COUNT(*) as count FROM Users");
// Counting events in the system
 const [eventsCount] = await pool.query("SELECT COUNT(*) as count FROM EventTBL");
// Counting bookings in the system
 const [bookingsCount] = await pool.query("SELECT COUNT(*) as count FROM Book");
 return Response.json({
  totalUsers: usersCount[0].count,
  totalEvents: eventsCount[0].count,
  totalBookings: bookingsCount[0].count
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}