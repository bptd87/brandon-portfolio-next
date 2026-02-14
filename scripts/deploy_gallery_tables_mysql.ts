
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Manual .env parsing
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return {};
        const content = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error('Error loading .env:', e);
        return {};
    }
}

const env = loadEnv();

async function migrate() {
    console.log('--- Starting Manual MySQL Migration ---');

    if (!env.DATABASE_URL) {
        console.error('❌ DATABASE_URL missing in .env');
        process.exit(1);
    }

    // Parse DATABASE_URL for mysql2
    // Format: mysql://user:password@host:port/database
    // mysql2/promise createConnection accepts the URL string directly!

    console.log('Connecting to database...');
    let connection;
    try {
        connection = await mysql.createConnection(env.DATABASE_URL);
        console.log('✅ Connected!');
    } catch (e) {
        console.error('❌ Connection failed:', e.message);
        process.exit(1);
    }

    const queries = [
        `
    CREATE TABLE IF NOT EXISTS rendering_gallery (
      id int AUTO_INCREMENT PRIMARY KEY,
      project_id int,
      sort_order int NOT NULL DEFAULT 0,
      alt_text text,
      display_title text,
      active boolean DEFAULT true,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    `,
        `
    CREATE TABLE IF NOT EXISTS model_gallery (
      id int AUTO_INCREMENT PRIMARY KEY,
      project_id int,
      sort_order int NOT NULL DEFAULT 0,
      alt_text text,
      display_title text,
      active boolean DEFAULT true,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    `,
        `
    CREATE TABLE IF NOT EXISTS experiential_gallery (
      id int AUTO_INCREMENT PRIMARY KEY,
      project_id int,
      sort_order int NOT NULL DEFAULT 0,
      alt_text text,
      display_title text,
      active boolean DEFAULT true,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    `
    ];

    try {
        for (const query of queries) {
            // Extract table name for logging
            const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
            console.log(`Creating table: ${tableName}...`);
            await connection.execute(query);
            console.log(`✅ Table ${tableName} created or already exists.`);
        }
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        if (connection) await connection.end();
        console.log('--- Migration Finished ---');
    }
}

migrate();
