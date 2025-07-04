-- Admin Audit Trail Table
-- Tracks all admin actions for security and accountability

CREATE TABLE IF NOT EXISTS admin_audit_trail (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- e.g., 'ANNOUNCEMENT_CREATED', 'USER_PROMOTED', etc.
  resource_type VARCHAR(50) NOT NULL, -- e.g., 'announcement', 'user', 'course'
  resource_id VARCHAR(100) NOT NULL, -- ID of the affected resource
  details JSONB, -- Additional details about the action
  ip_address INET, -- IP address of the admin
  user_agent TEXT, -- Browser/device info
  session_id VARCHAR(255), -- Session identifier
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin_id ON admin_audit_trail(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON admin_audit_trail(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_resource ON admin_audit_trail(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at ON admin_audit_trail(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE admin_audit_trail ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admin_audit_trail_select_policy" ON admin_audit_trail
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE admin_audit_trail IS 'Comprehensive audit trail for all admin actions';
COMMENT ON COLUMN admin_audit_trail.admin_id IS 'ID of the admin who performed the action';
COMMENT ON COLUMN admin_audit_trail.action IS 'Type of action performed (e.g., ANNOUNCEMENT_CREATED)';
COMMENT ON COLUMN admin_audit_trail.resource_type IS 'Type of resource affected (e.g., announcement, user)';
COMMENT ON COLUMN admin_audit_trail.resource_id IS 'ID of the specific resource affected';
COMMENT ON COLUMN admin_audit_trail.details IS 'JSON object with additional action details';

-- Create a view for easier audit trail queries with admin details
CREATE OR REPLACE VIEW admin_audit_trail_detailed AS
SELECT 
  aat.id,
  aat.action,
  aat.resource_type,
  aat.resource_id,
  aat.details,
  aat.ip_address,
  aat.user_agent,
  aat.session_id,
  aat.created_at,
  p.full_name as admin_name,
  p.email as admin_email,
  p.username as admin_username
FROM admin_audit_trail aat
LEFT JOIN profiles p ON aat.admin_id = p.id
ORDER BY aat.created_at DESC;

-- Grant permissions
GRANT SELECT ON admin_audit_trail TO authenticated;
GRANT SELECT ON admin_audit_trail_detailed TO authenticated; 