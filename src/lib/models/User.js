import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    min: 13,
  },

  occupation: {
    type: String,
    default: "",
  },

  monthlyIncome: {
    type: Number,
    required: true,
  },

  savingsGoal: {
    type: Number,
    default: 0,
  },

  preferredBudgetCategories: {
    type: [String],
    default: ["Essentials", "Entertainment", "Savings", "Investments"],
  },

  isPremiumUser: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  points: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastRewardCheck: {
    type: String, // e.g., "2024-01"
    default: null,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);