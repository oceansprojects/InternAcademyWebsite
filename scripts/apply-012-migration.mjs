import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Read .env file
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [key, ...vals] = line.split('=');
      return [key.trim(), vals.join('=').trim().replace(/^["']|["']$/g, '')];
    })
);

const url = envVars.NEON_DATABASE_URL || envVars.DATABASE_URL;
if (!url) {
  console.error('NEON_DATABASE_URL or DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(url);

async function run() {
  console.log('--- Applying Migration 012: Company & Job/Internship Workflow ---');

  // 1. Add company role enum value
  console.log('1. Adding "company" role to user_role enum...');
  await sql`
    DO $$ BEGIN
      ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'company';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `;

  // 2. Create Enums
  console.log('2. Creating ENUMs...');
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employee_count') THEN
        CREATE TYPE employee_count AS ENUM ('0-50', '50-100', '100-500', '500-1000', '1000+');
      END IF;
    END $$;
  `;

  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_type') THEN
        CREATE TYPE opportunity_type AS ENUM ('internship', 'full_time', 'part_time', 'contract');
      END IF;
    END $$;
  `;

  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_mode') THEN
        CREATE TYPE work_mode AS ENUM ('on_site', 'remote', 'hybrid');
      END IF;
    END $$;
  `;

  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_status') THEN
        CREATE TYPE opportunity_status AS ENUM ('active', 'expired', 'closed');
      END IF;
    END $$;
  `;

  // 3. Extend companies table
  console.log('3. Extending companies table...');
  await sql`
    ALTER TABLE companies
      ADD COLUMN IF NOT EXISTS contact_email   TEXT,
      ADD COLUMN IF NOT EXISTS contact_number  TEXT,
      ADD COLUMN IF NOT EXISTS description     TEXT,
      ADD COLUMN IF NOT EXISTS address_city    TEXT,
      ADD COLUMN IF NOT EXISTS address_state   TEXT,
      ADD COLUMN IF NOT EXISTS address_nation  TEXT,
      ADD COLUMN IF NOT EXISTS employee_count  employee_count,
      ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW();
  `;

  // 4. Create company_social_links table
  console.log('4. Creating company_social_links table...');
  await sql`
    CREATE TABLE IF NOT EXISTS company_social_links (
      id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id       UUID        NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      social_app_name  TEXT        NOT NULL,
      social_acc_link  TEXT        NOT NULL,
      sort_order       INT         NOT NULL DEFAULT 0,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_company_social_links_company
      ON company_social_links (company_id);
  `;

  // 5. Create company_users table
  console.log('5. Creating company_users table...');
  await sql`
    CREATE TABLE IF NOT EXISTS company_users (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID        NOT NULL UNIQUE REFERENCES users(id)    ON DELETE CASCADE,
      company_id UUID        NOT NULL        REFERENCES companies(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_company_users_company
      ON company_users (company_id);
  `;

  // 6. Extend internship_opportunities
  console.log('6. Extending internship_opportunities table...');
  await sql`
    ALTER TABLE internship_opportunities
      ADD COLUMN IF NOT EXISTS role                 TEXT,
      ADD COLUMN IF NOT EXISTS tech_stack           TEXT[]             NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS years_experience     experience_years,
      ADD COLUMN IF NOT EXISTS selection_process    TEXT,
      ADD COLUMN IF NOT EXISTS status               opportunity_status NOT NULL DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS work_mode            work_mode          NOT NULL DEFAULT 'on_site',
      ADD COLUMN IF NOT EXISTS city                 TEXT,
      ADD COLUMN IF NOT EXISTS state                TEXT,
      ADD COLUMN IF NOT EXISTS openings             INT,
      ADD COLUMN IF NOT EXISTS stipend_salary       TEXT,
      ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMPTZ;
  `;

  console.log('✓ Migration 012 applied successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
