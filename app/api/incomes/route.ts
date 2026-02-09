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

    const { data: incomes, error } = await supabaseAdmin
      .from("incomes")
      .select("*")
      .eq("userId", userId);

    if (error) {
      console.error("Supabase select error:", error);
      return new Response(
        JSON.stringify({ error: "Database error", details: error }),
        {
          status: 500,
        }
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

    const incomesWithCyclesAndCategories = incomes?.map((income) => {
      const cycle = cycles?.find((c) => c.id === income.cycle);
      const category = categories?.find((cat) => cat.id === income.category);
      return {
        ...income,
        cycle: cycle?.description || income.cycle,
        category: category?.description || income.category,
      };
    });

    return new Response(
      JSON.stringify({ incomes: incomesWithCyclesAndCategories }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
