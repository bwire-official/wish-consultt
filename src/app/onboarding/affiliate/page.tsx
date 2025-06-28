"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import AffiliateOnboardingForm from "./AffiliateOnboardingForm";

export default function AffiliateOnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is authenticated and has affiliate role
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/affiliate/login');
          return;
        }

        // Check if user has affiliate role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'affiliate') {
          // Not an affiliate, redirect to appropriate page
          if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Access check failed:', error);
        router.push('/affiliate/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router, supabase]);

  const handleComplete = () => {
    console.log("Affiliate onboarding completed");
    router.push("/affiliate/dashboard");
  };

  // Show loading state while checking access
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Checking access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authorized (redirect is happening)
  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20">
      <AffiliateOnboardingForm 
        onComplete={handleComplete}
      />
    </div>
  );
} 