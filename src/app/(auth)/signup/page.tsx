"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Sun, Moon, Home, Eye, EyeOff, Shield, Ticket } from "lucide-react";
import { useTheme } from "next-themes";
import { signup, validateInviteCodeSecure } from '../../auth/actions/actions'
import { ButtonLoader, InlineLoader } from '@/components/ui/loaders';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteCodeValidation, setInviteCodeValidation] = useState({
    isChecking: false,
    isValid: null as boolean | null,
    message: ''
  });
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle invite code validation
    if (name === 'inviteCode') {
      handleInviteCodeValidation(value);
    }
  };
  
  const handleInviteCodeValidation = async (inviteCode: string) => {
    // Reset validation state if empty
    if (!inviteCode.trim()) {
      setInviteCodeValidation({
        isChecking: false,
        isValid: null,
        message: ''
      });
      return;
    }
    
    // Start validation
    setInviteCodeValidation({
      isChecking: true,
      isValid: null,
      message: ''
    });
    
    try {
      const result = await validateInviteCodeSecure(inviteCode);
      setInviteCodeValidation({
        isChecking: false,
        isValid: result.valid,
        message: result.valid ? 'Valid invite code!' : result.error || 'Invalid invite code'
      });
    } catch {
      setInviteCodeValidation({
        isChecking: false,
        isValid: false,
        message: 'Failed to validate invite code'
      });
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
        
        {/* Glassmorphism Card */}
        <div className="relative">
          {/* Background blur circles - responsive sizing */}
          <div className="absolute -top-2 -left-2 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-2 -right-2 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          {/* Main card */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div></div>
              {mounted && (
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
              )}
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Create your account</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">Join our community of learners</p>
            </div>
            
            <form className="space-y-3" onSubmit={async e => {
              e.preventDefault();
              
              // Validate passwords match
              if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                return;
              }
              
              setLoading(true);
              
              // Create FormData manually with the current state values
              const formDataObj = new FormData();
              formDataObj.append('email', formData.email);
              formDataObj.append('password', formData.password);
              formDataObj.append('firstName', formData.firstName);
              formDataObj.append('lastName', formData.lastName);
              formDataObj.append('inviteCode', formData.inviteCode);
              
              console.log('Submitting form with data:', {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                inviteCode: formData.inviteCode
              });
              
              try {
                await signup(formDataObj);
                // The server action will redirect, so no need to do anything else
              } catch (error) {
                console.error('Signup error:', error);
                setLoading(false);
              }
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

                            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="inviteCode" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Have an invite code? <span className="text-slate-500 dark:text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ticket className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    value={formData.inviteCode}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-transparent border-b-2 ${
                      inviteCodeValidation.isValid === null 
                        ? 'border-slate-300 dark:border-slate-600' 
                        : inviteCodeValidation.isValid 
                        ? 'border-green-500 dark:border-green-400' 
                        : 'border-red-500 dark:border-red-400'
                    } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg`}
                    placeholder="Enter invite code"
                  />
                  {inviteCodeValidation.isChecking && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <InlineLoader width={20} />
                    </div>
                  )}
                </div>
                {inviteCodeValidation.message && (
                  <p className={`text-sm ${
                    inviteCodeValidation.isValid 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {inviteCodeValidation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
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
                    placeholder="Create a password"
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
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
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
                    placeholder="Confirm your password"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <ButtonLoader />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative bg-white dark:bg-slate-900 px-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">OR</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="text-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
                <Link 
                  href="/login"
                  className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
            
            <div className="text-xs text-center text-slate-500 dark:text-slate-400">
              By signing up, you agree to our <Link href="/terms" className="underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">terms</Link> and <Link href="/privacy" className="underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">policies</Link>.
            </div>
            
            {/* Secure Login Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure signup with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 