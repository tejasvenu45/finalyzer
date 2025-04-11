"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
    <div className="min-h-full bg-black flex items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 bg-black text-white border-4 border-white rounded-2xl shadow-sm shadow-green-500 p-10"
      >
        <h2 className="text-5xl font-bold text-[#329D36] text-center mb-8">SIGN UP</h2>

        {[
          { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Age", name: "age", type: "number", min: 13 },
          { label: "Occupation", name: "occupation", type: "text", placeholder: "e.g. Student" },
          { label: "Monthly Income", name: "monthlyIncome", type: "number" },
          { label: "Savings Goal", name: "savingsGoal", type: "number" },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name} className="mb-5">
            <label htmlFor={name} className="block text-xl mb-1">{label}</label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={name !== "occupation" && name !== "savingsGoal"}
              className="w-full bg-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#329D36]"
              {...rest}
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-xl mb-2">Preferred Budget Categories</label>
          {["Essentials", "Entertainment", "Savings", "Investments"].map((category) => (
            <label key={category} className="block text-sm">
              <input
                type="checkbox"
                name="preferredBudgetCategories"
                value={category}
                checked={formData.preferredBudgetCategories.includes(category)}
                onChange={handleChange}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#329D36] text-2xl font-bold text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
