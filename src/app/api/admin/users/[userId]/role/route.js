import pool from "@/lib/db";
import { cookies } from "next/headers";

//This page is to update a user's role
// Admin can do
export async function PUT(request, { params }) {
try {
 const { userId } = params;
 const { role } = await request.json();
// Check to make sure its admin
 const cookieStore = cookies();
 const userRole = cookieStore.get("role")?.value;
 if (userRole !== "admin") {
  return Response.json(
  { message: "Unauthorized" },
  { status: 403 }); }
//Allowing the following roles:
  const validRoles = ["admin", "organiser", "attendee"];
  if (!validRoles.includes(role)) {
  return Response.json(
  { message: "Invalid role" },
  { status: 400 } ); }
// Updataing  user role in the database
  await pool.query(
  "UPDATE Users SET Role = ? WHERE UserID = ?",
   [role, userId]);
 return Response.json({ message: "Role has been updated successfully" });
  } 
catch (error) {
console.error("Error while updating role:", error);
 return Response.json(
  { message: "Internal server error" },
{ status: 500 }); }}