import pool from "@/lib/db";

function getUserFromCookie(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = {};
  cookieHeader.split("; ").forEach(cookie => {
    const [key, value] = cookie.split("=");
    cookies[key] = value;
  });

  if (cookies.session) {
    return {
      UserID: parseInt(cookies.session),
      Role: cookies.role
    };
  }

  return null;
}

export async function GET(request) {
  const user = getUserFromCookie(request);

  if (!user) {
    return Response.json({ success: false }, { status: 401 });
  }

  const [rows] = await pool.query(
    "SELECT UserID, Firstname, Lastname, Username, Role FROM Users WHERE UserID = ?",
    [user.UserID]
  );

  return Response.json({
    success: true,
    user: rows[0],
  });
}