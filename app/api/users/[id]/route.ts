import { supabaseAdmin } from "../route";
import { NextResponse } from "next/server";

const ALLOWED_FIELDS = ["name", "email", "currency", "language"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updateData: Record<string, string> = {};
    for (const field of ALLOWED_FIELDS) {
      if (
        body[field] !== undefined &&
        body[field] !== null &&
        body[field] !== ""
      ) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error:
            "At least one field (name, email, currency, or language) is required.",
        },
        { status: 400 }
      );
    }

    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select("id, name, email, currency, language")
      .maybeSingle();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
