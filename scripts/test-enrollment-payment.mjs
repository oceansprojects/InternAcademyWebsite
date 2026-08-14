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

async function testPaymentUpdate() {
  console.log('--- Testing Enrollment Payment Update ---');
  
  // 1. Get an existing enrollment
  const existing = await sql`
    SELECT id, status, payment_status, amount_paid FROM enrollments LIMIT 1
  `;

  if (existing.length === 0) {
    console.log('No enrollments found in database to test.');
    return;
  }

  const enrollment = existing[0];
  console.log('Original enrollment record:', enrollment);

  // 2. Update payment status to paid & amount_paid
  console.log('\nUpdating payment_status to "paid" and amount_paid to 12500...');
  await sql`
    UPDATE enrollments
    SET payment_status = 'paid', amount_paid = 12500
    WHERE id = ${enrollment.id}
  `;

  const updated = (await sql`
    SELECT id, status, payment_status, amount_paid FROM enrollments WHERE id = ${enrollment.id}
  `)[0];
  console.log('Updated enrollment record:', updated);

  if (updated.payment_status === 'paid' && Number(updated.amount_paid) === 12500) {
    console.log('>>> Payment status and amount successfully updated! <<<');
  } else {
    throw new Error('Payment update verification failed');
  }
}

testPaymentUpdate().catch(console.error);
