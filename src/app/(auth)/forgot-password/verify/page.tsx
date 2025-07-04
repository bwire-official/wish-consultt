"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Sun, Moon, Home, ArrowLeft, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';
import { verifyPasswordResetCode, requestPasswordReset } from '../../../auth/actions/actions';

// Utility to mask email for privacy - more professional approach
function maskEmail(email: string) {
  if (!email || !email.includes('@')) {
    return email; // Return as-is if not a valid email format
  }
  
  const [user, domain] = email.split('@');
  
  if (!user || !domain) {
    return email; // Return as-is if email is malformed
  }
  
  // For username part: show first 2 characters and last character, mask the middle
  let maskedUser;
  if (user.length <= 3) {
    maskedUser = user; // Show full username if 3 characters or less
  } else if (user.length <= 5) {
    maskedUser = user[0] + '*'.repeat(user.length - 2) + user[user.length - 1]; // Show first and last
  } else {
    maskedUser = user.slice(0, 2) + '*'.repeat(Math.max(user.length - 4, 1)) + user.slice(-2); // Show first 2 and last 2
  }
  
  // For domain part: handle cases where there might not be a TLD
  if (!domain.includes('.')) {
    // If no dot in domain, just mask the domain name
    let maskedDomain;
    if (domain.length <= 3) {
      maskedDomain = domain;
    } else {
      maskedDomain = domain.slice(0, 2) + '*'.repeat(Math.max(domain.length - 4, 1)) + domain.slice(-2);
    }
    return `${maskedUser}@${maskedDomain}`;
  }
  
  // Split domain properly and handle multiple dots
  const domainParts = domain.split('.');
  const tld = domainParts.pop(); // Get the last part as TLD
  const domainName = domainParts.join('.'); // Join the rest back
  
  let maskedDomain;
  if (domainName.length <= 3) {
    maskedDomain = domainName; // Show full domain if 3 characters or less
  } else if (domainName.length <= 5) {
    maskedDomain = domainName[0] + '*'.repeat(domainName.length - 2) + domainName[domainName.length - 1];
  } else {
    maskedDomain = domainName.slice(0, 2) + '*'.repeat(Math.max(domainName.length - 4, 1)) + domainName.slice(-2);
  }
  
  return `${maskedUser}@${maskedDomain}.${tld}`;
}

function VerifyCodeContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);

  useEffect(() => { 
    // Check for message and status in URL params
    const message = searchParams.get('message');
    const status = searchParams.get('status');
    
    if (message) {
      if (status === 'success') {
        setSuccess(message);
        setError("");
      } else {
        setError(message);
        setSuccess("");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set('email', email!);
      formData.set('token', codeDigits.join(""));
      
      await verifyPasswordResetCode(formData);
      // The server action will handle the redirect
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    if (resendCountdown > 0) return;
    
    setResendCountdown(60);
    const formData = new FormData();
    formData.set('identity', email!);
    formData.set('resend', 'true'); // Add resend parameter
    
    // The server action will handle the redirect back to this page
    requestPasswordReset(formData);
  };

  const handleDigitChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...codeDigits];
    newDigits[idx] = value;
    setCodeDigits(newDigits);
    setError("");
    if (value && idx < 5) {
      const nextInput = document.getElementById(`code-digit-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setCodeDigits(paste.split(""));
      setError("");
      const lastInput = document.getElementById('code-digit-5');
      if (lastInput) (lastInput as HTMLInputElement).focus();
      e.preventDefault();
    }
  };

  const code = codeDigits.join("");

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-4 py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Invalid Request</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              No email address provided. Please start the password reset process again.
            </p>
            <Link 
              href="/forgot-password"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
            >
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <Link 
                href="/forgot-password"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
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
                Enter verification code
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                We&apos;ve sent a 6-digit code to <span className="font-mono tracking-wide text-slate-800 dark:text-slate-100">{maskEmail(email!)}</span>
              </p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
              </div>
            )}
            
            <form onSubmit={handleVerifyCode} className="space-y-6">
              {/* Hidden input for email */}
              <input type="hidden" name="email" value={email || ''} />
              
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  6-Digit Verification Code
                </label>
                <div className="flex justify-center gap-2 mt-2" onPaste={handlePaste}>
                  {codeDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`code-digit-${idx}`}
                      name={idx === 0 ? "token" : ""}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(idx, e.target.value)}
                      onFocus={e => e.target.select()}
                      className="w-12 h-14 rounded-xl bg-white/60 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-2xl text-center font-mono shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600 transition-all duration-200 backdrop-blur-md hover:scale-105 focus:scale-110"
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                  Enter the 6-digit code sent to your email for verification of your email address for password reset
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <ButtonLoader />
                    Verifying code...
                  </>
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Didn&apos;t receive the code? </span>
                <button 
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCountdown > 0}
                  className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend'}
                </button>
              </div>
            </form>
            
            <div className="text-xs text-center text-slate-500 dark:text-slate-400">
              By using this form, you agree to our <Link href="/terms" className="underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">terms</Link> and <Link href="/privacy" className="underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">policies</Link>.
            </div>
            
            {/* Secure Login Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure verification with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
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
      <VerifyCodeContent />
    </Suspense>
  );
} 