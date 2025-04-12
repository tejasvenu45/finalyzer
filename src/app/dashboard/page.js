// app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f472b6', '#a78bfa', '#f87171'];

export default function BudgetDashboard() {
  const [budget, setBudget] = useState(null);
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
      console.error(err);
    }
  };

  const createBudget = async () => {
    try {
      await axios.post('/api/budget', {
        ...form,
        categories,
      });
      fetchBudget();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBudget = async () => {
    try {
      await axios.delete(`/api/budget/${budget._id}`);
      setBudget(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', percentage: '', limit: '' }]);
  };

  const removeCategory = index => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center text-primary">📊 Finalyzer - Your Smart Budget Manager</h1>

      {!budget ? (
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Create Your Budget Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="User ID" onChange={e => setForm({ ...form, userId: e.target.value })} />
            <Input placeholder="Total Budget" type="number" onChange={e => setForm({ ...form, totalBudget: e.target.value })} />
            <Input placeholder="Emergency Fund Goal" type="number" onChange={e => setForm({ ...form, emergencyFundGoal: e.target.value })} />
            <Input placeholder="Monthly Savings Target" type="number" onChange={e => setForm({ ...form, monthlySavingsTarget: e.target.value })} />
            <div className="space-y-4">
              <h3 className="font-semibold">Categories</h3>
              {categories.map((cat, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Input placeholder="Name" value={cat.name} onChange={e => handleCategoryChange(index, 'name', e.target.value)} />
                  <Input placeholder="%" value={cat.percentage} type="number" onChange={e => handleCategoryChange(index, 'percentage', e.target.value)} />
                  <Input placeholder="Limit ₹" value={cat.limit} type="number" onChange={e => handleCategoryChange(index, 'limit', e.target.value)} />
                  <Button variant="destructive" onClick={() => removeCategory(index)}>Remove</Button>
                </div>
              ))}
              <Button onClick={addCategory}>+ Add Category</Button>
            </div>
            <Separator />
            <Button className="w-full" onClick={createBudget}>Create Budget</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>💼 Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Total Budget:</strong> ₹{budget.totalBudget}</p>
              <p><strong>Emergency Fund Goal:</strong> ₹{budget.emergencyFundGoal}</p>
              <p><strong>Monthly Savings Target:</strong> ₹{budget.monthlySavingsTarget}</p>
              <p><strong>Strategy:</strong> {budget.strategy}</p>
              <Separator />
              <Button variant="destructive" onClick={deleteBudget}>Delete Budget</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Fund Distribution</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}