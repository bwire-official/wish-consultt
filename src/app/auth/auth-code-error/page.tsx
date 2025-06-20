import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        
        {/* Glassmorphism Card */}
        <div className="relative">
          {/* Background blur circles */}
          <div className="absolute -top-2 -left-2 w-48 h-48 sm:w-72 sm:h-72 bg-red-300 dark:bg-red-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-2 -right-2 w-48 h-48 sm:w-72 sm:h-72 bg-orange-300 dark:bg-orange-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          
          {/* Main card */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-16 w-16 text-red-500" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Authentication Error</h1>
              
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300">
                  We encountered an issue while verifying your email address. This could be due to:
                </p>
                
                <ul className="text-left text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>An expired or invalid verification link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>A network connection issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>The verification link was already used</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Try Signing Up Again
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Or{' '}
                  <Link 
                    href="/login"
                    className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
                  >
                    sign in if you already have an account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 