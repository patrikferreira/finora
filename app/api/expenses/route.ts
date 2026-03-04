import { NextRequest } from "next/server";
import { supabaseAdmin } from "../users/route";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
      });
    }

    const { data: expenses, error } = await supabaseAdmin
      .from("expenses")
      .select("*")
      .eq("userId", userId);

    if (error) {
      console.error("Supabase select error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: error }),
        { status: 500 }
      );
    }

    const { data: cycles, error: cyclesError } = await supabaseAdmin
      .from("cycles")
      .select("*");

    if (cyclesError) {
      console.error("Cycles select error:", cyclesError);
    }

    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from("categories")
      .select("*");

    if (categoriesError) {
      console.error("Categories select error:", categoriesError);
    }

    const expensesWithCyclesAndCategories = expenses?.map((expense) => {
      const cycle = cycles?.find((c) => c.id === expense.cycle);
      const category = categories?.find((cat) => cat.id === expense.category);
      return {
        ...expense,
        cycle: cycle?.name || "",
        category: category?.name || "",
      };
    });

    return new Response(
      JSON.stringify({ expenses: expensesWithCyclesAndCategories }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { description, amount, category, cycle, userId } = await req.json();

    if (!description || !amount || !category || !cycle || !userId) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const { data: existingExpense, error: checkError } = await supabaseAdmin
      .from("expenses")
      .select("id, userId")
      .eq("userId", userId)
      .ilike("description", description)
      .maybeSingle();

    if (checkError) {
      console.error("Expense check error:", checkError);
      return new Response(
        JSON.stringify({ error: "Database error", details: checkError }),
        { status: 500 }
      );
    }

    if (existingExpense) {
      return new Response(
        JSON.stringify({ error: "Expense with this description already exists" }),
        { status: 409 }
      );
    }

    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("name", category)
      .single();

    if (categoryError || !categoryData) {
      console.error("Category lookup error:", categoryError);
      return new Response(
        JSON.stringify({ error: `Invalid category: ${category}` }),
        { status: 400 }
      );
    }

    const { data: cycleData, error: cycleError } = await supabaseAdmin
      .from("cycles")
      .select("id")
      .eq("name", cycle)
      .single();

    if (cycleError || !cycleData) {
      console.error("Cycle lookup error:", cycleError);
      return new Response(
        JSON.stringify({ error: `Invalid cycle: ${cycle}` }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .insert([
        {
          description,
          amount,
          category: categoryData.id,
          cycle: cycleData.id,
          userId,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: error }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ expense: data }), { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
