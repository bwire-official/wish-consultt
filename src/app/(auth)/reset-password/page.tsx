"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ArrowRight, Sun, Moon, Home, ArrowLeft, Eye, EyeOff, Check, X, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';
import { updateUserPassword } from '../../auth/actions/actions';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    letter: false,
    number: false,
    special: false
  });

  useEffect(() => { 
    setMounted(true); 
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");

    // Update password validation when password changes
    if (name === 'password') {
      setPasswordValidation({
        length: value.length >= 8,
        letter: /[a-zA-Z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  // Check if all password requirements are met
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  
  // Check if passwords match
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  
  // Check if form is valid
  const isFormValid = isPasswordValid && doPasswordsMatch;

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter";
    if (!/\d/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.set('password', formData.password);
      
      await updateUserPassword(formDataToSubmit);
      // The server action will handle the redirect
    } catch (error) {
      console.error('Error updating password:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-4 py-8 overflow-hidden">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg">
            <Home className="h-5 w-5" /> Wish Consult
          </Link>
        </div>
        
        <div className="relative">
          <div className="absolute -top-2 -left-2 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-2 -right-2 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <Link href="/forgot-password" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Forgot Password
              </Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-slate-600" />
                  )}
                </button>
              )}
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Reset your password</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">Enter your new password below</p>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                </div>
                
                {/* Password Requirements */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    {passwordValidation.length ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={passwordValidation.length ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.letter ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={passwordValidation.letter ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      Contains at least one letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.number ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={passwordValidation.number ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      Contains at least one number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.special ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={passwordValidation.special ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      Contains at least one special character
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    {doPasswordsMatch ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={doPasswordsMatch ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {doPasswordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <ButtonLoader />
                    Resetting password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Remember your password? </span>
              <Link href="/login" className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors">
                Sign in here
              </Link>
            </div>
            
            {/* Secure Login Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure password update with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 