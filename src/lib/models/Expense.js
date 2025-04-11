import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
    enum: ['Essentials', 'Entertainment', 'Savings', 'Investments', 'Other'],
    default: 'Other',
  },

  description: {
    type: String,
    default: "",
  },

  date: {
    type: Date,
    required: true, // store as actual date object for daily visualizations
  },
});

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
