import dbConnect from '@/lib/dbConnect';
import BudgetConfig from '@/lib/models/BudgetConfig';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

const getUserFromToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const userId = await getUserFromToken();
  console.log("post", userId)

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const budget = await BudgetConfig.create({ ...body, userId });
    return new Response(JSON.stringify(budget), { status: 201 });
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const userId = await getUserFromToken();
    console.log(userId)
    const budgets = await BudgetConfig.find({ userId });
    console.log(budgets)
    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
