-- Enhanced Roles and Blog Schema Migration
-- Adds new role types (author, admin, super_admin) and blog post enhancements

-- Update user role enum to include new roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'author';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Add SEO meta fields to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title varchar(60);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description varchar(160);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_keywords text;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS social_image_url text;

-- Add version tracking to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS version integer DEFAULT 1 NOT NULL;

-- Create blog_post_revisions table for version history
CREATE TABLE IF NOT EXISTS blog_post_revisions (
  id serial PRIMARY KEY,
  post_id integer NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  version integer NOT NULL,
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  summary text,
  content text NOT NULL,
  author_id integer REFERENCES users(id) ON DELETE SET NULL,
  featured_image_url text,
  category varchar(100) NOT NULL,
  tags jsonb,
  read_time integer,
  seo_title varchar(60),
  seo_description varchar(160),
  seo_keywords text,
  social_image_url text,
  change_note text,
  created_at timestamp with time zone DEFAULT NOW() NOT NULL
);

-- Create indexes for blog_post_revisions
CREATE INDEX IF NOT EXISTS blog_post_revisions_post_id_version_idx ON blog_post_revisions(post_id, version);
CREATE INDEX IF NOT EXISTS blog_post_revisions_created_at_idx ON blog_post_revisions(created_at);

-- Create function to automatically create revision on blog post update
CREATE OR REPLACE FUNCTION create_blog_post_revision()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create revision if content actually changed
  IF (OLD.title IS DISTINCT FROM NEW.title) OR
     (OLD.slug IS DISTINCT FROM NEW.slug) OR
     (OLD.summary IS DISTINCT FROM NEW.summary) OR
     (OLD.content IS DISTINCT FROM NEW.content) OR
     (OLD.category IS DISTINCT FROM NEW.category) OR
     (OLD.tags::text IS DISTINCT FROM NEW.tags::text) OR
     (OLD.seo_title IS DISTINCT FROM NEW.seo_title) OR
     (OLD.seo_description IS DISTINCT FROM NEW.seo_description) OR
     (OLD.seo_keywords IS DISTINCT FROM NEW.seo_keywords) THEN
    
    -- Increment version number
    NEW.version = OLD.version + 1;
    
    -- Insert revision record
    INSERT INTO blog_post_revisions (
      post_id, version, title, slug, summary, content, author_id,
      featured_image_url, category, tags, read_time,
      seo_title, seo_description, seo_keywords, social_image_url,
      change_note, created_at
    ) VALUES (
      OLD.id, OLD.version, OLD.title, OLD.slug, OLD.summary, OLD.content, OLD.author_id,
      OLD.featured_image_url, OLD.category, OLD.tags, OLD.read_time,
      OLD.seo_title, OLD.seo_description, OLD.seo_keywords, OLD.social_image_url,
      'Auto-saved revision before update', OLD.updated_at
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic revision creation
DROP TRIGGER IF EXISTS blog_post_revision_trigger ON blog_posts;
CREATE TRIGGER blog_post_revision_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION create_blog_post_revision();

-- Update any existing admin users to super_admin role
UPDATE users SET role = 'super_admin' WHERE role = 'admin';

-- Add comments for documentation
COMMENT ON TABLE blog_post_revisions IS 'Stores version history for blog posts to track changes over time';
COMMENT ON COLUMN blog_posts.seo_title IS 'SEO optimized title (max 60 characters)';
COMMENT ON COLUMN blog_posts.seo_description IS 'SEO meta description (max 160 characters)';
COMMENT ON COLUMN blog_posts.version IS 'Current version number, incremented on each update'; 