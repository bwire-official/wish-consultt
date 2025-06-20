"use client";

import { useState, useEffect } from "react";
import { ButtonLoader, InlineLoader } from "@/components/ui/loaders";
import { 
  Check,
  ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type Profile } from "@/types";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRouter } from 'next/navigation';
import { type Database } from "@/types/supabase";

interface OnboardingFormProps {
  profile: Profile;
}

interface FormData {
  username: string;
  phone_number: string;
  professional_role: string;
  specialization: string;
  experience_level: string;
  education_level: string;
  institution: string;
  graduation_year: string;
  certifications: string[];
  interests: string[];
  goals: string[];
  availability: string;
  timezone: string;
  language: string;
  photo: File | null;
  avatarUrl: string;
  preferences: {
    notifications: boolean;
    email_updates: boolean;
    course_recommendations: boolean;
  };
}

const professionalRoles = [
  "Medical Student",
  "Resident Physician",
  "Attending Physician",
  "Nurse",
  "Nurse Practitioner",
  "Physician Assistant",
  "Medical Assistant",
  "EMT/Paramedic",
  "Other Healthcare Professional"
];

const specializations = [
  "Emergency Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Surgery",
  "Cardiology",
  "Neurology",
  "Oncology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
  "Family Medicine",
  "Obstetrics & Gynecology",
  "Orthopedics",
  "Dermatology",
  "Ophthalmology",
  "Other"
];

const experienceLevels = [
  "Student (Pre-clinical)",
  "Student (Clinical)",
  "Resident (PGY-1)",
  "Resident (PGY-2)",
  "Resident (PGY-3+)",
  "Fellow",
  "Attending (0-5 years)",
  "Attending (5-10 years)",
  "Attending (10+ years)"
];

const educationLevels = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (MD/DO)",
  "Doctorate (PhD)",
  "Other"
];

const certifications = [
  "BLS (Basic Life Support)",
  "ACLS (Advanced Cardiac Life Support)",
  "PALS (Pediatric Advanced Life Support)",
  "ATLS (Advanced Trauma Life Support)",
  "NRP (Neonatal Resuscitation Program)",
  "EMT-Basic",
  "EMT-Advanced",
  "Paramedic",
  "RN License",
  "NP License",
  "PA License",
  "Other"
];

const interests = [
  "Emergency Medicine",
  "Critical Care",
  "Trauma",
  "Pediatrics",
  "Cardiology",
  "Neurology",
  "Surgery",
  "Research",
  "Teaching",
  "Leadership",
  "Technology",
  "Global Health",
  "Public Health",
  "Other"
];

const goals = [
  "Improve clinical skills",
  "Earn certifications",
  "Advance career",
  "Network with peers",
  "Stay updated with latest practices",
  "Prepare for exams",
  "Research opportunities",
  "Teaching opportunities",
  "Leadership development",
  "Other"
];

// Custom styles for phone input
const phoneInputStyles = `
  .phone-input-container .react-tel-input .form-control {
    background: transparent !important;
    border: none !important;
    border-bottom: 2px solid #cbd5e1 !important;
    border-radius: 0 !important;
    color: #1e293b !important;
    font-size: 1.125rem !important;
    padding: 0.75rem 0.75rem 0.75rem 3rem !important;
    width: 100% !important;
    transition: border-color 0.2s !important;
  }
  
  .phone-input-container .react-tel-input .form-control:focus {
    border-bottom-color: #14b8a6 !important;
    box-shadow: none !important;
  }
  
  .dark .phone-input-container .react-tel-input .form-control {
    border-bottom-color: #475569 !important;
    color: #ffffff !important;
  }
  
  .dark .phone-input-container .react-tel-input .form-control:focus {
    border-bottom-color: #2dd4bf !important;
  }
  
  .phone-input-container .react-tel-input .form-control::placeholder {
    color: #64748b !important;
  }
  
  .dark .phone-input-container .react-tel-input .form-control::placeholder {
    color: #94a3b8 !important;
  }
  
  .phone-input-container .react-tel-input .flag-dropdown {
    background: transparent !important;
    border: none !important;
    border-bottom: 2px solid #cbd5e1 !important;
    border-radius: 0 !important;
  }
  
  .dark .phone-input-container .react-tel-input .flag-dropdown {
    border-bottom-color: #475569 !important;
  }
  
  .phone-input-container .react-tel-input .flag-dropdown.open {
    border-bottom-color: #14b8a6 !important;
  }
  
  .dark .phone-input-container .react-tel-input .flag-dropdown.open {
    border-bottom-color: #2dd4bf !important;
  }
`;

