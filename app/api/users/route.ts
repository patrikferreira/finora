import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, clientHashed } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const storedPassword = clientHashed ? password : await bcrypt.hash(password, 10);

    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          name,
          email,
          password: storedPassword,
          currency: "USD",
          language: "en",
        },
      ])
      .select("id, name, email, currency, language")
      .maybeSingle();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User registered successfully.", user: insertedData },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
