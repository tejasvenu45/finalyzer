"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated, user, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [cat, setCat] = useState([])

  const fetchCat = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCat(res.data.data || []); 
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCat([]);
    }
  };
  

  useEffect(() => {
    const init = async () => {
      if (!authLoading) {
        if (!isAuthenticated || !user) {
          router.push("/login");
        } else {
          await fetchCat();
        }
      }
    };
    init();
  }, [authLoading, isAuthenticated, user, router]);  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user || !user._id) {
      console.error("User not ready");
      setIsLoading(false);
      return;
    }

    const endpoint = editingId ? "/api/transactions" : "/api/transactions";
    const method = editingId ? "PUT" : "POST";

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
        alert(result.message || "Failed to save transaction");
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("An error occurred while saving the transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg border border-purple-100 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-purple-600 text-white rounded-t-md">
          <CardTitle className="text-4xl font-bold text-center">
            📝 Add New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Transaction Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border-purple-200 focus:border-purple-500 rounded-md p-2 text-center bg-white disabled:opacity-50"
                aria-describedby="type-error"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Amount (₹)
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="border-purple-200 focus:border-purple-500 text-center"
                aria-describedby="amount-error"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Description
              </label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                className="border-purple-200 focus:border-purple-500 text-center"
                aria-describedby="description-error"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border-purple-200 focus:border-purple-500 rounded-md p-2 text-center bg-white disabled:opacity-50"
                aria-describedby="category-error"
              >
                <option value="" disabled>
                  {cat.length === 0 ? "No categories available" : "Select a category"}
                </option>
                {Array.isArray(cat) && cat.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Date
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="border-purple-200 focus:border-purple-500 text-center"
                aria-describedby="date-error"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
            >
              {editingId ? "Update" : "Add"} Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}