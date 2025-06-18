"use client";

import { useState } from "react";
import Link from "next/link";
import { Sun, Moon, Laptop2, User, Briefcase, BookOpen, Bell, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

const professions = [
  "Doctor",
  "Nurse",
  "Medical Student",
  "Pharmacist",
  "Dentist",
  "Other",
];
const specialties = [
  "Cardiology",
  "Pediatrics",
  "Surgery",
  "General Practice",
  "Nursing",
  "Other",
];

export default function StudentOnboardingWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    profession: "",
    specialty: "",
    learningGoal: "",
    notifications: true,
    theme: "system",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  // Animation helpers
  const stepClass = "transition-all duration-500 ease-in-out";

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  function validateStep(currentStep: number) {
    const newErrors: { [key: string]: string } = {};
    if (currentStep === 1) {
      if (!form.username) newErrors.username = "Username is required";
      else if (!/^[a-zA-Z0-9_]{3,16}$/.test(form.username)) newErrors.username = "3-16 chars, letters, numbers, _ only";
    }
    if (currentStep === 2) {
      if (!form.profession) newErrors.profession = "Profession is required";
      if (!form.specialty) newErrors.specialty = "Specialty is required";
    }
    if (currentStep === 3) {
      if (!form.learningGoal) newErrors.learningGoal = "Learning goal is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Theme toggle button
  function ThemeToggle() {
    return (
      <div className="flex gap-2 items-center">
        <button
          aria-label="Light mode"
          className={`p-2 rounded-lg ${theme === "light" ? "bg-teal-100 dark:bg-slate-800" : ""}`}
          onClick={() => setTheme("light")}
        >
          <Sun className="h-5 w-5" />
        </button>
        <button
          aria-label="Dark mode"
          className={`p-2 rounded-lg ${theme === "dark" ? "bg-teal-100 dark:bg-slate-800" : ""}`}
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-5 w-5" />
        </button>
        <button
          aria-label="System mode"
          className={`p-2 rounded-lg ${theme === "system" ? "bg-teal-100 dark:bg-slate-800" : ""}`}
          onClick={() => setTheme("system")}
        >
          <Laptop2 className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Stepper with icons
  const steps = [
    { icon: <User className="h-5 w-5" />, label: "Username" },
    { icon: <Briefcase className="h-5 w-5" />, label: "Profession" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Goal" },
    { icon: <Bell className="h-5 w-5" />, label: "Preferences" },
    { icon: <CheckCircle2 className="h-5 w-5" />, label: "Done" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-900/80 px-4">
      <div className="max-w-lg w-full mx-auto bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden backdrop-blur-lg border border-slate-200 dark:border-slate-800">
        {/* Theme toggle in header */}
        <div className="absolute top-6 right-6 z-10"><ThemeToggle /></div>
        {/* Stepper */}
        <div className="flex justify-center mb-8 gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mb-1 border-2 ${step === i+1 ? 'border-teal-500 bg-teal-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'} transition-all`}>
                {s.icon}
              </div>
              <span className={`text-xs ${step === i+1 ? 'text-teal-600 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>
        {/* Steps with fade/slide animation */}
        <div className="relative min-h-[340px]">
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); nextStep(); }} className={`space-y-6 text-center ${stepClass}`} key="username">
              <Image 
                src="/onboarding-avatar.svg" 
                alt="Welcome" 
                width={80}
                height={80}
                className="mx-auto mb-4 w-20 h-20 rounded-full shadow-lg bg-teal-50 dark:bg-slate-800" 
              />
              <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Let&apos;s pick your username</h1>
              <p className="text-slate-600 dark:text-slate-300 mb-4">This will be your unique identity on Wish Consult.</p>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="w-64 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. medstar_123"
                  autoComplete="username"
                  maxLength={16}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
              <button type="submit" className="mt-4 px-8 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition-all flex items-center gap-2 mx-auto">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={e => { e.preventDefault(); nextStep(); }} className={`space-y-5 ${stepClass}`} key="profile">
              <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Your Professional Background</h2>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Profession</label>
                <select
                  name="profession"
                  value={form.profession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select your profession</option>
                  {professions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Specialty</label>
                <select
                  name="specialty"
                  value={form.specialty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select your specialty</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold shadow hover:bg-slate-700 transition flex items-center gap-2"><ChevronLeft className="h-4 w-4" /> Back</button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition flex items-center gap-2">Next <ChevronRight className="h-4 w-4" /></button>
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={e => { e.preventDefault(); nextStep(); }} className={`space-y-5 ${stepClass}`} key="goal">
              <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Your Learning Goal</h2>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">What do you hope to achieve?</label>
                <textarea
                  name="learningGoal"
                  value={form.learningGoal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Pass an exam, upskill, specialize, etc."
                  rows={3}
                />
                {errors.learningGoal && <p className="text-red-500 text-xs mt-1">{errors.learningGoal}</p>}
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold shadow hover:bg-slate-700 transition flex items-center gap-2"><ChevronLeft className="h-4 w-4" /> Back</button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition flex items-center gap-2">Next <ChevronRight className="h-4 w-4" /></button>
              </div>
            </form>
          )}
          {step === 4 && (
            <form onSubmit={e => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setStep(5); }, 1200); }} className={`space-y-5 ${stepClass}`} key="prefs">
              <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Preferences</h2>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={form.notifications}
                  onChange={handleInputChange}
                  className="mr-2"
                  id="notifications"
                />
                <label htmlFor="notifications" className="text-slate-700 dark:text-slate-300">I want to receive important updates and reminders</label>
              </div>
              <div className="flex items-center mt-4">
                <label className="mr-2 text-slate-700 dark:text-slate-300">Theme:</label>
                <select name="theme" value={form.theme} onChange={handleInputChange} className="rounded-lg px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold shadow hover:bg-slate-700 transition flex items-center gap-2"><ChevronLeft className="h-4 w-4" /> Back</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition flex items-center gap-2">
                  {loading ? <span className="animate-spin w-5 h-5 border-2 border-t-transparent border-white rounded-full"></span> : <>Finish <ChevronRight className="h-4 w-4" /></>}
                </button>
              </div>
            </form>
          )}
          {step === 5 && (
            <div className="text-center animate-fade-in">
              <Image src="/onboarding-success.svg" alt="Success" className="mx-auto mb-4 w-20 h-20 rounded-full shadow-lg bg-teal-50 dark:bg-slate-800" />
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">You&apos;re all set!</h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                Your preferences are saved. Click below to start your learning journey.
              </p>
              <Link href="/dashboard" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold shadow hover:bg-teal-700 transition">Go to Dashboard</Link>
            </div>
          )}
        </div>
      </div>
      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
} 