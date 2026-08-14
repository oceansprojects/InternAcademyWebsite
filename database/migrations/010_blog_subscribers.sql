-- Migration: 010_blog_subscribers.sql
-- Description: Create blog_subscribers table, blog_email_logs table, and add notification_sent_at to blog_posts

BEGIN;

CREATE TABLE IF NOT EXISTS blog_subscribers (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL UNIQUE,
  status     VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_subscribers_email ON blog_subscribers (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_blog_subscribers_status ON blog_subscribers (status);

-- Migrate existing records from newsletter_subscribers if present
INSERT INTO blog_subscribers (email, status, created_at, updated_at)
SELECT 
  LOWER(TRIM(email)) AS email, 
  CASE WHEN is_confirmed = true THEN 'active' ELSE 'active' END AS status, 
  subscribed_at AS created_at, 
  subscribed_at AS updated_at
FROM newsletter_subscribers
ON CONFLICT (email) DO NOTHING;

-- Add notification tracking to blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ DEFAULT NULL;

-- Delivery audit log table
CREATE TABLE IF NOT EXISTS blog_email_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID        REFERENCES blog_posts(id) ON DELETE CASCADE,
  recipient_email TEXT        NOT NULL,
  status          VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message   TEXT,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_email_logs_post ON blog_email_logs (post_id);

COMMIT;
