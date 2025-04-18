//api/scan/route.js:
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Transaction from "@/lib/models/Transaction";
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

export async function POST(req) {
  try {
    await dbConnect();

    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("DATA", data)

    if (!data.amount) {
      return NextResponse.json({ success: false, message: "Invalid transaction data" }, { status: 400 });
    }

    const transaction = new Transaction({ ...data, type: "expense", user: userId });
    await transaction.save();

    return NextResponse.json({ success: true, data: transaction });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const userId = await getUserFromToken();
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
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}