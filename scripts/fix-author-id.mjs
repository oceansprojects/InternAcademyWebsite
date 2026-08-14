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
const sql = neon(url);

async function fixAuthorId() {
  console.log('Altering blog_posts.author_id to allow NULL...');
  await sql`
    ALTER TABLE blog_posts ALTER COLUMN author_id DROP NOT NULL;
  `;
  console.log('blog_posts.author_id successfully updated to allow NULL.');
}

fixAuthorId().catch(console.error);