export function OnboardingForm({ profile }: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    username: profile?.username || "",
    phone_number: profile?.phone_number || "",
    professional_role: "",
    specialization: "",
    experience_level: "",
    education_level: "",
    institution: "",
    graduation_year: "",
    certifications: [],
    interests: [],
    goals: [],
    availability: "",
    timezone: "UTC",
    language: "en",
    photo: null,
    avatarUrl: "",
    preferences: {
      notifications: true,
      email_updates: true,
      course_recommendations: true,
    },
  });

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [showUsernameSuggestions, setShowUsernameSuggestions] = useState(true);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const totalSteps = 8;

  useEffect(() => {
    setMounted(true);
    // Check system theme preference
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (profile.full_name) {
      const name = profile.full_name.toLowerCase().replace(/[^a-z]/g, '');
      const suggestions = [
        `${name}${Math.floor(Math.random() * 1000)}`,
        `${name}_${Math.floor(Math.random() * 1000)}`,
        `${name}${Math.floor(Math.random() * 100)}`,
        `${name}_student`,
        `${name}${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 100)}`,
      ];
      setUsernameSuggestions(suggestions);
    }
  }, [profile.full_name]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleUsernameChange = (username: string) => {
    setFormData({ ...formData, username });
    setUsernameAvailable(null);
    setUsernameMessage('');
    
    // Hide suggestions when user types their own username
    if (username.length > 0) {
      setShowUsernameSuggestions(false);
    }
    
    if (username.length >= 3) {
      checkUsernameAvailability(username);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    setIsCheckingUsername(true);
    try {
      const { data, error } = await createClient()
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') {
        // Username is available
        setUsernameAvailable(true);
        setUsernameMessage('Username is available!');
      } else if (data) {
        // Username is taken
        setUsernameAvailable(false);
        setUsernameMessage('Username is already taken');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await createClient()
        .storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = createClient()
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Store both the file and the public URL
      setFormData({ 
        ...formData, 
        photo: file,
        avatarUrl: publicUrl // Add this to store the public URL
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      // Prepare onboarding data to store in JSON field
      const onboardingData = {
        professional_role: formData.professional_role,
        specialization: formData.specialization,
        experience_level: formData.experience_level,
        education_level: formData.education_level,
        institution: formData.institution,
        graduation_year: formData.graduation_year,
        certifications: formData.certifications,
        interests: formData.interests,
        goals: formData.goals,
        availability: formData.availability,
        timezone: formData.timezone,
        language: formData.language,
        preferences: formData.preferences
      };

      // Prepare update data with proper typing
      const updateData: {
        username?: string;
        onboarding_data?: Database['public']['Tables']['profiles']['Row']['onboarding_data'];
        phone_number?: string;
        avatar_url?: string;
      } = {
        username: formData.username,
        onboarding_data: onboardingData
      };

      // Only add direct profile fields that we know exist for sure
      if (formData.phone_number) {
        updateData.phone_number = formData.phone_number;
      }
      
      // Add avatar URL if photo was uploaded
      if (formData.avatarUrl) {
        updateData.avatar_url = formData.avatarUrl;
      }
      
      // Update main profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (profileError) {
        console.error('Supabase profile error:', profileError);
        throw new Error(profileError.message || 'Failed to update profile');
      }

      // Show success message
      setShowSuccessPopup(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <style dangerouslySetInnerHTML={{ __html: phoneInputStyles }} />

      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Complete Your Profile
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Let&apos;s get to know you better to personalize your learning experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 relative">
          {/* Theme Toggle inside card */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Welcome, {profile.full_name}!
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Welcome to Wish Consult! We&apos;re excited to have you join our community of healthcare professionals.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    What to expect:
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                      Personalized learning recommendations
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                      Track your progress and earn certificates
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                      Connect with other healthcare professionals
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                      Access to exclusive courses and resources
                    </li>
                  </ul>
                </div>
                
                <p className="text-center text-slate-600 dark:text-slate-300">
                  Let&apos;s set up your profile to get you started on your learning journey!
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Profile Photo
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Add a profile photo to personalize your account (optional)
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {formData.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={formData.avatarUrl || URL.createObjectURL(formData.photo)}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        profile.full_name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    {uploadLoading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <InlineLoader width={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all cursor-pointer"
                    >
                      {uploadLoading ? (
                        <>
                          <InlineLoader width={16} className="mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Upload Photo
                        </>
                      )}
                    </label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      You can skip this step and add a photo later
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Choose Your Username
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  This will be your unique identifier on the platform
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="Enter your username"
                  />
                  {isCheckingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <InlineLoader width={16} />
                    </div>
                  )}
                  {usernameMessage && !isCheckingUsername && (
                    <div className={`mt-2 text-sm flex items-center ${usernameAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {usernameAvailable ? (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      {usernameMessage}
                    </div>
                  )}
                </div>
                
                {showUsernameSuggestions && usernameSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Suggested usernames:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {usernameSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleUsernameChange(suggestion)}
                          className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Phone Number
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Add your phone number for account verification and notifications
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneInput
                    country={'us'}
                    value={formData.phone_number}
                    onChange={(phone) => setFormData({ ...formData, phone_number: phone })}
                    inputClass="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    buttonClass="bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white"
                    dropdownClass="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg"
                    enableSearch={true}
                    searchPlaceholder="Search country..."
                    placeholder="Enter your phone number"
                    containerClass="phone-input-container"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This helps us verify your account and send important notifications
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Education & Professional Background
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Tell us about your educational and professional background
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Current Role
                  </label>
                  <select
                    value={formData.professional_role}
                    onChange={(e) => setFormData({ ...formData, professional_role: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg appearance-none"
                  >
                    <option value="">Select your current role</option>
                    {professionalRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Specialization (Optional)
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg appearance-none"
                  >
                    <option value="">Select your specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg appearance-none"
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Education Level
                  </label>
                  <select
                    value={formData.education_level}
                    onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg appearance-none"
                  >
                    <option value="">Select your education level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="Enter your institution name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Graduation Year (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors text-lg"
                    placeholder="e.g., 2024"
                    min="1950"
                    max="2030"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Certifications & Interests
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  What certifications do you have and what interests you?
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Certifications (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {certifications.map((cert) => (
                      <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(cert)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                certifications: [...formData.certifications, cert]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                certifications: formData.certifications.filter(c => c !== cert)
                              });
                            }
                          }}
                          className="w-4 h-4 text-teal-600 bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Areas of Interest (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                interests: [...formData.interests, interest]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                interests: formData.interests.filter(i => i !== interest)
                              });
                            }
                          }}
                          className="w-4 h-4 text-teal-600 bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Learning Goals
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  What are your learning goals? (Optional)
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Learning Goals (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map((goal) => (
                    <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              goals: [...formData.goals, goal]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              goals: formData.goals.filter(g => g !== goal)
                            });
                          }
                        }}
                        className="w-4 h-4 text-teal-600 bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Preferences
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Customize your notification and learning preferences
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, notifications: e.target.checked }
                    })}
                    className="w-5 h-5 text-teal-600 bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Push Notifications</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications about new courses and updates</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.email_updates}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, email_updates: e.target.checked }
                    })}
                    className="w-5 h-5 text-teal-600 bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Updates</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Get email updates about your progress and new content</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.course_recommendations}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, course_recommendations: e.target.checked }
                    })}
                    className="w-5 h-5 text-teal-600 bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Course Recommendations</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive personalized course recommendations</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {currentStep < totalSteps && (
                <>
                  {(currentStep === 4 || currentStep === 5 || currentStep === 6 || currentStep === 7) && (
                    <button
                      onClick={skipStep}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors underline"
                    >
                      Skip for now
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 rounded-lg transition-all"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </>
              )}
              
              {currentStep === totalSteps && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex items-center px-8 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 rounded-lg transition-all"
                >
                  {isLoading ? (
                    <>
                      <ButtonLoader width={16} className="mr-2" />
                      Completing...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Profile Completed!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Welcome to Wish Consult! Your profile has been successfully created. You&apos;ll be redirected to your dashboard shortly.
              </p>
              <div className="flex items-center justify-center">
                <ButtonLoader width={20} className="mr-2" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Redirecting...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 