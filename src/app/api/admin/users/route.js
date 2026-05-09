import pool from "@/lib/db";
import { cookies } from "next/headers";

// GET /api/admin/users - Returns list of all users
// Only admin can access this
export async function GET(request) {
  try {
    // Check if the logged in user is admin by reading their cookie
    const cookieStore = cookies();
    const userRole = cookieStore.get("role")?.value;

    // If not admin, kick them out
    if (userRole !== "admin") {
      return Response.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
  }
}
