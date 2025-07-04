-- Fix announcement notification trigger to use content instead of title for message
-- This fixes the issue where announcement notifications only show the title, not the content

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
      SELECT p.id, 'announcement', 'system', announcement_record.title, announcement_record.content,
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
      SELECT p.id, 'announcement', 'system', announcement_record.title, announcement_record.content,
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
        announcement_record.title, announcement_record.content,
        jsonb_build_object('announcement_id', announcement_record.id),
        '/announcements/' || announcement_record.id,
        COALESCE(announcement_record.priority, 'medium'), NULL, 'megaphone'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger is already created, so this will update the function
-- No need to recreate the trigger since we're just replacing the function 