"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsAuthenticated(false);
        router.push("/login");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <header className="bg-background shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 items-center gap-2">
          <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img
              className="h-8 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="Finalyzer logo"
            />
            <span className="text-purple-600 text-4xl font-bold">FINALYZER</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {isAuthenticated ? (
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/chat"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Financial Chatbot
            </a>
            <a
              href="/scan"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Scan Receipt
            </a>
            <a
              href="/transaction"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Add Transaction
            </a>
            <a
              href="/dashboard"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2"
              aria-label="Log out of Finalyzer"
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              Log out
            </button>
            <UserIcon className="w-6 h-6 text-purple-600" />
          </div>
        ) : (
          <div className="hidden gap-2 lg:flex lg:flex-1 lg:justify-end">
            <a
              href="/login"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Log in <span aria-hidden="true">→</span>
            </a>
            <a
              href="/register"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Register <span aria-hidden="true">→</span>
            </a>
            
            
          </div>
        )}
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <img
                className="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Finalyzer logo"
              />
              <span className="text-purple-600 text-lg font-semibold">
                Finalyzer
              </span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-300/10">
              {isAuthenticated ? (
                <div className="space-y-2 py-6">
                  <a
                    href="/chat"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Financial Chatbot
                  </a>
                  <a
                    href="/scan"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Scan Receipt
                  </a>
                  <a
                    href="/transaction"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Add Transaction
                  </a>
                  <a
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100 w-full text-left"
                    aria-label="Log out of Finalyzer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <a
                    href="/login"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Log in
                  </a>
                  <a
                    href="/register"
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}