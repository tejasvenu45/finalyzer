import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: String,
    required: [true, 'Amount is required'],
    minlength: [1, 'Amount is required'],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    minlength: [1, 'Category is required'],
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringInterval: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
  },
});

transactionSchema.pre('validate', function (next) {
  if (this.isRecurring && !this.recurringInterval) {
    this.invalidate(
      'recurringInterval',
      'Recurring interval is required for recurring transactions'
    );
  }
  next();
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
