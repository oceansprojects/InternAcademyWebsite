import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

// Parse .env
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

for (const [k, v] of Object.entries(envVars)) {
  process.env[k] = v;
}

const sql = neon(envVars.NEON_DATABASE_URL);
const RESEND_API_KEY = envVars.RESEND_API_KEY;

async function fetchLatestTechBlogs() {
  const parser = new Parser();
  const feeds = [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  ];

  for (const f of feeds) {
    try {
      console.log(`Fetching latest blogs from ${f.name}...`);
      const feed = await parser.parseURL(f.url);
      if (feed.items && feed.items.length > 0) {
        return feed.items.slice(0, 3).map(item => ({
          title: item.title,
          url: item.link,
          description: (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').slice(0, 160) + '...',
          source: { name: f.name },
          publishedAt: item.pubDate || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.log(`Feed ${f.name} error:`, e.message);
    }
  }

  return [
    {
      title: "Top Software Engineering & AI Internships 2026",
      url: "https://internacademy.co.in/blog",
      description: "Discover curated tech roles, mentorship opportunities, and roadmaps for aspiring developers.",
      source: { name: "InternAcademy" },
    }
  ];
}

async function main() {
  console.log('--- 1. Fetching Active Subscriber ---');
  const subs = await sql`
    SELECT id, email, status FROM blog_subscribers WHERE status = 'active'
  `;
  console.log(`Found ${subs.length} active subscriber(s):`, subs.map(s => s.email));

  if (subs.length === 0) {
    console.log('No active subscribers found.');
    return;
  }

  console.log('\n--- 2. Fetching Latest Live Blog Articles ---');
  const articles = await fetchLatestTechBlogs();
  console.log(`Fetched ${articles.length} article(s):`);
  articles.forEach((a, i) => console.log(`  ${i+1}. [${a.source.name}] ${a.title}`));

  // Generate Email HTML
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const cardsHtml = articles.map(art => `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:18px; margin-bottom:16px;">
      <div style="font-size:11px; font-weight:700; color:#004aad; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
        ${art.source.name}
      </div>
      <h3 style="margin:0 0 8px 0; font-size:17px; color:#0f172a; line-height:1.4;">
        <a href="${art.url}" target="_blank" style="color:#0f172a; text-decoration:none;">${art.title}</a>
      </h3>
      <p style="margin:0 0 12px 0; font-size:14px; color:#475569; line-height:1.5;">${art.description}</p>
      <a href="${art.url}" target="_blank" style="color:#004aad; font-weight:700; font-size:13px; text-decoration:none;">
        Read Full Article &rarr;
      </a>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; background:#f8fafc; margin:0; padding:24px 16px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; overflow:hidden;">
        <div style="background:#0f172a; padding:24px; text-align:center;">
          <h1 style="color:#ffffff; font-size:22px; margin:0; font-family:Montserrat,sans-serif;">InternAcademy</h1>
          <span style="display:inline-block; margin-top:6px; background:rgba(0,210,253,0.15); color:#00d2fd; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">
            Daily Tech Digest
          </span>
        </div>
        <div style="padding:24px;">
          <div style="color:#64748b; font-size:13px; font-weight:600; text-transform:uppercase; margin-bottom:6px;">${dateStr}</div>
          <h2 style="color:#0f172a; font-size:20px; margin:0 0 8px 0;">Today's Top Curated Articles</h2>
          <p style="color:#475569; font-size:14px; margin:0 0 20px 0;">Here is your daily digest of trending tech insights and updates:</p>
          ${cardsHtml}
          <div style="text-align:center; margin-top:24px;">
            <a href="https://internacademy.co.in/blog" target="_blank" style="background:#004aad; color:#ffffff; padding:12px 24px; border-radius:50px; text-decoration:none; font-weight:bold; font-size:14px; display:inline-block;">
              Visit InternAcademy Blogs &rarr;
            </a>
          </div>
        </div>
        <div style="background:#f1f5f9; padding:16px 24px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0;">
          You received this email because you subscribed to InternAcademy updates.
        </div>
      </div>
    </body>
    </html>
  `;

  console.log('\n--- 3. Dispatching via Resend API ---');
  for (const s of subs) {
    console.log(`Sending to: ${s.email}`);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Intern Academy <onboarding@resend.dev>",
        to: s.email,
        subject: `Today's Tech Digest - InternAcademy (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})`,
        html,
      }),
    });

    const resJson = await res.json();
    console.log('Resend API Response:', resJson);

    if (res.ok && resJson.id) {
      console.log(`>>> EMAIL SUCCESSFULLY DELIVERED! Email ID: ${resJson.id} <<<`);
      await sql`
        UPDATE blog_subscribers 
        SET last_digest_sent_at = NOW(), updated_at = NOW() 
        WHERE id = ${s.id}
      `;
      await sql`
        INSERT INTO daily_email_logs (subscriber_id, recipient_email, dispatch_date, articles_count, status)
        VALUES (${s.id}, ${s.email}, CURRENT_DATE, ${articles.length}, 'sent')
        ON CONFLICT (subscriber_id, dispatch_date) DO UPDATE 
        SET sent_at = NOW(), status = 'sent', error_message = NULL
      `;
      console.log(`Database updated with delivery confirmation.`);
    } else {
      console.error(`Email delivery failed:`, resJson);
    }
  }
}

main().catch(console.error);
