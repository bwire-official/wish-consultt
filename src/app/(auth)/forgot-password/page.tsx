"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ArrowRight, Sun, Moon, Home } from "lucide-react";
import { useTheme } from "next-themes";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Password reset functionality will be added later
    console.log("Reset password for:", identifier);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg">
            <Home className="h-5 w-5" /> Wish Consult
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <div className="rounded-2xl border border-white/20 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 shadow-xl backdrop-blur-md p-8 md:p-10 space-y-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reset your password</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              {submitted 
                ? "Check your email for reset instructions" 
                : "Enter your email or username to receive reset instructions"}
            </p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email or Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your email or username"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending instructions..." : "Send reset instructions"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Remember your password? </span>
                <Link 
                  href="/login"
                  className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Sign in
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                <p className="text-teal-700 dark:text-teal-300">
                  We&apos;ve sent password reset instructions to your email address.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Return to sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
            By using this form, you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/privacy" className="underline">policies</Link>.
          </div>
        </div>
      </div>
    </div>
  );
} 