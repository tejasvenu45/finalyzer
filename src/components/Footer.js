"use client";

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-purple-200">
            <span className="text-white">📊 Finalyzer</span>
          </h3>
          <p className="text-sm text-purple-300 mt-1">
            Your Smart Budget Manager
          </p>
        </div>

        {/* Contact Information */}
        <address className="not-italic text-center md:text-right space-y-1 text-sm">
          <p className="text-purple-200">
            123 Budget Lane, Moneyville, MV 12345
          </p>
          <p>
            <a
              href="tel:+1234567890"
              className="text-purple-200 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              aria-label="Call Finalyzer at +1-234-567-890"
            >
              +1-234-567-890
            </a>
          </p>
          <p>
            <a
              href="mailto:support@finalyzer.app"
              className="text-purple-200 hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              aria-label="Email Finalyzer at support@finalyzer.app"
            >
              support@finalyzer.app
            </a>
          </p>
        </address>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4">
        <p className="text-sm text-purple-300">
          © {new Date().getFullYear()} Finalyzer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}