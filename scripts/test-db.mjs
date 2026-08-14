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

async function main() {
  const cols = await sql`
    SELECT column_name, data_type, column_default, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'newsletter_subscribers'
  `;
  console.log('newsletter_subscribers columns:', cols);

  const blogPostsCols = await sql`
    SELECT column_name, data_type, column_default, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'blog_posts'
  `;
  console.log('blog_posts columns:', blogPostsCols);
}

main().catch(console.error);
