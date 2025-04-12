
import { NextResponse } from "next/server";

export async function POST(req) {
  const { budget, transactions } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  const recentTxns = transactions.slice(-5);

  const prompt = `
You are an AI financial advisor. Analyze this user's financial behavior and provide helpful insights and suggestions in 150 to 200 words.

Here is their current budget:
- Total Budget: ₹${budget.totalBudget}
- Emergency Fund Goal: ₹${budget.emergencyFundGoal}
- Monthly Savings Target: ₹${budget.monthlySavingsTarget}
- Strategy: ${budget.strategy}
- Categories: ${budget.categories.map(c => `${c.name} (${c.percentage}%, Limit: ₹${c.limit})`).join(", ")}

Here are the user's 5 most recent transactions:
${recentTxns.map((txn, idx) => `${idx + 1}. [${txn.date}] ₹${txn.amount} - ${txn.type} (${txn.category})`).join("\n")}

Please provide practical advice to help the user manage money better, improve savings, and avoid overspending.
`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    const message = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ success: false, error: "AI analysis failed" }, { status: 500 });
  }
}
