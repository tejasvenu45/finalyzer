"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg border border-purple-100 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-purple-600 text-white rounded-t-md">
          <CardTitle className="text-4xl font-bold text-center">
            🔐 Login to Finalyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter your email"
                className="border-purple-200 focus:border-purple-500 text-center"
                aria-describedby="email-error"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-purple-700 text-lg font-medium text-center"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                className="border-purple-200 focus:border-purple-500 text-center"
                aria-describedby="password-error"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 rounded-md flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-purple-200" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}