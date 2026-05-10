import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // validation
    if (!username || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Look up user by Username
    const [rows] = await pool.query(
      "SELECT * FROM Users WHERE Username = ?",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return Response.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare  password against the bcrypt hash stored in DB
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return Response.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }


    const res = NextResponse.json(
      {
        role: user.Role,
        userID: user.UserID
      },
      { status: 200 }
    );

    res.cookies.set("session", user.UserID.toString(), {
      path: "/",
      maxAge: 86400,
      sameSite: "strict",
    });

    res.cookies.set("role", user.Role.toLowerCase(), {
      path: "/",
      maxAge: 86400,
      sameSite: "strict",
    });

    return res;
    
  } catch (err) {
    console.error("Login error:", err);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}