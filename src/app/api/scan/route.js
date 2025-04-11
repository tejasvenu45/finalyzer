import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Tesseract from "tesseract.js";

function parseTransactionText(text) {
  const amountMatch = text.match(/(?:Rs\.?|₹)\s?(\d+(?:\.\d{1,2})?)/i);
  const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/); 
  const storeMatch = text.match(/(?:Store|Merchant|Shop):?\s*(.*)/i);

  return {
    type: "expense",
    amount: amountMatch ? amountMatch[1] : "0",
    description: storeMatch ? storeMatch[1] : "Scanned Receipt",
    category: "Others",
    date: dateMatch ? new Date(dateMatch[0]) : new Date(),
  };
}

export async function POST(req) {
  try {
    const session = await getServerSession();

    if (!session?.user?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("receipt");

    if (!file || !file.name) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${file.name}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);

    await writeFile(filepath, buffer);

    const result = await Tesseract.recognize(filepath, "eng");
    const ocrText = result.data.text;

    const extracted = parseTransactionText(ocrText);

    await dbConnect();

    const transaction = new Transaction({
      ...extracted,
      user: new mongoose.Types.ObjectId(session.user._id),
    });

    await transaction.save();

    return NextResponse.json({ message: "Transaction added", transaction }, { status: 200 });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
