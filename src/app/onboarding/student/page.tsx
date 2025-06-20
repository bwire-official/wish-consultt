import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/session";
import { OnboardingForm } from "./OnboardingForm";

// --- Main Server Component Page ---
export default async function OnboardingPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.onboarding_completed) {
    redirect("/dashboard");
  }

  return <OnboardingForm profile={profile} />;
} 