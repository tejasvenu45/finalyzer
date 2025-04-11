// page.js:
"use client";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Finalyzer!
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        Your one stop app for managing your finances
      </p>
      <a
        href="/about"
        className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
      >
        Get Started
      </a>
    </main>
  );
}