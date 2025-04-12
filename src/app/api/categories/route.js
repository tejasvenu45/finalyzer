import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import BudgetConfig from "@/lib/models/BudgetConfig";
import dbConnect from "@/lib/dbConnect";

const getUserFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
};

export async function GET() {
  try {
    await dbConnect();

    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const budget = await BudgetConfig.findOne({ userId });
    console.log(userId)
    console.log(budget)

    if (!budget || !budget.categories?.length) {
      return NextResponse.json({ success: true, data: [] });
    }

    const categories = budget.categories.map((cat) => cat.name);
    console.log(categories)

    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error("Error in GET /api/categories:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
