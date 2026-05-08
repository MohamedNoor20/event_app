import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      firstname,
      lastname,
      username,
      password,
      dob,
      role,
    } = await request.json();

    // 1. Validate input
    if (!firstname || !lastname || !username || !password || !dob) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // 2. Check if user exists
    const [existing] = await pool.query(
      "SELECT * FROM Users WHERE Username = ?",
      [username]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return NextResponse.json(
        { message: "You must be at least 16 years old" },
        { status: 400 }
      );
    }

    
    await pool.query(
      `INSERT INTO Users (Firstname, Lastname, Username, Password, DOB, Role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, username, hashedPassword, dob, role]
    );

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Regestration Error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}