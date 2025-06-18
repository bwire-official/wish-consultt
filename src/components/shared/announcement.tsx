"use client"

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Announcement() {
  const [isVisible, setIsVisible] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!isVisible) return null

  return (
    <div className={`relative ${
      isDark ? 'bg-slate-800' : 'bg-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className={`font-medium ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="md:hidden">New features available!</span>
            <span className="hidden md:inline">
              🎉 New AI-powered learning features and course content available. Try them now!
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className={`flex p-2 rounded-md ${
              isDark 
                ? 'hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white' 
                : 'hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900'
            }`}
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <X className={`h-6 w-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`} />
          </button>
        </div>
      </div>
    </div>
  )
} 