"use client";

// Remove invalid module augmentation for 'languages-list'.
// If you need types, create a languages-list.d.ts file in your project root or src directory.

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Award,  
  Gift, 
  Globe, 
  Moon, 
  Sun, 
  User,
  FileText,
  Youtube,
  Share2,
  Mail,
  Info,
  Lightbulb,
  MessageCircle,
  Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import { countries } from "countries-list";
import ISO6391 from "iso-639-1";
import "react-phone-number-input/style.css";
import { completeAffiliateOnboarding } from '@/app/onboarding/affiliate/actions';
import { checkUsernameAvailability, getAffiliateInviteCode } from '@/app/affiliate/actions';
import { createClient } from '@/lib/supabase/client';
import { InlineLoader } from '@/components/ui/loaders';

// Custom styles for phone input
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #cbd5e1;
    transition: border-color 0.2s;
  }
  
  .PhoneInput:focus-within {
    border-color: #8b5cf6;
  }
  
  .dark .PhoneInput {
    border-color: #4b5563;
  }
  
  .dark .PhoneInput:focus-within {
    border-color: #a78bfa;
  }
  
  .PhoneInputCountry {
    margin-right: 0.5rem;
  }
  
  .PhoneInputInput {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.75rem 0;
    font-size: 1.125rem;
    color: #374151;
  }
  
  .dark .PhoneInputInput {
    color: #d1d5db;
  }
  
  .PhoneInputInput::placeholder {
    color: #9ca3af;
  }
  
  .dark .PhoneInputInput::placeholder {
    color: #6b7280;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = phoneInputStyles;
  document.head.appendChild(style);
}

interface AffiliateOnboardingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
}

