"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  Link as LinkIcon, 
  DollarSign,  
  Award,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Sun,
  Moon,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react";
import { useTheme } from "next-themes";

interface FAQItem {
  question: string;
  answer: string;
}

// Custom Affiliate Navbar Component
function AffiliateNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    // Return a skeleton navbar with neutral colors to prevent theme flash
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-slate-900 dark:text-white">
              Wish Consult
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center space-x-8">
                <div className="w-20 h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isDark = theme === "dark";

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
              href="#how-it-works"
              className={`${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#benefits"
              className={`${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Benefits
            </Link>
            <Link
              href="#faq"
              className={`${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              FAQ
            </Link>
          </div>

          {/* Theme Toggle and Auth Buttons */}
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
                href="/affiliate/login"
                className={`px-4 py-2 rounded-lg ${
                  isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Partner Login
              </Link>
              <Link
                href="/affiliate/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
              >
                Become Partner
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
              href="#how-it-works"
              className={`block ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#benefits"
              className={`block ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Benefits
            </Link>
            <Link
              href="#faq"
              className={`block ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              FAQ
            </Link>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Link
                href="/affiliate/login"
                className={`block ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Partner Login
              </Link>
              <Link
                href="/affiliate/signup"
                className="block text-purple-500"
              >
                Become Partner
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Custom Affiliate Footer Component
function AffiliateFooter() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a skeleton footer with neutral colors to prevent theme flash
    return (
      <footer className="bg-white/50 backdrop-blur-lg border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-full h-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-20 h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-14 h-3 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-28 h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-full h-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const isDark = theme === "dark";

  return (
    <footer className={`${isDark ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-lg border-t ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
              Wish Consult
            </h3>
            <p className={`${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
              Empowering healthcare professionals with AI-powered learning solutions and rewarding affiliate partnerships.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Affiliate Program */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Affiliate Program</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/affiliate/signup" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/affiliate/login" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  Partner Login
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#benefits" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#faq" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`${isDark ? 'text-slate-200 hover:text-purple-400' : 'text-slate-600 hover:text-purple-500'}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Support */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Partner Support</h4>
            <p className={`${isDark ? 'text-slate-200' : 'text-slate-600'} mb-4`}>
              Get the latest updates and tips for maximizing your affiliate earnings.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                } border focus:outline-none focus:ring-2 focus:ring-purple-400`}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-slate-800/50 text-slate-200' : 'border-slate-200/50 text-slate-600'} text-center`}>
          <p>&copy; {new Date().getFullYear()} Wish Consult. All rights reserved. | Partner with us and earn while helping healthcare professionals grow.</p>
        </div>
      </div>
    </footer>
  );
}

export default function AffiliateLandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How much can I earn?",
      answer: "You earn a 30% commission on every course purchase made by someone you invite. Our top affiliates earn $500+ monthly by promoting our healthcare education platform."
    },
    {
      question: "How do payouts work?",
      answer: "Payouts are made monthly once you reach a minimum balance of $50. We offer multiple payment methods to suit your preferences."
    },
    {
      question: "Who is eligible to become an affiliate?",
      answer: "We welcome content creators, medical influencers, educational institutions, healthcare professionals, and anyone passionate about improving medical education and healthcare consultancy."
    },
    {
      question: "How long does the tracking cookie last?",
      answer: "Our tracking cookie lasts for 30 days, so you get credit even if the person you invite doesn't purchase a course right away. This gives your invites plenty of time to make their decision."
    },
    {
      question: "What marketing materials do you provide?",
      answer: "We provide banners, social media graphics, email templates, and promotional content. Our team also offers support and guidance to help you succeed."
    },
    {
      question: "Can I track my performance?",
      answer: "Yes! You get access to your own private dashboard with real-time analytics. Track your clicks, invites, conversions, and earnings with complete transparency."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "High Commission Rates",
      description: "Earn up to 30% commission on every course purchase from your invites"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Get personalized support from our affiliate team"
    },
    {
      icon: DollarSign,
      title: "Multiple Payment Methods",
      description: "Receive your earnings through various payment options"
    },
    {
      icon: Shield,
      title: "Secure Tracking",
      description: "Advanced tracking system ensures you get credit for all your invites"
    }
  ];

  const steps = [
    {
      icon: Award,
      title: "Apply to Join",
      description: "Fill out our simple application form to become an official Wish Consult partner.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: LinkIcon,
      title: "Share Your Link",
      description: "Use your unique invite link to share our platform with your audience, students, or colleagues.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: DollarSign,
      title: "Earn Commissions",
      description: "Receive a generous commission for every course purchase made by someone you invite.",
      color: "from-blue-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <AffiliateNavbar />

      <div className="relative z-10 pt-16">
        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  <Award className="h-4 w-4" />
                  Join Our Affiliate Program
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Partner with the Future of
                  <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Medical Education
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                  Earn competitive commissions by sharing a platform that genuinely helps healthcare professionals advance their careers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/affiliate/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Apply to Become a Partner
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  href="/affiliate/login"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  Already a partner? Log in here
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">500+</div>
                  <div className="text-slate-600 dark:text-slate-400">Active Partners</div>
                </div>
                <div className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">$50K+</div>
                  <div className="text-slate-600 dark:text-slate-400">Paid Out Monthly</div>
                </div>
                <div className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">30%</div>
                  <div className="text-slate-600 dark:text-slate-400">Commission Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Get started in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-8 w-8 text-purple-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                A Partnership You Can Be Proud Of
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Join a program that values quality, transparency, and mutual success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Everything you need to know about our affiliate program
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {faq.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Become a key partner in our mission to elevate medical education worldwide.
            </p>
            <Link 
              href="/affiliate/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 hover:bg-purple-50 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>

      <AffiliateFooter />
    </div>
  );
}
