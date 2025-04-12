import mongoose from "mongoose";

    const BudgetConfig = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    totalBudget: {
        type: Number,
        required: true,
    },

    categories: [
        {
        name: {
            type: String,
            required: true, 
        },
        percentage: {
            type: Number,
            required: true, 
            max: 100,
        },
        limit: {
            type: Number,
            required: true,
        },
        },
    ],

    emergencyFundGoal: {
        type: Number,
        default: 0,
    },

    monthlySavingsTarget: {
        type: Number,
        default: 0,
    },

    strategy: {
        type: String,
        enum: ['50/30/20', 'Zero-based', 'Envelope', 'Custom'],
        default: 'Custom',
    },

    alertsEnabled: {
        type: Boolean,
        default: true,
    },

    //   alertThreshold: {
    //     type: Number,
    //     default: 90,
    //   },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

export default mongoose.models.BudgetConfig || mongoose.model('BudgetConfig', BudgetConfig);
