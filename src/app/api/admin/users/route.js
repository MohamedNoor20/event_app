import pool from "@/lib/db";
import { cookies } from "next/headers";

//Returning the list of all users
// Only the admin can access this
export async function GET(request) {
try {
//Using cookie to check user getting logged in is admin
const cookieStore = await cookies();
const userRole = cookieStore.get("role")?.value;
// Remove them if they are not admin
if (userRole !== "admin") {
  return Response.json(
   { message: "Unauthorized" },
   { status: 403 }
   );}

 // Getting  users from database.
 const [users] = await pool.query(
  "SELECT UserID, Firstname, Lastname, Username, Role, Dob FROM Users ORDER BY UserID"
    );
 return Response.json({ users });} 
 catch (error) {
 console.error("Error fetching users:", error);
 return Response.json(
 { message: "Internal server error" },
 { status: 500 }
    );
  }
}