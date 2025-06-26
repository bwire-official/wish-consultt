"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AffiliateOnboardingForm from "./AffiliateOnboardingForm";

export default function AffiliateOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleComplete = () => {
    // TODO: Handle onboarding completion
    console.log("Affiliate onboarding completed");
    router.push("/affiliate/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20">
      <AffiliateOnboardingForm 
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onComplete={handleComplete}
      />
    </div>
  );
} 