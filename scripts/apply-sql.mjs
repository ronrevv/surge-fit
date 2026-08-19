import pg from 'pg';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
let directUrl = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('DIRECT_URL=')) {
    directUrl = line.split('=')[1].replace(/"/g, '').trim();
    break;
  }
}

if (!directUrl) {
  console.error("No DIRECT_URL found in .env.local");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: directUrl,
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL");

  const files = [
    'supabase/migrations/00005_invitations_and_calendar.sql',
  ];

  for (const file of files) {
    console.log(`\nExecuting ${file}...`);
    try {
      const sql = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
      await client.query(sql);
      console.log(`✅ Success: ${file}`);
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log(`⚠️ Skipped (already applied): ${file}`);
      } else {
        console.error(`❌ Failed: ${file}`);
        console.error(error);
      }
    }
  }

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
