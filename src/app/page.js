'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BarChart, Wallet, Trophy } from 'lucide-react';
import { Metadata } from 'next';

export const metadata = {
  title: 'Finalyzer - Your AI Financial Partner',
  description: 'Personalized budgeting, smart expense tracking, and rewards for saving!',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 flex flex-col gap-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center flex flex-col gap-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600">Welcome to Finalyzer</h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
          Your AI-powered financial partner — get personalized budgeting, smart expense tracking, and real rewards based on the money you save.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/register">
            <Button size="lg">Signup</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Login</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" />
            <CardTitle className="text-lg">AI Financial Advice</CardTitle>
          </CardHeader>
          <CardContent>
            Let our AI guide your money decisions with tailored insights and tips to optimize your finances.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Wallet className="text-indigo-600" />
            <CardTitle className="text-lg">Expense Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            Track your daily, weekly, and monthly expenses with ease and get alerts when you&apos;re overspending.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <BarChart className="text-indigo-600" />
            <CardTitle className="text-lg">Smart Budgeting</CardTitle>
          </CardHeader>
          <CardContent>
            Get a personalized budget that adjusts with your habits and helps you save better.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Trophy className="text-indigo-600" />
            <CardTitle className="text-lg">Rewards for Saving</CardTitle>
          </CardHeader>
          <CardContent>
            Earn points and unlock perks every time you hit a savings milestone. Money-saving has never been more fun.
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center mt-12">
        <h2 className="text-3xl font-semibold mb-4">Start your smarter money journey today.</h2>
        <Link href="/register">
          <Button size="lg">Join FinAdvisor</Button>
        </Link>
      </section>
    </div>
  );
}
