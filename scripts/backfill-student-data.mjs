import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim().replace(/^["']|["']$/g, '')];
    })
);

const sql = neon(envVars.NEON_DATABASE_URL);

async function run() {
  const userCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users'
  `;
  console.log('users columns:', userCols.map((c) => c.column_name));

  const hasName = userCols.some((c) => c.column_name === 'name');
  const hasEmail = userCols.some((c) => c.column_name === 'email');
  const hasAvatar = userCols.some((c) => ['image', 'avatar_url', 'profile_photo_url'].includes(c.column_name));

  console.log('Available columns in users:', { hasName, hasEmail, hasAvatar });

  if (hasName && hasEmail) {
    const updated = await sql`
      UPDATE student_profiles sp
      SET
        full_name = COALESCE(sp.full_name, u.name),
        email = COALESCE(sp.email, u.email),
        profile_photo_url = COALESCE(sp.profile_photo_url, u.avatar_url),
        updated_at = NOW()
      FROM users u
      WHERE sp.user_id = u.id
      RETURNING sp.id, sp.full_name, sp.email, sp.profile_photo_url
    `;
    console.log(`Backfilled ${updated.length} student profiles with user name, email, avatar:`, updated);
  }

  // Now verify final records
  const allProfiles = await sql`
    SELECT id, user_id, full_name, email, mobile_number, college_name, degree, branch, current_year
    FROM student_profiles
  `;
  console.log('\nAll student profiles after backfill:');
  console.log(JSON.stringify(allProfiles, null, 2));
}

run().catch(console.error);
