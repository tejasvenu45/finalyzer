import dbConnect from '@/lib/dbConnect';
import BudgetConfig from '@/lib/models/BudgetConfig';

export async function GET(_, { params }) {
  await dbConnect();
  try {
    const budget = await BudgetConfig.findById(params.id);
    if (!budget) return new Response('Not Found', { status: 404 });
    return new Response(JSON.stringify(budget), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  try {
    const updated = await BudgetConfig.findByIdAndUpdate(params.id, body, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(_, { params }) {
  await dbConnect();
  try {
    await BudgetConfig.findByIdAndDelete(params.id);
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
