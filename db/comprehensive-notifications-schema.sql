-- =====================================================
-- COMPREHENSIVE NOTIFICATION SYSTEM - ALL TYPES
-- Wish Consult - Healthcare E-Learning Platform
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Drop ALL existing functions if they exist
DROP FUNCTION IF EXISTS notify_course_completion() CASCADE;
DROP FUNCTION IF EXISTS notify_commission_earned() CASCADE;
DROP FUNCTION IF EXISTS notify_new_user_signup() CASCADE;
DROP FUNCTION IF EXISTS notify_announcement_published() CASCADE;
DROP FUNCTION IF EXISTS notify_certificate_ready() CASCADE;
DROP FUNCTION IF EXISTS notify_payout_processed() CASCADE;
DROP FUNCTION IF EXISTS notify_new_invite() CASCADE;
DROP FUNCTION IF EXISTS notify_milestone_achievement() CASCADE;
DROP FUNCTION IF EXISTS notify_course_submission() CASCADE;
DROP FUNCTION IF EXISTS create_security_alert() CASCADE;
DROP FUNCTION IF EXISTS send_assignment_due_reminders() CASCADE;
DROP FUNCTION IF EXISTS create_maintenance_notification() CASCADE;
DROP FUNCTION IF EXISTS create_revenue_milestone_notification() CASCADE;

-- =====================================================
-- CORE NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(30) NOT NULL DEFAULT 'general',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  action_url VARCHAR(500),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  icon VARCHAR(50) DEFAULT 'bell',
  image_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  
  -- Constraints
  CONSTRAINT valid_type CHECK (type ~ '^[a-z_]+$'),
  CONSTRAINT valid_category CHECK (category ~ '^[a-z_]+$'),
  CONSTRAINT title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT message_not_empty CHECK (char_length(trim(message)) > 0)
);

-- =====================================================
-- USER NOTIFICATION PREFERENCES TABLE
-- =====================================================

CREATE TABLE notification_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one preference per user per type
  UNIQUE(user_id, type),
  
  -- Constraints
  CONSTRAINT valid_preference_type CHECK (type ~ '^[a-z_]+$')
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Primary query indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_created_desc ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Preference indexes
CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);
CREATE INDEX idx_notification_preferences_type ON notification_preferences(type);

