import pool from "@/lib/db";
import { cookies } from "next/headers";

//Deleting a user
export async function DELETE(request, { params }) {
try {
  const { userId } = params;
// check to make sure it is admin
  const cookieStore = cookies();
  const userRole = cookieStore.get("role")?.value;
  if (userRole !== "admin") {
  return Response.json(
   { message: "Unauthorized" },
   { status: 403 });}
//Getting the user id from session cookie
  const sessionUser = cookieStore.get("session")?.value;
// Preventing admin from deleting their own account
  if (parseInt(userId) === parseInt(sessionUser)) {
   return Response.json(
   { message: "You cannot delete your own account" },
   { status: 400 });}
// Deleting user along with their bookings and events
  await pool.query("DELETE FROM Users WHERE UserID = ?", [userId]);
 return Response.json({ message: "User deleted successfully" });
  } catch (error) {
  console.error("Error deleting user:", error);
  return Response.json(
  { message: "Internal server error" },
  { status: 500 });}}