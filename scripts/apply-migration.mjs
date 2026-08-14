import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...vals] = line.split('=');
      return [key.trim(), vals.join('=').trim().replace(/^["']|["']$/g, '')];
    })
);

const url = envVars.NEON_DATABASE_URL;
if (!url) {
  console.error('NEON_DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(url);

async function runMigration() {
  console.log('Applying migration 010_blog_subscribers.sql...');

  await sql`
    CREATE TABLE IF NOT EXISTS blog_subscribers (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      email      TEXT        NOT NULL UNIQUE,
      status     VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_subscribers_email ON blog_subscribers (LOWER(email))
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_blog_subscribers_status ON blog_subscribers (status)
  `;

  await sql`
    INSERT INTO blog_subscribers (email, status, created_at, updated_at)
    SELECT 
      LOWER(TRIM(email)) AS email, 
      'active' AS status, 
      subscribed_at AS created_at, 
      subscribed_at AS updated_at
    FROM newsletter_subscribers
    ON CONFLICT (email) DO NOTHING
  `;

  await sql`
    ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ DEFAULT NULL
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_email_logs (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id         UUID        REFERENCES blog_posts(id) ON DELETE CASCADE,
      recipient_email TEXT        NOT NULL,
      status          VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
      error_message   TEXT,
      sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_blog_email_logs_post ON blog_email_logs (post_id)
  `;

  // --- Daily Digest Support ---
  await sql`
    ALTER TABLE blog_subscribers
    ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMPTZ DEFAULT NULL
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_blog_subscribers_last_digest_sent 
    ON blog_subscribers (last_digest_sent_at)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS daily_email_logs (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      subscriber_id   UUID        REFERENCES blog_subscribers(id) ON DELETE CASCADE,
      recipient_email TEXT        NOT NULL,
      dispatch_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
      sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      articles_count  INT         DEFAULT 0,
      status          VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
      error_message   TEXT,
      UNIQUE(subscriber_id, dispatch_date)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_daily_email_logs_date 
    ON daily_email_logs (dispatch_date)
  `;

  console.log('Migration successfully applied!');
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
