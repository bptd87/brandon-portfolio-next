import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                     ANALYTICS MIGRATION SETUP                              ║
╚════════════════════════════════════════════════════════════════════════════╝

To enable the enhanced analytics features (project views, session tracking,
conversion funnels), you need to run the following SQL in your Supabase
database.

STEPS:
------
1. Go to: https://supabase.com/dashboard/project/_/sql
2. Create a new query
3. Copy and paste the SQL below
4. Click "RUN"

SQL TO RUN:
-----------
`);

const migrationPath = path.join(__dirname, '../supabase/migrations/20260215_enhanced_analytics.sql');
const sql = fs.readFileSync(migrationPath, 'utf-8');

console.log(sql);

console.log(`
\nAlternatively, you can save the SQL to a file and import it via Supabase CLI:

  supabase db push

This will run all pending migrations in the supabase/migrations/ directory.
`);

