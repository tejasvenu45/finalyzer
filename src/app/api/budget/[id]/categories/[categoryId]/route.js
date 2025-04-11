// app/api/budget/[id]/categories/[categoryId]/route.js - Update and delete a specific category

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

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { id, categoryId } = params;
    const categoryData = await request.json();
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }
    
    // Validate category data
    if (categoryData.name !== undefined && categoryData.name.trim() === '') {
      return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
    }
    
    if (categoryData.percentage !== undefined && 
        (isNaN(categoryData.percentage) || 
         categoryData.percentage <= 0 || 
         categoryData.percentage > 100)) {
      return NextResponse.json({ error: 'Category percentage must be between 0 and 100' }, { status: 400 });
    }
    
    // Find the budget
    const budget = await Budget.findOne({ _id: id, userId });
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    // Find the category
    const categoryIndex = budget.categories.findIndex(cat => cat._id.toString() === categoryId);
    
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if updating percentage would exceed 100%
    if (categoryData.percentage !== undefined) {
      const currentTotalPercentage = budget.categories.reduce((sum, cat, index) => {
        return index === categoryIndex ? sum : sum + cat.percentage;
      }, 0);
      
      if (currentTotalPercentage + categoryData.percentage > 100) {
        return NextResponse.json({ 
          error: 'Updating this category would exceed 100% of budget allocation',
          currentAllocation: currentTotalPercentage
        }, { status: 400 });
      }
      
      // Recalculate limit if percentage is updated
      if (categoryData.limit === undefined) {
        categoryData.limit = (categoryData.percentage / 100) * budget.totalBudget;
      }
    }
    
    // Update category
    Object.assign(budget.categories[categoryIndex], categoryData);
    await budget.save();
    
    return NextResponse.json({ 
      success: true, 
      data: budget.categories[categoryIndex],
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
    const { id, categoryId } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }
    
    // Find the budget
    const budget = await Budget.findOne({ _id: id, userId });
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    // Find the category
    const categoryIndex = budget.categories.findIndex(cat => cat._id.toString() === categoryId);
    
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Remove category
    budget.categories.splice(categoryIndex, 1);
    await budget.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}