'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Enhanced color palette with purple as primary
const COLORS = ['#8b5cf6', '#60a5fa', '#f472b6', '#4ade80', '#facc15', '#f87171', '#a78bfa'];
const CATEGORY_COLORS = {
  'Housing': '#8b5cf6',
  'Food': '#60a5fa',
  'Transport': '#f472b6',
  'Utilities': '#4ade80',
  'Entertainment': '#facc15',
  'Healthcare': '#f87171',
  'Shopping': '#a78bfa',
  'Other': '#94a3b8',
};

export default function BudgetDashboard() {
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  
  const [form, setForm] = useState({
    userId: '',
    totalBudget: '',
    emergencyFundGoal: '',
    monthlySavingsTarget: '',
    strategy: 'Custom',
  });

  const [categories, setCategories] = useState([
    { name: '', percentage: '', limit: '' },
  ]);

  const fetchBudget = async () => {
    try {
      const res = await axios.get('/api/budget');
      setBudget(res.data[0]);
    } catch (err) {
      console.error('Error fetching budget:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      } else {
        console.error('Failed to fetch transactions:', data.message);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const createBudget = async () => {
    try {
      // Validate inputs
      if (!form.userId || !form.totalBudget) {
        throw new Error('User ID and Total Budget are required');
      }
      await axios.post('/api/budget', { ...form, categories });
      fetchBudget();
    } catch (err) {
      console.error('Error creating budget:', err);
    }
  };

  const deleteBudget = async () => {
    try {
      if (budget?._id) {
        await axios.delete(`/api/budget/${budget._id}`);
        setBudget(null);
        setBalance(0);
      }
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', percentage: '', limit: '' }]);
  };

  const removeCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || '#94a3b8';
  };

  const getTransactionTypeStyle = (type) => {
    return type === 'expense'
      ? 'bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium'
      : 'bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium';
  };

  useEffect(() => {
    fetchBudget();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (budget && transactions.length) {
      const totalExpense = transactions
        .filter(txn => txn.type === 'expense')
        .reduce((acc, txn) => acc + Number(txn.amount || 0), 0);
      setBalance(Number(budget.totalBudget || 0) - totalExpense);
    }
  }, [budget, transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">📊 Finalyzer - Your Smart Budget Manager</h1>

        {!budget ? (
          <Card className="p-6 shadow-lg border border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-600">Create Your Budget Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="User ID"
                className="border-purple-200 focus:border-purple-500"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              />
              <Input
                placeholder="Total Budget"
                type="number"
                className="border-purple-200 focus:border-purple-500"
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
              />
              <Input
                placeholder="Emergency Fund Goal"
                type="number"
                className="border-purple-200 focus:border-purple-500"
                value={form.emergencyFundGoal}
                onChange={(e) => setForm({ ...form, emergencyFundGoal: e.target.value })}
              />
              <Input
                placeholder="Monthly Savings Target"
                type="number"
                className="border-purple-200 focus:border-purple-500"
                value={form.monthlySavingsTarget}
                onChange={(e) => setForm({ ...form, monthlySavingsTarget: e.target.value })}
              />
              <div className="space-y-4">
                <h3 className="font-semibold text-purple-700">Categories</h3>
                {categories.map((cat, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      placeholder="Name"
                      value={cat.name}
                      className="border-purple-200 focus:border-purple-500"
                      onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="%"
                      type="number"
                      value={cat.percentage}
                      className="border-purple-2004040404 focus:border-purple-500"
                      onChange={(e) => handleCategoryChange(index, 'percentage', e.target.value)}
                    />
                    <Input
                      placeholder="Limit ₹"
                      type="number"
                      value={cat.limit}
                      className="border-purple-200 focus:border-purple-500"
                      onChange={(e) => handleCategoryChange(index, 'limit', e.target.value)}
                    />
                    <Button variant="destructive" onClick={() => removeCategory(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button onClick={addCategory} className="bg-purple-600 hover:bg-purple-700">
                  + Add Category
                </Button>
              </div>
              <Separator className="bg-purple-200" />
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={createBudget}>
                Create Budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-md border border-purple-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-purple-600 text-white rounded-t-md">
                  <CardTitle>
                    <h1 className="text-3xl text-center">💼 Budget Overview</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <p className="text-xl flex justify-between items-center">
                    <span className="font-medium">Total Budget:</span>
                    <span className="text-purple-600 font-bold">₹{budget.totalBudget}</span>
                  </p>
                  <p className="text-xl flex justify-between items-center">
                    <span className="font-medium">Emergency Fund Goal:</span>
                    <span className="text-purple-600 font-bold">₹{budget.emergencyFundGoal}</span>
                  </p>
                  <p className="text-xl flex justify-between items-center">
                    <span className="font-medium">Monthly Savings Target:</span>
                    <span className="text-purple-600 font-bold">₹{budget.monthlySavingsTarget}</span>
                  </p>
                  <p className="text-xl flex justify-between items-center">
                    <span className="font-medium">Strategy:</span>
                    <span className="text-purple-600 font-bold">{budget.strategy}</span>
                  </p>
                  <p className="text-2xl flex justify-between items-center mt-4 pt-4 border-t border-purple-100">
                    <span className="font-semibold">Balance Left:</span>
                    <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{balance}
                    </span>
                  </p>
                  <Separator className="bg-purple-200 my-4" />
                  <Button variant="destructive" className="w-full" onClick={deleteBudget}>
                    Delete Budget
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md border border-purple-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-purple-600 text-white rounded-t-md">
                  <CardTitle>
                    <h1 className="text-3xl text-center">📈 Fund Distribution</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-4">
                  <PieChart width={350} height={300}>
                    <Pie
                      data={budget.categories}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {budget.categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getCategoryColor(entry.name) || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md border border-purple-100">
              <CardHeader className="bg-purple-600 text-white rounded-t-md">
                <CardTitle>

                <h1 className="text-3xl text-center">🧾 Transaction History</h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto">
                  {transactions.length === 0 ? (
                    <p className="text-center p-6 text-gray-500">No transactions found.</p>
                  ) : (
                    <div className="divide-y divide-purple-100">
                      <div className="grid grid-cols-4 text-sm font-semibold bg-purple-50 p-3">
                        <span>Date</span>
                        <span>Type</span>
                        <span>Category</span>
                        <span>Amount</span>
                      </div>
                      {transactions.map((txn, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-4 p-3 items-center hover:bg-purple-50 transition-colors"
                        >
                          <span className="text-gray-700">{txn.date?.slice(0, 10) || 'N/A'}</span>
                          <span className={getTransactionTypeStyle(txn.type)}>{txn.type}</span>
                          <span>
                            <span className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getCategoryColor(txn.category) }}
                              ></span>
                              {txn.category}
                            </span>
                          </span>
                          <span
                            className={`font-medium ${
                              txn.type === 'expense' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {txn.type === 'expense' ? '-' : '+'} ₹{txn.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}