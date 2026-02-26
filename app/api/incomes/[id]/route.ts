import { supabaseAdmin } from "../../users/route";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("incomes")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase delete error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: error }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Income not found" }), {
        status: 404,
      });
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("API Error:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
