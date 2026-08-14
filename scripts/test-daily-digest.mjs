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

async function runTest() {
  console.log('=== Starting 2-Hour Daily Digest Verification ===\n');

  const testEmail = `test.digest.${Date.now()}@example.com`;

  // 1. Insert a test active subscriber
  console.log(`1. Creating test subscriber: ${testEmail}`);
  const insertRes = await sql`
    INSERT INTO blog_subscribers (email, status, last_digest_sent_at)
    VALUES (${testEmail}, 'active', NULL)
    RETURNING id, email, status, last_digest_sent_at
  `;
  const sub = insertRes[0];
  console.log('   Subscriber created:', sub);

  // 2. Query pending subscribers for today
  console.log('\n2. Querying subscribers needing email for today...');
  const pendingBefore = await sql`
    SELECT id, email, last_digest_sent_at
    FROM blog_subscribers
    WHERE status = 'active' 
      AND email = ${testEmail}
      AND (last_digest_sent_at IS NULL OR DATE(last_digest_sent_at) < CURRENT_DATE)
  `;
  console.log(`   Found ${pendingBefore.length} eligible subscriber(s) for ${testEmail}`);
  if (pendingBefore.length !== 1) {
    throw new Error('Expected 1 eligible subscriber, found ' + pendingBefore.length);
  }

  // 3. Simulate sending and marking as sent for today
  console.log('\n3. Simulating daily send & marking last_digest_sent_at...');
  await sql`
    UPDATE blog_subscribers
    SET last_digest_sent_at = NOW(), updated_at = NOW()
    WHERE id = ${sub.id}
  `;

  await sql`
    INSERT INTO daily_email_logs (subscriber_id, recipient_email, dispatch_date, articles_count, status)
    VALUES (${sub.id}, ${testEmail}, CURRENT_DATE, 3, 'sent')
    ON CONFLICT (subscriber_id, dispatch_date) DO NOTHING
  `;

  const subAfterFirstSend = (await sql`
    SELECT id, email, last_digest_sent_at
    FROM blog_subscribers
    WHERE id = ${sub.id}
  `)[0];
  console.log('   Updated subscriber state:', subAfterFirstSend);

  const logEntry = await sql`
    SELECT * FROM daily_email_logs WHERE subscriber_id = ${sub.id}
  `;
  console.log('   Daily log entry created:', logEntry[0]);

  // 4. Simulate 2-hour interval check (Second Run)
  console.log('\n4. Simulating second 2-hour check (Should SKIP)...');
  const pendingSecondRun = await sql`
    SELECT id, email, last_digest_sent_at
    FROM blog_subscribers
    WHERE status = 'active' 
      AND email = ${testEmail}
      AND (last_digest_sent_at IS NULL OR DATE(last_digest_sent_at) < CURRENT_DATE)
  `;
  console.log(`   Eligible subscribers in 2nd run: ${pendingSecondRun.length} (Expected: 0)`);
  if (pendingSecondRun.length !== 0) {
    throw new Error('Expected 0 subscribers in 2nd run, but found ' + pendingSecondRun.length);
  }
  console.log('   -> Verified: Subscriber is safely skipped for the rest of today!');

  // 5. Cleanup test record
  console.log('\n5. Cleaning up test data...');
  await sql`DELETE FROM daily_email_logs WHERE subscriber_id = ${sub.id}`;
  await sql`DELETE FROM blog_subscribers WHERE id = ${sub.id}`;
  console.log('   Test data cleanly removed.');

  console.log('\n=== All Tests Passed Successfully! ===');
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
