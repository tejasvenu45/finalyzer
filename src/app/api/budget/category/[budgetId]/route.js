import dbConnect from '@/lib/dbConnect';
import BudgetConfig from '@/lib/models/BudgetConfig ';
export async function POST(req, { params }) {
  await dbConnect();
  const newCategory = await req.json();

  try {
    const budget = await BudgetConfig.findById(params.budgetId);
    if (!budget) return new Response('Budget Not Found', { status: 404 });

    budget.categories.push(newCategory);
    await budget.save();

    return new Response(JSON.stringify(budget), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { categoryId, updatedCategory } = await req.json();

  try {
    const budget = await BudgetConfig.findById(params.budgetId);
    if (!budget) return new Response('Budget Not Found', { status: 404 });

    const category = budget.categories.id(categoryId);
    if (!category) return new Response('Category Not Found', { status: 404 });

    Object.assign(category, updatedCategory);
    await budget.save();

    return new Response(JSON.stringify(budget), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { categoryId } = await req.json();

  try {
    const budget = await BudgetConfig.findById(params.budgetId);
    if (!budget) return new Response('Budget Not Found', { status: 404 });

    budget.categories = budget.categories.filter(cat => cat._id.toString() !== categoryId);
    await budget.save();

    return new Response(JSON.stringify(budget), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
