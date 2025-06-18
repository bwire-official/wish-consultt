"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
} from "lucide-react"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? isDark
          ? "bg-slate-900/95 backdrop-blur-sm"
          : "bg-white/95 backdrop-blur-sm shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            <span className={isDark ? "text-white" : "text-slate-900"}>
              Wish Consult
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className={`$${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`$${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`$${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              About
            </Link>
          </div>

          {/* Theme Toggle - always visible */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-lg ${
                isDark
                  ? "text-slate-300 hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg ${
                  isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            isDark ? "bg-slate-900" : "bg-white"
          } border-t ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div className="px-4 py-3 space-y-3">
            <Link
              href="#features"
              className={`block ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`block ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`block ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              About
            </Link>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Link
                href="/login"
                className={`block ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block text-teal-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 