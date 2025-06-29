"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, ArrowRight, Sun, Moon, Home, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';
import { requestPasswordReset } from '../../auth/actions/actions';

function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();

  useEffect(() => { 
    // Check for error message in URL params
    const message = searchParams.get('message');
    if (message) {
      setError(message);
    }
  }, [searchParams]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set('identity', identifier);
      
      await requestPasswordReset(formData);
      // The server action will handle the redirect
    } catch (error) {
      console.error('Error sending reset code:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg">
            <Home className="h-5 w-5" /> Wish Consult
          </Link>
        </div>
        
        {/* Glassmorphism Card */}
        <div className="relative">
          {/* Background blur circles */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-300 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          {/* Main card */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div></div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Reset your password
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                Enter your email or username to receive a 6-digit verification code
              </p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="identifier"
                    name="identity"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError(""); // Clear error when user types
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="Enter your email or username"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <ButtonLoader />
                    Sending code...
                  </>
                ) : (
                  <>
                    Send verification code
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Remember your password? </span>
                <Link 
                  href="/login"
                  className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
            
            <div className="text-xs text-center text-slate-500 dark:text-slate-400">
              By using this form, you agree to our <Link href="/terms" className="underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">terms</Link> and <Link href="/privacy" className="underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">policies</Link>.
            </div>
            
            {/* Secure Login Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure password reset with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-4 py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
} 