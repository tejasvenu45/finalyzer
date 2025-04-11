"use client";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png"
        alt="Finance Illustration"
        className="w-32 h-32 mb-6"
      />
      <h1 className="text-4xl font-bold text-primary mb-4">
        Welcome to Finalyzer!
      </h1>
      <p className="text-lg text-secondary mb-6 text-center max-w-xl">
        Your one stop app for managing your finances
      </p>
      <a
        href="/about"
        className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
      >
        Get Started
      </a>
    </main>
  );
}
