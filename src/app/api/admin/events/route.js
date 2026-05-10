import pool from "@/lib/db";
import { cookies } from "next/headers";
//Returning the list of all events
export async function GET(request) {
  try {
// Checking to make sure its admin
  const cookieStore = await cookies();
  const userRole = cookieStore.get("role")?.value;
 if (userRole !== "admin") {
 return Response.json(
 { message: "Unauthorized" },
 { status: 403 });}
// Getting  all events
 const [events] = await pool.query(`
    SELECT e.*, u.Firstname, u.Lastname 
    FROM EventTBL e
    JOIN Users u ON e.UserID = u.UserID
    ORDER BY e.Date DESC
    `);
 return Response.json({ events });
  } 
 catch (error) {
 console.error("Error fetching events:", error);
 return Response.json(
 { message: "Internal server error" },
 { status: 500 });
  }
}