export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  username: string | null;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  status: string;
  onboarding_data: Record<string, unknown> | null;
  invited_by: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  onboarding_completed: boolean;
}

export interface Course {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  category: string | null;
  is_free: boolean;
}

export interface Feedback {
  id: string;
  user_id: string;
  segment_id: string;
  created_at: string;
  rating: number | null;
  text_feedback: string | null;
  video_feedback_url: string | null;
  status: string;
} 