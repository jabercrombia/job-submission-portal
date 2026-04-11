// scripts/test-db.mjs
// Tests connectivity to each Supabase table.
// Usage: node scripts/test-db.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
} catch {
  console.error('❌ Could not read .env.local — make sure it exists with your Supabase credentials.\n');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = [
  { name: 'categories',   select: 'category_name' },
  { name: 'job_entries',  select: 'id, title, category, expiration' },
  { name: 'resume_users', select: 'id, firstName, lastName, email' },
];

let passed = 0;
let failed = 0;

console.log('\n🔌 Testing Supabase table connections...\n');

for (const table of tables) {
  const { data, error } = await supabase
    .from(table.name)
    .select(table.select)
    .limit(1);

  if (error) {
    console.error(`❌ ${table.name}: ${error.message}`);
    failed++;
  } else {
    const rowInfo = data.length ? `(${data.length} row returned)` : '(table is empty)';
    console.log(`✅ ${table.name}: connected ${rowInfo}`);
    passed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
