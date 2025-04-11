// app/api/budget/route.js - Get all budgets and create new budget

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/lib/models/Budget';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const budgets = await Budget.find({ userId });
    
    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate total budget
    if (!data.totalBudget || isNaN(data.totalBudget) || data.totalBudget <= 0) {
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
        if (!category.limit) {
          category.limit = (category.percentage / 100) * data.totalBudget;
        }
      }
      
      if (totalPercentage > 100) {
        return NextResponse.json({ error: 'Total percentage of categories cannot exceed 100%' }, { status: 400 });
      }
    }
    
    // Create the budget
    const newBudget = new Budget({
      ...data,
      userId
    });
    
    await newBudget.save();
    
    return NextResponse.json({ success: true, data: newBudget }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}