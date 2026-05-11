import pool from "@/lib/db";
import { cookies } from "next/headers";
// deleting the event
export async function DELETE(request, { params }) {
try {
const { eventId } = await params;
const cookieStore = await cookies();
const userRole = cookieStore.get("role")?.value;
// check to make sure user is admin
if (userRole !== "admin") {
return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
// Deleting bookings first
await pool.query("DELETE FROM Book WHERE EventID = ?", [eventId]);
// Deleting event
await pool.query("DELETE FROM EventTBL WHERE EventID = ?", [eventId]);
return Response.json({ message: "Event deleted successfully" });
  } 
catch (error) {
console.error("Error while deleting event:", error);
return Response.json({ message: error.message }, { status: 500 });
  }
}