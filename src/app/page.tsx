"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import Navbar from "@/components/shared/navigation/navbar"
import { 
  Sparkles, 
  Brain, 
  Users, 
  Clock, 
  TrendingUp,
  Stethoscope,
  BookOpen,
  Award,
  MessageSquare,
  ArrowRight,
  Star,
  Heart,
  Shield,
  Link as LinkIcon,
  BarChart,
  DollarSign,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

export default function Home() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <>
      <Navbar />
      <main className={`min-h-screen relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950' 
          : 'bg-white'
      }`}>
      {/* Animated bubbles */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-center"></div>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-400/10 to-blue-400/10 mb-8">
              <Sparkles className="h-5 w-5 text-teal-400 mr-2" />
              <span className={`text-sm font-medium ${
                isDark ? 'text-teal-400' : 'text-teal-600'
              }`}>
                AI-Powered Healthcare Education
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Master Healthcare with AI-Powered Learning
            </h1>
            <p className={`text-xl mb-8 max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Access cutting-edge medical education, personalized learning paths, and expert guidance to advance your healthcare career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 transition-all duration-300 inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/courses"
                className={`px-8 py-3 rounded-lg border inline-flex items-center ${
                  isDark 
                    ? 'border-slate-700 text-slate-200 hover:border-teal-400 hover:text-teal-400' 
                    : 'border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-500'
                } transition-colors`}
              >
                Explore Courses
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Why Choose Wish Consult?
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Experience the future of healthcare education
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark 
                ? 'glass hover:bg-slate-800/80' 
                : 'bg-slate-50 hover:bg-slate-100'
            } transition-all duration-300`}>
              <div className="mb-4">
                <Brain className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                AI-Powered Learning
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Personalized learning paths and real-time feedback powered by advanced AI technology.
              </p>
            </div>
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark 
                ? 'glass hover:bg-slate-800/80' 
                : 'bg-slate-50 hover:bg-slate-100'
            } transition-all duration-300`}>
              <div className="mb-4">
                <Stethoscope className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Expert Content
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Access high-quality courses created by leading healthcare professionals and educators.
              </p>
            </div>
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark 
                ? 'glass hover:bg-slate-800/80' 
                : 'bg-slate-50 hover:bg-slate-100'
            } transition-all duration-300`}>
              <div className="mb-4">
                <Award className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Career Advancement
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Gain the skills and knowledge needed to advance your healthcare career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="mb-4">
                <Users className="h-8 w-8 text-teal-500 mx-auto" />
              </div>
              <div className={`text-4xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                10,000+
              </div>
              <div className={`text-lg ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Active Students
              </div>
            </div>
            <div className={`text-center p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="mb-4">
                <Clock className="h-8 w-8 text-teal-500 mx-auto" />
              </div>
              <div className={`text-4xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                500+
              </div>
              <div className={`text-lg ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Course Hours
              </div>
            </div>
            <div className={`text-center p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="mb-4">
                <TrendingUp className="h-8 w-8 text-teal-500 mx-auto" />
              </div>
              <div className={`text-4xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                95%
              </div>
              <div className={`text-lg ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              What Our Students Say
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Join thousands of satisfied healthcare professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-teal-500" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className={`mb-4 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                &quot;The AI-powered learning experience is incredible. It adapts to my pace and provides personalized feedback that has significantly improved my understanding.&quot;
              </p>
              <div className="font-medium text-slate-900 dark:text-white">
                Dr. Sarah Johnson
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Medical Resident
              </div>
            </div>
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-teal-500" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className={`mb-4 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                &quot;The quality of the courses and the expert guidance have been instrumental in my career growth. Highly recommended!&quot;
              </p>
              <div className="font-medium text-slate-900 dark:text-white">
                Michael Chen
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Healthcare Administrator
              </div>
            </div>
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-teal-500" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className={`mb-4 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                &quot;The platform&apos;s focus on practical skills and real-world applications has made me a more confident healthcare professional.&quot;
              </p>
              <div className="font-medium text-slate-900 dark:text-white">
                Emma Wilson
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Nurse Practitioner
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Become an Affiliate Partner
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Earn commissions by promoting quality healthcare education
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="mb-4">
                <LinkIcon className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Unique Referral Links
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Get your personalized referral link to track conversions and earnings.
              </p>
            </div>
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="mb-4">
                <DollarSign className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Generous Commissions
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Earn competitive commissions for every successful referral.
              </p>
            </div>
            <div className={`p-8 rounded-2xl hover-lift ${
              isDark ? 'glass' : 'bg-slate-50'
            }`}>
              <div className="mb-4">
                <BarChart className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Real-time Analytics
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Track your performance with detailed analytics and insights.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/affiliate/signup"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 transition-all duration-300 inline-flex items-center"
            >
              Join Our Affiliate Program
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center p-12 rounded-3xl ${
            isDark 
              ? 'bg-gradient-to-r from-slate-800 to-slate-900' 
              : 'bg-gradient-to-r from-slate-50 to-slate-100'
          }`}>
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Ready to Transform Your Career?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Join thousands of healthcare professionals who are already advancing their careers with Wish Consult.
            </p>
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 transition-all duration-300 inline-flex items-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                About Wish Consult
              </h3>
              <p className={`${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Empowering healthcare professionals with AI-powered education and expert guidance.
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className={`hover:text-teal-500 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className={`hover:text-teal-500 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className={`hover:text-teal-500 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={`hover:text-teal-500 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Contact Us
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-teal-500" />
                  <a href="mailto:contact@wishconsult.com" className={`hover:text-teal-500 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    contact@wishconsult.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-teal-500" />
                  <a href="tel:+1234567890" className={`hover:text-teal-500 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-teal-500" />
                  <span className={`${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Lagos, Nigeria
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a href="#" className={`hover:text-teal-500 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className={`hover:text-teal-500 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className={`hover:text-teal-500 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className={`hover:text-teal-500 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className={`hover:text-teal-500 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className={`mt-12 pt-8 border-t ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <p className={`text-center ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              © {new Date().getFullYear()} Wish Consult. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
} 