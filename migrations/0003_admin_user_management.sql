-- Admin and User Management System
-- Additional tables for comprehensive admin and user panels

-- User Profile Extensions
ALTER TABLE users ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until timestamp with time zone;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS address jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender varchar(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation varchar(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company varchar(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS pan_number varchar(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhar_number varchar(12);

-- Admin Roles and Permissions
CREATE TABLE IF NOT EXISTS admin_roles (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  description text,
  permissions jsonb NOT NULL DEFAULT '[]',
  is_system_role boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_admin_roles (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  role_id integer REFERENCES admin_roles(id) ON DELETE CASCADE,
  granted_by integer REFERENCES users(id) ON DELETE SET NULL,
  granted_at timestamp with time zone DEFAULT NOW(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- User Subscriptions and Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  currency varchar(3) DEFAULT 'INR',
  billing_cycle varchar(20) NOT NULL, -- monthly, yearly, one_time
  features jsonb NOT NULL DEFAULT '[]',
  max_users integer DEFAULT 1,
  max_storage_gb integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  plan_id integer REFERENCES subscription_plans(id) ON DELETE SET NULL,
  status varchar(20) DEFAULT 'active', -- active, cancelled, expired, suspended
  start_date timestamp with time zone DEFAULT NOW(),
  end_date timestamp with time zone,
  auto_renew boolean DEFAULT true,
  payment_method varchar(50),
  last_payment_at timestamp with time zone,
  next_billing_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- User Support and Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id serial PRIMARY KEY,
  ticket_number varchar(20) UNIQUE NOT NULL,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  assigned_to integer REFERENCES users(id) ON DELETE SET NULL,
  category varchar(50) NOT NULL,
  priority varchar(20) DEFAULT 'medium', -- low, medium, high, urgent
  status varchar(20) DEFAULT 'open', -- open, in_progress, resolved, closed
  subject varchar(255) NOT NULL,
  description text NOT NULL,
  resolution text,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW(),
  resolved_at timestamp with time zone,
  closed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id serial PRIMARY KEY,
  ticket_id integer REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id integer REFERENCES users(id) ON DELETE SET NULL,
  message text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW()
);

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  type varchar(50) NOT NULL, -- email, sms, push, in_app
  title varchar(255) NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  sent_at timestamp with time zone DEFAULT NOW(),
  delivered_at timestamp with time zone,
  failed_at timestamp with time zone,
  error_message text
);

-- Admin Dashboard Analytics
CREATE TABLE IF NOT EXISTS admin_analytics (
  id serial PRIMARY KEY,
  metric_name varchar(100) NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit varchar(20),
  category varchar(50),
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  UNIQUE(metric_name, date)
);

-- User Feedback and Reviews
CREATE TABLE IF NOT EXISTS user_feedback (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  category varchar(50),
  title varchar(255),
  feedback text,
  is_public boolean DEFAULT false,
  is_helpful boolean,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id serial PRIMARY KEY,
  setting_key varchar(100) UNIQUE NOT NULL,
  setting_value text,
  setting_type varchar(20) DEFAULT 'string', -- string, number, boolean, json
  description text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_users_pan ON users(pan_number);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_end_date ON user_subscriptions(end_date);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_sent_at ON user_notifications(sent_at);

CREATE INDEX IF NOT EXISTS idx_admin_analytics_date ON admin_analytics(date);
CREATE INDEX IF NOT EXISTS idx_admin_analytics_metric_name ON admin_analytics(metric_name);

CREATE INDEX IF NOT EXISTS idx_user_feedback_rating ON user_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_user_feedback_category ON user_feedback(category);

-- Insert default admin role
INSERT INTO admin_roles (name, description, permissions, is_system_role) VALUES 
('Super Admin', 'Full system access', '["*"]', true),
('Admin', 'General administration access', '["users.read", "users.write", "tax_forms.read", "tax_forms.write", "analytics.read"]', true),
('Support Agent', 'Customer support access', '["users.read", "support_tickets.read", "support_tickets.write"]', true),
('Content Manager', 'Content and blog management', '["blog_posts.read", "blog_posts.write", "files.read", "files.write"]', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, billing_cycle, features, max_users, max_storage_gb) VALUES 
('Free', 'Basic tax filing for individuals', 0.00, 'one_time', '["basic_filing", "email_support"]', 1, 1),
('Pro', 'Advanced features for professionals', 999.00, 'yearly', '["advanced_filing", "priority_support", "document_storage", "tax_calculator"]', 1, 10),
('Business', 'Multi-user business filing', 2999.00, 'yearly', '["multi_user", "business_filing", "dedicated_support", "api_access", "advanced_analytics"]', 10, 100)
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES 
('site_name', 'SmartTaxPro', 'string', 'Website name', true),
('site_description', 'Professional Tax Filing Platform', 'string', 'Website description', true),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode status', true),
('registration_enabled', 'true', 'boolean', 'Allow new user registrations', true),
('max_file_size_mb', '10', 'number', 'Maximum file upload size in MB', true),
('session_timeout_minutes', '30', 'number', 'User session timeout in minutes', false),
('email_verification_required', 'true', 'boolean', 'Require email verification for new users', false),
('phone_verification_required', 'false', 'boolean', 'Require phone verification for new users', false)
ON CONFLICT (setting_key) DO NOTHING; 