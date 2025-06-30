-- Migration: Enhanced Schema with Performance Optimizations
-- Version: 2.1.0

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS tax_filings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS filing_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin', 'tax_expert');
CREATE TYPE filing_status AS ENUM ('draft', 'submitted', 'verified', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create users table with enhanced structure
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT, -- Hashed password
  google_id VARCHAR(255) UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(15),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  profile_picture TEXT,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create performance indexes for users
CREATE UNIQUE INDEX users_email_idx ON users(email);
CREATE INDEX users_google_id_idx ON users(google_id);
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_active_idx ON users(is_active);
CREATE INDEX users_created_at_idx ON users(created_at);
CREATE INDEX users_email_active_idx ON users(email, is_active);
CREATE INDEX users_role_active_idx ON users(role, is_active);

-- Create tax_filings table with JSONB structure
CREATE TABLE tax_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_year VARCHAR(10) NOT NULL,
  itr_form VARCHAR(10) NOT NULL,
  status filing_status NOT NULL DEFAULT 'draft',
  
  -- Flexible JSONB columns for different data types
  personal_info JSONB DEFAULT '{}',
  income_info JSONB DEFAULT '{}',
  deductions JSONB DEFAULT '{}',
  tax_computation JSONB DEFAULT '{}',
  
  -- Filing metadata
  acknowledgment_number VARCHAR(50),
  filed_date TIMESTAMP,
  verification_date TIMESTAMP,
  
  -- Document and error tracking
  document_ids JSONB DEFAULT '[]',
  processing_notes TEXT,
  error_log JSONB DEFAULT '[]',
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create performance indexes for tax_filings
CREATE INDEX tax_filings_user_id_idx ON tax_filings(user_id);
CREATE INDEX tax_filings_status_idx ON tax_filings(status);
CREATE INDEX tax_filings_assessment_year_idx ON tax_filings(assessment_year);
CREATE INDEX tax_filings_created_at_idx ON tax_filings(created_at);
CREATE INDEX tax_filings_user_status_idx ON tax_filings(user_id, status);
CREATE INDEX tax_filings_user_year_idx ON tax_filings(user_id, assessment_year);
CREATE INDEX tax_filings_status_year_idx ON tax_filings(status, assessment_year);
CREATE UNIQUE INDEX tax_filings_user_year_unique ON tax_filings(user_id, assessment_year);

-- Create documents table for file management
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filing_id UUID REFERENCES tax_filings(id) ON DELETE SET NULL,
  
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  
  category VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create performance indexes for documents
CREATE INDEX documents_user_id_idx ON documents(user_id);
CREATE INDEX documents_filing_id_idx ON documents(filing_id);
CREATE INDEX documents_category_idx ON documents(category);
CREATE INDEX documents_created_at_idx ON documents(created_at);
CREATE INDEX documents_active_idx ON documents(is_active);
CREATE INDEX documents_user_category_idx ON documents(user_id, category);
CREATE INDEX documents_user_active_idx ON documents(user_id, is_active);

-- Create payments table for transaction tracking
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filing_id UUID REFERENCES tax_filings(id) ON DELETE SET NULL,
  
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'pending',
  
  -- Payment provider information
  payment_provider VARCHAR(50) NOT NULL,
  provider_payment_id VARCHAR(255),
  provider_order_id VARCHAR(255),
  
  -- Payment metadata
  metadata JSONB DEFAULT '{}',
  
  paid_at TIMESTAMP,
  failed_at TIMESTAMP,
  refunded_at TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create performance indexes for payments
CREATE INDEX payments_user_id_idx ON payments(user_id);
CREATE INDEX payments_status_idx ON payments(status);
CREATE INDEX payments_provider_payment_id_idx ON payments(provider_payment_id);
CREATE INDEX payments_created_at_idx ON payments(created_at);
CREATE INDEX payments_user_status_idx ON payments(user_id, status);

-- Create blog_posts table for content management
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords JSONB DEFAULT '[]',
  
  -- Content metadata
  featured_image TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  
  -- Performance tracking
  view_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create performance indexes for blog_posts
CREATE UNIQUE INDEX blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX blog_posts_author_id_idx ON blog_posts(author_id);
CREATE INDEX blog_posts_published_idx ON blog_posts(is_published);
CREATE INDEX blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX blog_posts_published_at_published_idx ON blog_posts(published_at, is_published);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tax_filings_updated_at BEFORE UPDATE ON tax_filings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default admin user (password should be hashed in application)
INSERT INTO users (email, role, first_name, last_name, is_email_verified, is_active) 
VALUES ('admin@smarttaxpro.com', 'admin', 'System', 'Administrator', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING; 