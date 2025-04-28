"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  UserIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../context/AuthContext";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];

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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-background shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1 items-center gap-2">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img
              className="h-8 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="Finalyzer logo"
            />
            <span className="text-purple-600 text-4xl font-bold">
              FINALYZER
            </span>
          </Link>
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
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
            >
              Financial Chatbot
            </Link>
            <Link
              href="/scan"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
            >
              Scan Receipt
            </Link>
            <Link
              href="/transaction"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
            >
              Add Transaction
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/rewards"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Rewards
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2"
              aria-label="Log out of Finalyzer"
            >
              Log out
            </button>
            <UserIcon className="w-6 h-6 text-purple-600" />
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/login"
              className="rounded-2xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <img
                className="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Finalyzer logo"
              />
              <span className="text-white text-lg font-semibold">
                Finalyzer
              </span>
            </Link>
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
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-100">
                    Product
                    <ChevronDownIcon className="h-5 w-5" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {products.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Marketplace
                </Link>
                <Link
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Company
                </Link>
                <Link
                  href="/rewards"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-purple-600 hover:bg-purple-100"
                >
                  🎁 Rewards
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
