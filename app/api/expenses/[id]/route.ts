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
      .from("expenses")
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
      return new Response(JSON.stringify({ error: "Expense not found" }), {
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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { description, amount, category, cycle, userId } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
      });
    }

    if (description && userId) {
      const { data: existingExpense } = await supabaseAdmin
        .from("expenses")
        .select("id")
        .eq("userId", userId)
        .eq("description", description)
        .neq("id", id)
        .maybeSingle();

      if (existingExpense) {
        return new Response(
          JSON.stringify({ error: "Expense with this description already exists" }),
          { status: 409 }
        );
      }
    }

    let categoryId = category;
    if (category && typeof category === "string") {
      const { data: categoryData } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("name", category)
        .single();
      categoryId = categoryData?.id || null;
    }

    let cycleId = cycle;
    if (cycle && typeof cycle === "string") {
      const { data: cycleData } = await supabaseAdmin
        .from("cycles")
        .select("id")
        .eq("name", cycle)
        .single();
      cycleId = cycleData?.id || null;
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .update({ description, amount, category: categoryId, cycle: cycleId })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: error }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Expense not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ expense: data[0] }), { status: 200 });
  } catch (err) {
    console.error("API Error:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
