import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

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

const RESEND_API_KEY = envVars.RESEND_API_KEY;

async function fetchLatestTechBlogs() {
  const parser = new Parser();
  const feed = await parser.parseURL('https://techcrunch.com/feed/');
  return feed.items.slice(0, 3).map(item => ({
    title: item.title,
    url: item.link,
    description: (item.contentSnippet || item.content || '').replace(/<[^>]*>?/gm, '').slice(0, 160) + '...',
    source: { name: 'TechCrunch' },
  }));
}

async function sendToOwner() {
  const targetEmail = "internacademyofficial@gmail.com";
  console.log(`Sending live test email to Resend owner email: ${targetEmail}...`);

  const articles = await fetchLatestTechBlogs();
  console.log(`Fetched ${articles.length} latest articles:`, articles.map(a => a.title));

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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Intern Academy <onboarding@resend.dev>",
      to: targetEmail,
      subject: `Today's Tech Digest - InternAcademy (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})`,
      html,
    }),
  });

  const resJson = await res.json();
  console.log('Resend API Result:', resJson);
}

sendToOwner().catch(console.error);
