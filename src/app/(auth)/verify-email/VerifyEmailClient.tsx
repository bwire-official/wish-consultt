"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { verifyOtp } from '../../auth/actions/actions'

export default function VerifyEmailClient() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const message = searchParams.get("message") || "";

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.set("email", email);
    formData.set("token", code.join(""));
    try {
      await verifyOtp(formData);
      setVerified(true); // This will be replaced by redirect
    } catch {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setResending(true);
    // Resend code functionality will be added later
    setTimeout(() => {
      setResending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Verify your email</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {verified
              ? "Your email has been verified successfully!"
              : (
                <>
                  We sent a verification code to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.<br />
                  Please enter the code below to verify your account.
                </>
              )}
          </p>
          {message && (
            <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              {message}
            </div>
          )}
        </div>

        {!verified ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="email" value={email} />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    required
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              >
                <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Resending..." : "Resend code"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-semibold">
                Your email has been verified successfully! Welcome to Wish Consult 🎉
              </p>
            </div>
            <Link
              href="/onboarding/student"
              className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold"
            >
              Continue to Onboarding
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}