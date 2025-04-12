import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Transaction from "@/lib/models/Transaction";
import BudgetConfig from "@/lib/models/BudgetConfig";
import dbConnect from "@/lib/dbConnect";

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

export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}


export async function POST(req) {
  try {
    await dbConnect();

    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const transaction = new Transaction({ ...data, user: userId });
    await transaction.save();

    const budget = await BudgetConfig.findOne({ userId: userId });

    if (!budget) {
      return NextResponse.json({ success: false, message: "Budget configuration not found" }, { status: 404 });
    }

    const newTotalBudget = (data.type === "expense") ? budget.totalBudget - data.amount : budget.totalBudget + data.amount;

    await BudgetConfig.findOneAndUpdate({ userId: userId }, { $set: { totalBudget: newTotalBudget } });

    return NextResponse.json({ success: true, data: transaction });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const userId = getUserFromToken();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    if (!data._id) {
      return NextResponse.json({ success: false, message: "_id is required for update" }, { status: 400 });
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: data._id, user: userId },
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
