import pool from "@/lib/db";
import { cookies } from "next/headers";
// Getting list of events
export async function GET(request) {
 try {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("role")?.value;
// check to make sure user is admin
if (userRole !== "admin") {
return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
// Getting all events
const [events] = await pool.query(`
SELECT e.*, u.Firstname, u.Lastname 
FROM EventTBL e
LEFT JOIN Users u ON e.UserID = u.UserID
ORDER BY e.Date DESC
    `);
return Response.json({ events });
  } 
catch (error) {
console.error("Error while fetching events:", error);
return Response.json({ message: error.message }, { status: 500 });
  }
}