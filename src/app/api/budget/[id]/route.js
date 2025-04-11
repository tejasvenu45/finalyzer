// app/api/budget/[id]/route.js - Get, update, and delete a specific budget

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
    
    return NextResponse.json({ success: true, data: budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { id } = params;
    const data = await request.json();
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }
    
    // Validate total budget
    if (data.totalBudget && (isNaN(data.totalBudget) || data.totalBudget <= 0)) {
      return NextResponse.json({ error: 'Total budget must be a positive number' }, { status: 400 });
    }
    
    // Validate categories if provided
    if (data.categories && data.categories.length > 0) {
      let totalPercentage = 0;
      
      for (const category of data.categories) {
        if (!category.name || category.name.trim() === '') {
          return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }
        
        if (isNaN(category.percentage) || category.percentage <= 0 || category.percentage > 100) {
          return NextResponse.json({ error: 'Category percentage must be between 0 and 100' }, { status: 400 });
        }
        
        totalPercentage += category.percentage;
        
        // Calculate limit based on percentage if not provided
        if (!category.limit && data.totalBudget) {
          category.limit = (category.percentage / 100) * data.totalBudget;
        }
      }
      
      if (totalPercentage > 100) {
        return NextResponse.json({ error: 'Total percentage of categories cannot exceed 100%' }, { status: 400 });
      }
    }
    
    // Find and update the budget
    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: budget });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    
    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}