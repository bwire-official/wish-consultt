"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { AffiliateNavbar } from "@/components/affiliate/AffiliateNavbar";
import AffiliateSidebar from "@/components/affiliate/AffiliateSidebar";
import AffiliatePageLoader from "@/components/affiliate/AffiliatePageLoader";
import Head from "next/head";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface AffiliateProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string;
  email: string | null;
  avatar_url: string | null;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch real profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/affiliate/login');
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, role, email, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          router.push('/affiliate/login');
          return;
        }

        if (profileData?.role !== 'affiliate') {
          // Redirect non-affiliates to appropriate page
          if (profileData?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Profile fetch failed:', error);
        router.push('/affiliate/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase]);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('affiliate-darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      // Default to dark mode if no preference is saved
      setIsDarkMode(true);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('affiliate-darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Show loading state while fetching profile
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20 flex items-center justify-center">
        <AffiliatePageLoader />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Affiliate Dashboard | Wish Consult - Earn While You Learn</title>
        <meta name="description" content="Manage your affiliate partnerships, track earnings, and access marketing materials. Join Wish Consult's affiliate program and earn commissions promoting healthcare education." />
        <meta name="keywords" content="affiliate dashboard, healthcare education, commission tracking, marketing materials, Wish Consult affiliate program" />
        <meta name="author" content="Wish Consult" />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wishconsult.app/affiliate/dashboard" />
        <meta property="og:title" content="Affiliate Dashboard | Wish Consult" />
        <meta property="og:description" content="Manage your affiliate partnerships and track earnings with Wish Consult's comprehensive affiliate dashboard." />
        <meta property="og:image" content="https://wishconsult.app/og-affiliate-dashboard.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://wishconsult.app/affiliate/dashboard" />
        <meta property="twitter:title" content="Affiliate Dashboard | Wish Consult" />
        <meta property="twitter:description" content="Manage your affiliate partnerships and track earnings with Wish Consult's comprehensive affiliate dashboard." />
        <meta property="twitter:image" content="https://wishconsult.app/og-affiliate-dashboard.jpg" />
        
        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wish Consult Affiliate" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Wish Consult Affiliate Dashboard",
              "description": "Comprehensive affiliate management dashboard for healthcare education partners",
              "url": "https://wishconsult.app/affiliate/dashboard",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20">
        {/* Navbar - Fixed at top */}
        <AffiliateNavbar 
          profile={profile} 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />
        
        {/* Sidebar - Fixed on left */}
        <AffiliateSidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main Content - Positioned to account for navbar and sidebar */}
        <main className="pt-16 lg:pl-64 transition-all duration-300">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );
} 