import dbConnect from '@/lib/dbConnect';
import BudgetConfig from '@/lib/models/BudgetConfig ';

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const budget = await BudgetConfig.create(body);
    return new Response(JSON.stringify(budget), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const budgets = await BudgetConfig.find({});
    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
