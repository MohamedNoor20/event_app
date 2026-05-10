import pool from "@/lib/db";
import { cookies } from "next/headers";

//Deleting an event
export async function DELETE(request, { params }) {
  try {
    const { eventId } = params;
// Check for admin
 const cookieStore = cookies();
 const userRole = cookieStore.get("role")?.value;
 if (userRole !== "admin") {
  return Response.json(
 { message: "Unauthorized" },
 { status: 403 });}
// Delete the event also deleting bookings
  await pool.query("DELETE FROM EventTBL WHERE EventID = ?", [eventId]);
  return Response.json({ message: "Event deleted successfully" });
  } 
catch (error) {
console.error("Error deleting event:", error);
return Response.json(
{ message: "Internal server error" },
    { status: 500 });}
}