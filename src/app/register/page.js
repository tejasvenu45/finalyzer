"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    occupation: "",
    monthlyIncome: "",
    savingsGoal: "",
    preferredBudgetCategories: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const categories = prev.preferredBudgetCategories;
        return {
          ...prev,
          preferredBudgetCategories: checked
            ? [...categories, value]
            : categories.filter((cat) => cat !== value),
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameWords = formData.name.trim().split(/\s+/);
    if (nameWords.length < 1 || nameWords.length > 2) {
      alert("Please enter a first name and optional last name");
      return;
    }

    if (!formData.monthlyIncome) {
      alert("Monthly Income is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age) || undefined,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          savingsGoal: parseFloat(formData.savingsGoal) || 0,
        }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg border border-purple-100 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-purple-600 text-white rounded-t-md">
          <CardTitle className="text-4xl font-bold text-center">
            📝 Sign Up for Finalyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "********" },
              { label: "Age", name: "age", type: "number", min: 13, placeholder: "18" },
              { label: "Occupation", name: "occupation", type: "text", placeholder: "e.g., Student" },
              { label: "Monthly Income", name: "monthlyIncome", type: "number", placeholder: "50000" },
              { label: "Savings Goal", name: "savingsGoal", type: "number", placeholder: "10000" },
            ].map(({ label, name, type, placeholder, ...rest }) => (
              <div key={name} className="space-y-2">
                <label
                  htmlFor={name}
                  className="block text-purple-700 text-lg font-medium text-center"
                >
                  {label}
                </label>
                <Input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "occupation" && name !== "savingsGoal"}
                  disabled={isLoading}
                  placeholder={placeholder}
                  className="border-purple-200 focus:border-purple-500 text-center"
                  aria-describedby={`${name}-error`}
                  {...rest}
                />
              </div>
            ))}

            <Separator className="bg-purple-200" />

            <div className="space-y-2">
              <label className="block text-purple-700 text-lg font-medium text-center">
                Preferred Budget Categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Essentials", "Entertainment", "Savings", "Investments"].map((category) => (
                  <label key={category} className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="preferredBudgetCategories"
                      value={category}
                      checked={formData.preferredBudgetCategories.includes(category)}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-200 rounded"
                      aria-label={`Select ${category} category`}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-purple-200" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}