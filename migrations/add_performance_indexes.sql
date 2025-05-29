-- Add indexes for better query performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tax_forms_user_assessment 
ON tax_forms(user_id, assessment_year);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tax_forms_status 
ON tax_forms(status) WHERE status IN ('completed', 'filed');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_tax_form 
ON documents(tax_form_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_type 
ON documents(document_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blog_posts_published 
ON blog_posts(published_at) WHERE published = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active 
ON users(email) WHERE role = 'user';

-- Add partial indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tax_forms_recent 
ON tax_forms(created_at DESC) 
WHERE created_at > NOW() - INTERVAL '1 year';