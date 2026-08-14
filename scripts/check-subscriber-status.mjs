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

const sql = neon(envVars.NEON_DATABASE_URL);

async function main() {
  const subs = await sql`
    SELECT id, email, status, last_digest_sent_at 
    FROM blog_subscribers 
    WHERE email = 'tejasjadhav130704@gmail.com'
  `;
  const logs = await sql`
    SELECT id, recipient_email, dispatch_date, sent_at, articles_count, status 
    FROM daily_email_logs 
    WHERE recipient_email = 'tejasjadhav130704@gmail.com'
    ORDER BY sent_at DESC
  `;

  console.log('--- Subscriber State ---');
  console.log(subs[0]);
  console.log('\n--- Daily Email Logs ---');
  console.log(logs[0]);
}

main().catch(console.error);
