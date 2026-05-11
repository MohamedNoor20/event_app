import pool from "@/lib/db";
import { cookies } from "next/headers";

// Update user role
export async function PUT(request, { params }) {
  try {
    const { userId } = await params;
    const { role } = await request.json();

    const cookieStore = await cookies();
    const userRole = cookieStore.get("role")?.value;

    if (userRole !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    await pool.query("UPDATE Users SET Role = ? WHERE UserID = ?", [role, userId]);

    return Response.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    const { userId } = await params;

    const cookieStore = await cookies();
    const userRole = cookieStore.get("role")?.value;
    const sessionUser = cookieStore.get("session")?.value;

    if (userRole !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === parseInt(sessionUser)) {
      return Response.json(
        { message: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete related bookings first (foreign key constraint)
    await pool.query("DELETE FROM Book WHERE UserID = ?", [userId]);
    
    // Delete user
    await pool.query("DELETE FROM Users WHERE UserID = ?", [userId]);

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}