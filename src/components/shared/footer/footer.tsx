"use client"

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

export function Footer() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <footer className={`${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-lg border-t ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 text-transparent bg-clip-text">
              Wish Consult
            </h3>
            <p className={`${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
              Empowering healthcare professionals with AI-powered learning solutions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/pricing" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={`${isDark ? 'text-slate-200 hover:text-teal-400' : 'text-slate-600 hover:text-teal-500'}`}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Stay Updated</h4>
            <p className={`${isDark ? 'text-slate-200' : 'text-slate-600'} mb-4`}>
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                } border focus:outline-none focus:ring-2 focus:ring-teal-400`}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-slate-800/50 text-slate-200' : 'border-slate-200/50 text-slate-600'} text-center`}>
          <p>&copy; {new Date().getFullYear()} Wish Consult. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 