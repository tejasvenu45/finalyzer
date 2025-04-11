// app/api/budget/[id]/categories/route.js - Get all categories and add new category

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/lib/models/Budget';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }
    
    const budget = await Budget.findOne({ _id: id, userId });
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: budget.categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { id } = params;
    const categoryData = await request.json();
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }
    
    // Validate category data
    if (!categoryData.name || categoryData.name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    
    if (isNaN(categoryData.percentage) || categoryData.percentage <= 0 || categoryData.percentage > 100) {
      return NextResponse.json({ error: 'Category percentage must be between 0 and 100' }, { status: 400 });
    }
    
    // Find the budget
    const budget = await Budget.findOne({ _id: id, userId });
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    // Check if adding this category would exceed 100%
    const currentTotalPercentage = budget.categories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (currentTotalPercentage + categoryData.percentage > 100) {
      return NextResponse.json({ 
        error: 'Adding this category would exceed 100% of budget allocation',
        currentAllocation: currentTotalPercentage
      }, { status: 400 });
    }
    
    // Calculate limit if not provided
    if (!categoryData.limit) {
      categoryData.limit = (categoryData.percentage / 100) * budget.totalBudget;
    }
    
    // Add category to budget
    budget.categories.push(categoryData);
    await budget.save();
    
    return NextResponse.json({ 
      success: true, 
      data: categoryData,
      message: 'Category added successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}