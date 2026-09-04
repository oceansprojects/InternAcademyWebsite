import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Parse .env manually
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
const sql = neon(url);

const ADMIN_EMAIL = envVars.ADMIN_EMAIL;
const ADMIN_PASSWORD = envVars.ADMIN_PASSWORD;

async function main() {
  console.log('Checking for admin user:', ADMIN_EMAIL);

  const existing = await sql`
    SELECT id, email, role FROM users WHERE email = ${ADMIN_EMAIL} LIMIT 1;
  `;

  if (existing.length > 0) {
    console.log('✅ Admin user already exists:');
    console.log('  id   :', existing[0].id);
    console.log('  email:', existing[0].email);
    console.log('  role :', existing[0].role);
    return;
  }

  console.log('Admin user NOT found — creating...');

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const result = await sql`
    INSERT INTO users (name, email, password_hash, oauth_provider, role, is_active)
    VALUES (
      'Admin',
      ${ADMIN_EMAIL},
      ${passwordHash},
      'credentials',
      'admin',
      true
    )
    RETURNING id, email, role;
  `;

  console.log('✅ Admin user created:');
  console.log('  id   :', result[0].id);
  console.log('  email:', result[0].email);
  console.log('  role :', result[0].role);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
