import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../users/route";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserAuthenticated } from "@/app/AppTypes";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        sub: string;
        email: string;
        name: string;
      };

      const { data: user, error } = await supabaseAdmin
        .from("users")
        .select("id, email, name, currency, language")
        .eq("id", decoded.sub)
        .maybeSingle();

      if (error || !user) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        language: user.language,
      };

      return NextResponse.json({ user: safeUser }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, password, currency, language")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase select error:", error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
      });
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401 }
      );
    }

    const u = user as User;
    const isMatch = await bcrypt.compare(password, u.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        sub: u.id,
        email: u.email,
        name: u.name,
        currency: u.currency,
        language: u.language,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    const safeUser: UserAuthenticated = {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      language: user.language,
    };

    const res = NextResponse.json({ user: safeUser }, { status: 200 });
    res.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err) {
    console.error("Auth POST error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    res.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