export default function AffiliateOnboardingForm({ 
  onComplete 
}: Omit<AffiliateOnboardingFormProps, 'currentStep' | 'setCurrentStep'>) {
  const { theme, setTheme } = useTheme();
  
  // Step 2: Add State Management Hooks
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{ first_name?: string; last_name?: string } | null>(null);
  const [actualInviteCode, setActualInviteCode] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    avatar_url: '',
    phone_number: '',
    country: '',
    gender: '',
    date_of_birth: '',
    languages: [] as string[],
    onboarding_data: {
      website: '',
      promotionMethods: [] as string[],
      otherPromotionMethod: '',
    },
    agreeToTerms: false,
  });
  
  const supabase = createClient();

  // Function to get time-based greeting
  const getTimeBasedGreeting = (name?: string) => {
    const hour = new Date().getHours();
    const nameText = name ? ` ${name}` : "";
    if (hour < 12) return `Good morning${nameText}`;
    if (hour < 17) return `Good afternoon${nameText}`;
    return `Good evening${nameText}`;
  };

  // Step 3: Add Navigation and Input Handlers
  // Functions to move between steps
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // A general function to handle changes in text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested object properties (e.g., onboarding_data.website)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'onboarding_data') {
        setFormData(prev => ({
          ...prev,
          onboarding_data: {
            ...prev.onboarding_data,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Reset username availability check when username changes
    if (name === 'username') {
      setUsernameAvailable(null);
      setUsernameCheckMessage('');
    }
  };

  // Helper function for handling complex input changes
  const handleComplexInputChange = (name: string, value: string | string[] | boolean) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'onboarding_data') {
        setFormData(prev => ({
          ...prev,
          onboarding_data: {
            ...prev.onboarding_data,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Username availability checking
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState('');
  
  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Copy state for invite link
  const [isCopied, setIsCopied] = useState(false);

  const totalSteps = 6;

  // Fetch user profile on component mount
  useEffect(() => {
    const clearCorruptedCookies = () => {
      // Clear potentially corrupted Supabase cookies
      const cookiesToClear = [
        'sb-access-token',
        'sb-refresh-token', 
        'supabase-auth-token',
        'supabase.auth.token'
      ];
      
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    };

    const fetchUserProfile = async () => {
      try {
        // Wait a bit for session to be fully established after redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let { data: { user }, error: userError } = await supabase.auth.getUser();
        
        // If we get a session missing error, try clearing cookies and refreshing
        if (userError?.message?.includes('Auth session missing') || 
            userError?.message?.includes('Failed to parse cookie')) {
          clearCorruptedCookies();
          
          // Try to refresh the session
          await supabase.auth.refreshSession();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Retry getting user
          const retry = await supabase.auth.getUser();
          user = retry.data.user;
          userError = retry.error;
        }
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username, email')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserProfile({ 
              first_name: profile.full_name?.split(' ')[0] || profile.username || 'there',
              last_name: profile.full_name?.split(' ').slice(1).join(' ')
            });
          } else {
            setUserProfile({ first_name: 'there' });
          }
        } else {
          setUserProfile({ first_name: 'there' });
        }
              } catch {
          setUserProfile({ first_name: 'there' });
        }
    };

    fetchUserProfile();
  }, [supabase]);

  // Auto-detect user's country and phone
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code && !formData.country) {
          handleComplexInputChange('country', data.country_code);
        }
      } catch {
        console.log('Could not detect location');
      }
    };

    detectUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check username availability with debounce
  useEffect(() => {
    const performUsernameCheck = async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        setUsernameCheckMessage('');
        return;
      }

      setIsCheckingUsername(true);
      setUsernameCheckMessage('');

      try {
        // Use server action to check username availability (bypasses RLS)
        const result = await checkUsernameAvailability(username);
        
        setUsernameAvailable(result.available);
        setUsernameCheckMessage(result.message);
      } catch {
        setUsernameAvailable(false);
        setUsernameCheckMessage('Error checking username availability');
      } finally {
        setIsCheckingUsername(false);
      }
    };

    // Debounce the username check
    const timeoutId = setTimeout(() => {
      if (formData.username) {
        performUsernameCheck(formData.username);
      }
    }, 800); // Wait 800ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // Fetch actual invite code when reaching step 6
  useEffect(() => {
    const fetchInviteCode = async () => {
      if (step === 6) {
        try {
          const result = await getAffiliateInviteCode();
          if (result.success && result.inviteCode) {
            setActualInviteCode(result.inviteCode);
          } else {
            // Fallback to just the username if fetch fails
            setActualInviteCode(formData.username.toUpperCase());
          }
        } catch (error) {
          console.error('Error fetching invite code:', error);
          // Fallback to just the username
          setActualInviteCode(formData.username.toUpperCase());
        }
      }
    };

    fetchInviteCode();
  }, [step, formData.username]);

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUsernameCheckMessage('Please select an image file (JPG, PNG, GIF, WebP)');
      setTimeout(() => setUsernameCheckMessage(''), 3000);
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUsernameCheckMessage('File size must be less than 10MB');
      setTimeout(() => setUsernameCheckMessage(''), 3000);
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Get current user for unique filename
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update form data with avatar URL
      handleComplexInputChange('avatar_url', publicUrl);

    } catch (error) {
      console.error('Avatar upload error:', error);
      setUsernameCheckMessage('Failed to upload image. Please try again.');
      setTimeout(() => setUsernameCheckMessage(''), 3000);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Country options from countries-list package
  const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: country.name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  // Language options from ISO6391 package
  const languageOptions = ISO6391.getAllNames().map((name) => ({
    value: ISO6391.getCode(name),
    label: name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const customSelectStyles = {
    control: (provided: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid',
      borderColor: state.isFocused ? '#8b5cf6' : '#cbd5e1',
      borderRadius: '0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#8b5cf6',
      },
    }),
    option: (provided: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f3f4f6' : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#8b5cf6' : '#f3f4f6',
      },
    }),
    singleValue: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#374151',
    }),
    input: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#374151',
    }),
    menu: (provided: Record<string, unknown>) => ({
      ...provided,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    }),
  };

  const darkSelectStyles = {
    control: (provided: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid',
      borderColor: state.isFocused ? '#a78bfa' : '#4b5563',
      borderRadius: '0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#a78bfa',
      },
    }),
    option: (provided: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#374151' : 'transparent',
      color: state.isSelected ? 'white' : '#d1d5db',
      '&:hover': {
        backgroundColor: state.isSelected ? '#8b5cf6' : '#374151',
      },
    }),
    singleValue: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#d1d5db',
    }),
    input: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#d1d5db',
    }),
    menu: (provided: Record<string, unknown>) => ({
      ...provided,
      backgroundColor: '#1f2937',
      border: '1px solid #4b5563',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    }),
  };



  const validateStep3 = () => {
    // Languages are optional, but other fields are required
    return formData.phone_number && formData.country && formData.gender && formData.date_of_birth;
  };

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };





  const handleOnboardingSubmit = async () => {
    // Set a loading state to disable the button and show a loader
    setIsLoading(true);

    try {
      // Convert formData to match server action expectations
      const submissionData = {
        ...formData,
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : undefined,
        onboarding_data: formData.onboarding_data,
        avatar_url: formData.avatar_url || undefined // Ensure avatar_url is included
      };

      // Call the server action with the collected form data
      await completeAffiliateOnboarding(submissionData);

      // The server action will handle the redirect on success,
      // so we don't need to do anything else here.

    } catch (error) {
      console.error("Onboarding submission failed:", error);
      // You can set an error message state here to show it to the user
      setIsLoading(false); // Re-enable the button on failure
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {getTimeBasedGreeting(userProfile?.first_name)}! Welcome to the Wish Consult Partner Program!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                You&apos;re about to join an exclusive community of successful partners. Let&apos;s get you set up in just a few minutes.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                What You&apos;ll Get as a Partner:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Your Unique Invite Link</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Share with your audience and track every click</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Real-time Dashboard</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Monitor your earnings and performance instantly</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Marketing Materials</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Professional banners, copy, and resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Secure Payments</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Multiple payment methods when you&apos;re ready to withdraw</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Create Your Public Identity
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Set up your unique profile that will be visible to your audience and help build trust.
              </p>
            </div>

            <div className="space-y-8">
              {/* Profile Picture Upload */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Profile Picture
                </h3>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full border-2 border-dashed border-purple-300 dark:border-purple-600 flex items-center justify-center overflow-hidden">
                      {formData.avatar_url ? (
                        <Image
                          src={formData.avatar_url}
                          alt="Profile preview"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-center">
                          <User className="h-12 w-12 text-purple-400 dark:text-purple-500 mx-auto" />
                        </div>
                      )}
                      {/* Upload Loading Overlay */}
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <InlineLoader width={24} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="avatar_url"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                    <label
                      htmlFor="avatar_url"
                      className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                        isUploadingAvatar 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-purple-500 hover:bg-purple-600 cursor-pointer'
                      }`}
                    >
                      {isUploadingAvatar ? (
                        <InlineLoader width={12} />
                      ) : (
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </label>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isUploadingAvatar 
                      ? 'Uploading your photo...' 
                      : 'A profile picture helps build trust with your audience'
                    }
                  </p>
                  {formData.avatar_url && !isUploadingAvatar && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Photo uploaded successfully
                    </p>
                  )}
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Username
                </h3>
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Choose Your Unique Username *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-transparent border-b-2 ${
                        errors.username 
                          ? 'border-red-500 dark:border-red-400' 
                          : usernameAvailable === true
                          ? 'border-green-500 dark:border-green-400'
                          : usernameAvailable === false
                          ? 'border-red-500 dark:border-red-400'
                          : 'border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400'
                      } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg`}
                      placeholder="Enter your unique username"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isCheckingUsername ? (
                        <InlineLoader width={16} />
                      ) : usernameAvailable === true ? (
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : usernameAvailable === false ? (
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                  {errors.username && (
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.username}</p>
                  )}
                  {!errors.username && usernameCheckMessage && (
                    <p className={`text-sm ${
                      usernameAvailable === true 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {usernameCheckMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Tell Us About Yourself
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                This information helps us understand our affiliate community better and provide you with personalized support and opportunities.
              </p>
            </div>

            <div className="space-y-6">
              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phone_number" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number *
                </label>
                <div className="relative border-b-2 border-slate-300 dark:border-slate-600 focus-within:border-purple-500 dark:focus-within:border-purple-400 transition-colors">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={formData.phone_number as string}
                    onChange={(value) => handleComplexInputChange('phone_number', value || "")}
                    placeholder="Enter your phone number"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We&apos;ll use this for important updates and support when needed
                </p>
              </div>

              {/* Region/Country */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Country *
                </label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(option => option.value === formData.country)}
                  onChange={(option) => handleComplexInputChange('country', option?.value || "")}
                  styles={theme === "dark" ? darkSelectStyles : customSelectStyles}
                  placeholder="Select your country"
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.label}</span>
                    </div>
                  )}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This helps us understand our global affiliate community
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Gender *
                </label>
                <div className="space-y-2">
                  {["Male", "Female", "Prefer not to say"].map((gender) => (
                    <label key={gender} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 bg-transparent border-slate-300 dark:border-slate-600 focus:ring-purple-500 dark:focus:ring-purple-400"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Date of Birth *
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleComplexInputChange('date_of_birth', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg"
                    />
                  </div>
                  {formData.date_of_birth && (
                    <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        {calculateAge(formData.date_of_birth)} years old
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  We&apos;ll send you birthday wishes and special offers!
                </p>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Languages You Speak (Other than English) - Optional
                </label>
                <Select
                  isMulti
                  isSearchable
                  options={languageOptions}
                  value={languageOptions.filter(option => formData.languages.includes(option.value))}
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    handleComplexInputChange('languages', selectedValues);
                  }}
                  styles={theme === "dark" ? darkSelectStyles : customSelectStyles}
                  placeholder="Search and select languages you speak..."
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.label}</span>
                    </div>
                  )}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Optional: This helps us provide content and support in your preferred languages
                </p>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Tell Us How You&apos;ll Promote
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Help us understand your marketing strategy and ensure we&apos;re a great fit for your audience.
              </p>
            </div>

            <div className="space-y-8">
              {/* Website or Social Media Link */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Your Primary Platform
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Website or Social Media Link
                  </label>
                  <input
                    type="url"
                    name="onboarding_data.website"
                    value={formData.onboarding_data.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg"
                    placeholder="https://yourwebsite.com or @yourusername"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    This helps us understand your content and audience better
                  </p>
                </div>
              </div>

              {/* Promotion Methods */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  How Will You Share Wish Consult?
                </h3>
                <div className="space-y-4">
                  {[
                    { value: "blog", label: "Blog or Website", icon: FileText },
                    { value: "youtube", label: "YouTube Channel", icon: Youtube },
                    { value: "social", label: "Social Media", icon: Share2 },
                    { value: "email", label: "Email Newsletter", icon: Mail },
                    { value: "wordofmouth", label: "Word of Mouth", icon: MessageCircle },
                    { value: "other", label: "Other", icon: Plus }
                  ].map((method) => {
                    const IconComponent = method.icon;
                    const isSelected = formData.onboarding_data.promotionMethods.includes(method.value);
                    
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...formData.onboarding_data.promotionMethods, method.value]
                              : formData.onboarding_data.promotionMethods.filter(m => m !== method.value);
                            handleComplexInputChange('onboarding_data.promotionMethods', newMethods);
                          }}
                          className="w-5 h-5 text-purple-600 bg-transparent border-slate-300 dark:border-slate-600 focus:ring-purple-500 dark:focus:ring-purple-400 rounded"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected 
                              ? "bg-purple-100 dark:bg-purple-800" 
                              : "bg-slate-100 dark:bg-slate-800"
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              isSelected 
                                ? "text-purple-600 dark:text-purple-400" 
                                : "text-slate-600 dark:text-slate-400"
                            }`} />
                          </div>
                          <span className={`font-medium ${
                            isSelected 
                              ? "text-purple-900 dark:text-purple-100" 
                              : "text-slate-700 dark:text-slate-300"
                          }`}>
                            {method.label}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                
                {/* Other promotion method input */}
                {formData.onboarding_data.promotionMethods.includes("other") && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                    <label className="block text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Please specify your other promotion method:
                    </label>
                    <input
                      type="text"
                      value={formData.onboarding_data.otherPromotionMethod || ""}
                      onChange={(e) => handleComplexInputChange('onboarding_data.otherPromotionMethod', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border-b-2 border-purple-300 dark:border-purple-600 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg"
                      placeholder="e.g., Podcast, Webinars, Local Events, etc."
                    />
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips for Success:
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Share your unique invite link in your content</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Create authentic reviews and testimonials</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Engage with your audience about the courses</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Use our marketing materials for consistency</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Review & Agree to Terms
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Please review our affiliate program terms and conditions before proceeding.
              </p>
            </div>

            <div className="space-y-8">
              {/* Terms and Conditions */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Affiliate Program Terms & Conditions
                </h3>
                <div className="space-y-4 text-sm text-purple-800 dark:text-purple-200">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">1. Program Participation</h4>
                    <p>By joining our affiliate program, you agree to promote our courses ethically and in accordance with our brand guidelines.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">2. Commission Structure</h4>
                    <p>You&apos;ll earn commissions on course purchases made through your unique invite links. Commission rates and payment terms are subject to our current program policies.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">3. Content Guidelines</h4>
                    <p>All promotional content must be accurate, honest, and comply with applicable laws and regulations. Misleading claims or false advertising are strictly prohibited.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">4. Payment & Payouts</h4>
                    <p>Commissions are calculated and paid according to our payment schedule. Minimum payout thresholds and payment methods are detailed in your dashboard.</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">5. Program Termination</h4>
                    <p>We reserve the right to terminate affiliate partnerships for violations of our terms or for any other reason at our discretion.</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-300 dark:border-purple-700">
                  <Link 
                    href="/affiliate/terms" 
                    target="_blank"
                    className="inline-flex items-center gap-2 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-semibold transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Read Full Terms & Conditions
                  </Link>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms || false}
                    onChange={(e) => handleComplexInputChange('agreeToTerms', e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-transparent border-slate-300 dark:border-slate-600 focus:ring-purple-500 dark:focus:ring-purple-400 rounded mt-0.5"
                  />
                  <div className="space-y-2">
                    <label htmlFor="agreeToTerms" className="block text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
                      I have read and agree to the Wish Consult Affiliate Program Terms
                    </label>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      By checking this box, you confirm that you have read, understood, and agree to be bound by our affiliate program terms and conditions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Important Notice:
                </h4>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>• Your affiliate account will be activated immediately after agreeing to these terms</p>
                  <p>• You&apos;ll receive your unique invite link and access to your dashboard</p>
                  <p>• You can start promoting and earning commissions right away</p>
                  <p>• Our support team is available to help you succeed</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Setup Complete! You&apos;re Ready to Earn!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Congratulations! Your affiliate account is now active. Here&apos;s your unique invite link to start earning:
              </p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Default Invite Code
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm text-slate-700 dark:text-slate-300 flex-1 text-left break-all">
                    {actualInviteCode ? `https://wishconsult.app/?invite=${actualInviteCode}` : 'Loading your invite code...'}
                  </code>
                  <button 
                    onClick={() => {
                      const inviteLink = actualInviteCode ? `https://wishconsult.app/?invite=${actualInviteCode}` : 'https://wishconsult.app/?invite=LOADING';
                      navigator.clipboard.writeText(inviteLink);
                      setIsCopied(true);
                      // Reset copied state after 2 seconds
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    disabled={!actualInviteCode}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                      !actualInviteCode
                        ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                        : isCopied 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-slate-600 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {!actualInviteCode ? (
                      <>
                        <InlineLoader width={16} />
                        Loading...
                      </>
                    ) : isCopied ? (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                Share this link with your audience to start earning commissions on course purchases!
              </p>
            </div>
            
            {/* Dashboard Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm mb-1">
                    Need More Invite Codes?
                  </h4>
                  <p className="text-xs text-indigo-800 dark:text-indigo-200">
                    You can generate additional custom invite codes anytime in your dashboard under <strong>&quot;My Links&quot;</strong>. Create different codes for different campaigns and track their performance separately!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Next Steps to Success:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Share Your Link</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Post your invite link on your platforms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Track Performance</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Monitor clicks and conversions in your dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Access Materials</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Download banners, copy, and marketing resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Set Up Payments</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Add payment details when ready to withdraw</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Welcome to the Partner Community!
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                You&apos;re now part of an exclusive community of successful affiliates. Our support team is here to help you succeed, and we&apos;ll keep you updated with the latest opportunities and tips.
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-slate-600 dark:text-slate-400">
            Step {step} content coming soon...
          </div>
        );
    }
  };

  // Inject custom phone input styles
  useEffect(() => {
    const phoneInputStyles = `
      .PhoneInput {
        display: flex;
        align-items: center;
        border-bottom: 2px solid #cbd5e1;
        transition: border-color 0.2s;
      }
      
      .PhoneInput:focus-within {
        border-color: #8b5cf6;
      }
      
      .dark .PhoneInput {
        border-color: #4b5563;
      }
      
      .dark .PhoneInput:focus-within {
        border-color: #a78bfa;
      }
      
      .PhoneInputCountry {
        margin-right: 0.5rem;
      }
      
      .PhoneInputInput {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        padding: 0.75rem 0;
        font-size: 1.125rem;
        color: #374151;
      }
      
      .dark .PhoneInputInput {
        color: #d1d5db;
      }
      
      .PhoneInputInput::placeholder {
        color: #9ca3af;
      }
      
      .dark .PhoneInputInput::placeholder {
        color: #6b7280;
      }
    `;

    const style = document.createElement('style');
    style.textContent = phoneInputStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Step {step} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {step === 4 && (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Skip This Step
                </button>
              )}
              
              {step === 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Begin Setup
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : step === 2 ? (
                <button
                  onClick={nextStep}
                  disabled={!formData.username.trim() || formData.username.length < 3 || isCheckingUsername || usernameAvailable !== true}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Confirm & Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : step === 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!validateStep3()}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Save & Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : step === 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Save & Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : step === 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!formData.agreeToTerms}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Complete Setup & Get My Invite Code
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : step === 6 ? (
                <button
                  onClick={handleOnboardingSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <InlineLoader width={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      Go to My Affiliate Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : step < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={onComplete}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Complete Setup
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}