-- Composite indexes for common queries
CREATE INDEX idx_notifications_user_type_unread ON notifications(user_id, type, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_user_category_created ON notifications(user_id, category, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (user_id = auth.uid());

-- Notification Preferences Policies
CREATE POLICY "Users can view own preferences" ON notification_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own preferences" ON notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at 
  BEFORE UPDATE ON notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CORE NOTIFICATION CREATION FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_category VARCHAR(30),
  p_title VARCHAR(255),
  p_message TEXT,
  p_data JSONB DEFAULT '{}',
  p_action_url VARCHAR(500) DEFAULT NULL,
  p_priority VARCHAR(20) DEFAULT 'medium',
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_icon VARCHAR(50) DEFAULT 'bell',
  p_image_url VARCHAR(500) DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
  notification_id BIGINT;
  pref_enabled BOOLEAN DEFAULT true;
BEGIN
  -- Check if user has disabled this notification type
  SELECT in_app_enabled INTO pref_enabled
  FROM notification_preferences
  WHERE user_id = p_user_id AND type = p_type;
  
  -- If no preference exists, default to enabled
  IF pref_enabled IS NULL THEN
    pref_enabled := true;
  END IF;
  
  -- Only create notification if enabled
  IF pref_enabled THEN
    INSERT INTO notifications (
      user_id, type, category, title, message, data, 
      action_url, priority, expires_at, icon, image_url
    ) VALUES (
      p_user_id, p_type, p_category, p_title, p_message, p_data,
      p_action_url, p_priority, p_expires_at, p_icon, p_image_url
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_notifications_for_role(
  p_role VARCHAR(20),
  p_type VARCHAR(50),
  p_category VARCHAR(30),
  p_title VARCHAR(255),
  p_message TEXT,
  p_data JSONB DEFAULT '{}',
  p_action_url VARCHAR(500) DEFAULT NULL,
  p_priority VARCHAR(20) DEFAULT 'medium',
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_icon VARCHAR(50) DEFAULT 'bell'
)
RETURNS INTEGER AS $$
DECLARE
  notification_count INTEGER := 0;
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id FROM profiles WHERE role = p_role AND status = 'active'
  LOOP
    IF create_notification(
      user_record.id, p_type, p_category, p_title, p_message, 
      p_data, p_action_url, p_priority, p_expires_at, p_icon
    ) IS NOT NULL THEN
      notification_count := notification_count + 1;
    END IF;
  END LOOP;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 1. COURSE & LEARNING NOTIFICATIONS
-- =====================================================

-- Course Completion
CREATE OR REPLACE FUNCTION notify_course_completion()
RETURNS TRIGGER AS $$
DECLARE
  course_title VARCHAR(255);
BEGIN
  IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
    SELECT title INTO course_title FROM courses WHERE id = NEW.course_id;
    
    PERFORM create_notification(
      NEW.user_id, 'course_completed', 'course',
      'Course Completed!',
      'Congratulations! You have successfully completed "' || course_title || '"',
      jsonb_build_object('course_id', NEW.course_id, 'course_title', course_title),
      '/dashboard/certificates', 'high', NULL, 'graduation-cap'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER course_completion_notification
  AFTER UPDATE ON progress FOR EACH ROW
  EXECUTE FUNCTION notify_course_completion();

-- Certificate Ready
CREATE OR REPLACE FUNCTION notify_certificate_ready()
RETURNS TRIGGER AS $$
DECLARE
  cert_name VARCHAR(255);
BEGIN
  IF TG_OP = 'INSERT' THEN
    cert_name := COALESCE(NEW.name, 'Certificate');
    
    PERFORM create_notification(
      NEW.user_id, 'certificate_ready', 'achievement',
      'Certificate Ready!',
      'Your certificate for "' || cert_name || '" is ready for download',
      jsonb_build_object('certificate_id', NEW.id, 'certificate_name', cert_name),
      '/dashboard/certificates/' || NEW.id, 'high', NULL, 'award'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER certificate_ready_notification
  AFTER INSERT ON certifications FOR EACH ROW
  EXECUTE FUNCTION notify_certificate_ready();

-- =====================================================
-- 2. ANNOUNCEMENT NOTIFICATIONS
-- =====================================================

CREATE OR REPLACE FUNCTION notify_announcement_published()
RETURNS TRIGGER AS $$
DECLARE
  announcement_record RECORD;
BEGIN
  IF NEW.status = 'published' AND (OLD.status != 'published' OR OLD.status IS NULL) THEN
    SELECT * INTO announcement_record FROM announcements WHERE id = NEW.id;
    
    -- All users
    IF announcement_record.target_audience = 'all' THEN
      INSERT INTO notifications (user_id, type, category, title, message, data, action_url, priority, icon)
      SELECT p.id, 'announcement', 'system', 'New Announcement', announcement_record.title,
             jsonb_build_object('announcement_id', announcement_record.id),
             '/announcements/' || announcement_record.id,
             COALESCE(announcement_record.priority, 'medium'), 'megaphone'
      FROM profiles p WHERE p.status = 'active'
      AND NOT EXISTS (
        SELECT 1 FROM notification_preferences np 
        WHERE np.user_id = p.id AND np.type = 'announcement' AND np.in_app_enabled = false
      );
      
    -- Specific role
    ELSIF announcement_record.target_audience IN ('students', 'affiliates', 'admins') THEN
      INSERT INTO notifications (user_id, type, category, title, message, data, action_url, priority, icon)
      SELECT p.id, 'announcement', 'system', 'New Announcement', announcement_record.title,
             jsonb_build_object('announcement_id', announcement_record.id),
             '/announcements/' || announcement_record.id,
             COALESCE(announcement_record.priority, 'medium'), 'megaphone'
      FROM profiles p WHERE p.role = announcement_record.target_audience AND p.status = 'active'
      AND NOT EXISTS (
        SELECT 1 FROM notification_preferences np 
        WHERE np.user_id = p.id AND np.type = 'announcement' AND np.in_app_enabled = false
      );
      
    -- Specific user
    ELSIF announcement_record.target_audience = 'user' AND announcement_record.target_user_id IS NOT NULL THEN
      PERFORM create_notification(
        announcement_record.target_user_id, 'announcement', 'system',
        'New Announcement', announcement_record.title,
        jsonb_build_object('announcement_id', announcement_record.id),
        '/announcements/' || announcement_record.id,
        COALESCE(announcement_record.priority, 'medium'), NULL, 'megaphone'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER announcement_published_notification
  AFTER UPDATE ON announcements FOR EACH ROW
  EXECUTE FUNCTION notify_announcement_published();

-- =====================================================
-- 3. AFFILIATE & COMMISSION NOTIFICATIONS
-- =====================================================

-- Commission Earned
CREATE OR REPLACE FUNCTION notify_commission_earned()
RETURNS TRIGGER AS $$
DECLARE
  student_name VARCHAR(255);
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT full_name INTO student_name FROM profiles WHERE id = NEW.invited_user_id;
    
    PERFORM create_notification(
      NEW.affiliate_id, 'commission_earned', 'payment',
      'Commission Earned!',
      'You earned $' || NEW.commission_amount || ' from ' || COALESCE(student_name, 'a student') || '''s enrollment',
      jsonb_build_object('commission_id', NEW.id, 'amount', NEW.commission_amount, 'student_id', NEW.invited_user_id, 'student_name', student_name),
      '/affiliate/dashboard/earnings', 'high', NULL, 'dollar-sign'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER commission_earned_notification
  AFTER INSERT ON commissions FOR EACH ROW
  EXECUTE FUNCTION notify_commission_earned();

-- Payout Processed
CREATE OR REPLACE FUNCTION notify_payout_processed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM create_notification(
      NEW.affiliate_id, 'payout_processed', 'payment',
      'Payout Processed!',
      'Your $' || NEW.amount || ' payout has been processed and sent to your account',
      jsonb_build_object('payout_id', NEW.id, 'amount', NEW.amount, 'completed_at', NEW.completed_at),
      '/affiliate/dashboard/payouts', 'high', NULL, 'bank'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER payout_processed_notification
  AFTER UPDATE ON payout_requests FOR EACH ROW
  EXECUTE FUNCTION notify_payout_processed();

-- New Invite
CREATE OR REPLACE FUNCTION notify_new_invite()
RETURNS TRIGGER AS $$
DECLARE
  student_name VARCHAR(255);
BEGIN
  IF TG_OP = 'INSERT' AND NEW.invited_by IS NOT NULL THEN
    student_name := COALESCE(NEW.full_name, NEW.email, 'New user');
    
    PERFORM create_notification(
      NEW.invited_by, 'new_invite', 'invite',
      'New Invite Signup!',
      student_name || ' signed up using your invite link',
      jsonb_build_object('student_id', NEW.id, 'student_name', student_name, 'student_email', NEW.email),
      '/affiliate/dashboard/invites', 'medium', NULL, 'user-plus'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER new_invite_notification
  AFTER INSERT ON profiles FOR EACH ROW
  EXECUTE FUNCTION notify_new_invite();

-- Milestone Achievements
CREATE OR REPLACE FUNCTION notify_milestone_achievement()
RETURNS TRIGGER AS $$
DECLARE
  milestone_count INTEGER;
  milestone_type VARCHAR(100);
BEGIN
  IF NEW.uses > OLD.uses THEN
    milestone_count := NEW.uses;
    
    IF milestone_count IN (1, 5, 10, 25, 50, 100, 250, 500) THEN
      milestone_type := CASE 
        WHEN milestone_count = 1 THEN 'First Invite!'
        WHEN milestone_count = 5 THEN '5 Invites Milestone!'
        WHEN milestone_count = 10 THEN '10 Invites Milestone!'
        WHEN milestone_count = 25 THEN '25 Invites Milestone!'
        WHEN milestone_count = 50 THEN '50 Invites Milestone!'
        WHEN milestone_count = 100 THEN '100 Invites Milestone!'
        WHEN milestone_count = 250 THEN '250 Invites Milestone!'
        WHEN milestone_count = 500 THEN '500 Invites Milestone!'
      END;
      
      PERFORM create_notification(
        NEW.affiliate_id, 'milestone_reached', 'achievement',
        milestone_type,
        'Congratulations! You have reached ' || milestone_count || ' successful invites',
        jsonb_build_object('milestone_count', milestone_count, 'invite_code_id', NEW.id),
        '/affiliate/dashboard/analytics', 'high', NULL, 'trophy'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER milestone_achievement_notification
  AFTER UPDATE ON invite_codes FOR EACH ROW
  EXECUTE FUNCTION notify_milestone_achievement();

-- =====================================================
-- 4. ADMIN & SYSTEM  
-- =====================================================

-- New User Signup (for admins)
CREATE OR REPLACE FUNCTION notify_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.invited_by IS NULL THEN -- Only direct signups, not invites
    PERFORM create_notifications_for_role(
      'admin', 'new_user_signup', 'user',
      'New User Registration',
      'New user "' || COALESCE(NEW.full_name, NEW.email, 'Unknown') || '" has registered',
      jsonb_build_object('user_id', NEW.id, 'user_name', NEW.full_name, 'user_email', NEW.email, 'user_role', NEW.role),
      '/admin/users/' || NEW.id, 'low', NULL, 'user-plus'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER new_user_signup_notification
  AFTER INSERT ON profiles FOR EACH ROW
  EXECUTE FUNCTION notify_new_user_signup();

-- Course Submission for Review
CREATE OR REPLACE FUNCTION notify_course_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_notifications_for_role(
      'admin', 'course_submitted', 'content',
      'New Course Submitted',
      'Course "' || NEW.title || '" has been submitted for review',
      jsonb_build_object('course_id', NEW.id, 'course_title', NEW.title, 'course_category', NEW.category),
      '/admin/courses/' || NEW.id, 'medium', NULL, 'book'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER course_submission_notification
  AFTER INSERT ON courses FOR EACH ROW
  EXECUTE FUNCTION notify_course_submission();

-- =====================================================
-- 5. UTILITY & MAINTENANCE FUNCTIONS
-- =====================================================

-- Security Alert Function
CREATE OR REPLACE FUNCTION create_security_alert(
  p_user_id UUID,
  p_alert_type VARCHAR(50),
  p_message TEXT,
  p_severity VARCHAR(20) DEFAULT 'high'
)
RETURNS INTEGER AS $$
BEGIN
  RETURN create_notifications_for_role(
    'admin', 'security_alert', 'security',
    'Security Alert', p_message,
    jsonb_build_object('user_id', p_user_id, 'alert_type', p_alert_type, 'detected_at', NOW()),
    '/admin/security/alerts', p_severity, NULL, 'shield-alert'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- System Maintenance Notifications
CREATE OR REPLACE FUNCTION create_maintenance_notification(
  p_maintenance_date TIMESTAMP WITH TIME ZONE,
  p_duration_hours INTEGER,
  p_description TEXT
)
RETURNS INTEGER AS $$
BEGIN
  RETURN create_notifications_for_role(
    'admin', 'system_maintenance', 'system',
    'Scheduled Maintenance',
    'System maintenance scheduled for ' || to_char(p_maintenance_date, 'YYYY-MM-DD HH24:MI') || ' (Duration: ' || p_duration_hours || ' hours). ' || p_description,
    jsonb_build_object('maintenance_date', p_maintenance_date, 'duration_hours', p_duration_hours, 'description', p_description),
    '/admin/settings/maintenance', 'high',
    p_maintenance_date - INTERVAL '24 hours', 'wrench'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revenue Milestone Notifications
CREATE OR REPLACE FUNCTION create_revenue_milestone_notification(
  p_milestone_amount DECIMAL,
  p_current_amount DECIMAL,
  p_period VARCHAR(20)
)
RETURNS INTEGER AS $$
BEGIN
  RETURN create_notifications_for_role(
    'admin', 'revenue_milestone', 'business',
    'Revenue Milestone Achieved!',
    p_period || ' revenue milestone of $' || p_milestone_amount || ' achieved! Current: $' || p_current_amount,
    jsonb_build_object('milestone_amount', p_milestone_amount, 'current_amount', p_current_amount, 'period', p_period),
    '/admin/analytics/revenue', 'high', NULL, 'trending-up'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assignment Due Reminders (scheduled function)
CREATE OR REPLACE FUNCTION send_assignment_due_reminders()
RETURNS INTEGER AS $$
DECLARE
  reminder_count INTEGER := 0;
BEGIN
  -- Placeholder for when assignments table is implemented
  -- This function would be called by a scheduled job
  RETURN reminder_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. CLEANUP FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications WHERE read_at IS NOT NULL AND read_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. DEFAULT PREFERENCES SETUP
-- =====================================================

CREATE OR REPLACE FUNCTION create_default_notification_preferences(user_id UUID)
RETURNS VOID AS $$
DECLARE
  pref_types TEXT[] := ARRAY[
    'course_completed', 'certificate_ready', 'commission_earned', 'payout_processed',
    'milestone_reached', 'new_invite', 'announcement', 'system_alert',
    'new_user_signup', 'course_submitted', 'security_alert', 'system_maintenance',
    'revenue_milestone', 'assignment_due'
  ];
  pref_type TEXT;
BEGIN
  FOREACH pref_type IN ARRAY pref_types
  LOOP
    INSERT INTO notification_preferences (user_id, type, email_enabled, push_enabled, in_app_enabled)
    VALUES (user_id, pref_type, true, true, true)
    ON CONFLICT (user_id, type) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON notification_preferences TO authenticated;
GRANT USAGE ON SEQUENCE notifications_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE notification_preferences_id_seq TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION create_notifications_for_role TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_notification_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION create_security_alert TO authenticated;
GRANT EXECUTE ON FUNCTION create_maintenance_notification TO authenticated;
GRANT EXECUTE ON FUNCTION create_revenue_milestone_notification TO authenticated;
GRANT EXECUTE ON FUNCTION send_assignment_due_reminders TO authenticated;

-- =====================================================
-- 9. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE notifications IS 'Comprehensive notifications for all user interactions';
COMMENT ON TABLE notification_preferences IS 'User preferences for notification delivery methods';

-- =====================================================
-- END OF COMPREHENSIVE SCHEMA
-- =====================================================