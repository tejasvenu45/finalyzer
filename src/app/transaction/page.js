"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated, user, authLoading } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);


useEffect(() => {
  if (!authLoading) {
    if (!isAuthenticated || !user) {
      router.push("/login");
    } else {
    //   fetchTransactions(); 
    }
  }
}, [authLoading, isAuthenticated, user]);


  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      } else {
        console.error("Failed to fetch transactions:", data.message);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = editingId ? "/api/transactions" : "/api/transactions";
    const method = editingId ? "PUT" : "POST";
    
    if (!user || !user._id) {
        console.error("User not ready");
        return;
    }

    const dataToSend = {
      ...formData,
      user: user._id,
    };

    if (editingId) {
      dataToSend._id = editingId;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();

      if (result.success) {
        // fetchTransactions();
        setFormData({
          type: "expense",
          amount: "",
          description: "",
          category: "",
          date: "",
        });
        setEditingId(null);
      } else {
        console.error("Error:", result.message);
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date?.substring(0, 10),
    });
    setEditingId(transaction._id);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border">
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          name="category"
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Transaction
        </button>
      </form>

      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li key={tx._id} className="border p-4 rounded">
            <div className="flex justify-between">
              <div>
                <strong>{tx.type.toUpperCase()}:</strong> ₹{tx.amount}
              </div>
              <div>{new Date(tx.date).toLocaleDateString()}</div>
            </div>
            <div className="text-sm text-gray-600">
              {tx.description} — {tx.category}
            </div>
            <button
              onClick={() => handleEdit(tx)}
              className="mt-2 text-blue-500 underline text-sm"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
