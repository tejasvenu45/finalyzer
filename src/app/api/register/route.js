import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { name, email, password, monthlyIncome } = body;

  if (!name || !email || !password || !monthlyIncome) {
    return new Response(JSON.stringify({ error: "All fields required." }), { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists." }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...body,
    password: hashedPassword,
  });

  return new Response(JSON.stringify({ message: "User registered successfully." }), { status: 201 });
}
