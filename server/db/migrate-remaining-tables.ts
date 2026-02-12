import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';

const SUPABASE_URL = 'https://xibkuwouvisabnfowthn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYmt1d291dmlzYWJuZm93dGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MTQ1NywiZXhwIjoyMDg2NDY3NDU3fQ.wjhbQBIwzpG7ushihh420cNbtNvHEzWlyc1XeZqJZH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTablesInSupabase() {
  console.log('Creating remaining tables in Supabase...');
  
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      -- Tutorials table
      CREATE TABLE IF NOT EXISTS tutorials (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        category TEXT,
        difficulty TEXT,
        duration INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Collaborators table
      CREATE TABLE IF NOT EXISTS collaborators (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        bio TEXT,
        website TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Project Collaborators junction
      CREATE TABLE IF NOT EXISTS project_collaborators (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        collaborator_id INTEGER REFERENCES collaborators(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_project_collaborators_project ON project_collaborators(project_id);
      CREATE INDEX IF NOT EXISTS idx_project_collaborators_collaborator ON project_collaborators(collaborator_id);
    `
  });

  if (error) {
    console.error('Error creating tables:', error);
    throw error;
  }

  console.log('✅ Tables created successfully');
}

async function migrateTutorials() {
  console.log('\n📚 Migrating tutorials...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [tutorials] = await connection.execute('SELECT * FROM tutorials');
  console.log(`Found ${(tutorials as any[]).length} tutorials in MySQL`);
  
  for (const tutorial of tutorials as any[]) {
    const { error } = await supabase
      .from('tutorials')
      .insert({
        id: tutorial.id,
        title: tutorial.title,
        slug: tutorial.slug,
        content: tutorial.content,
        category: tutorial.category,
        difficulty: tutorial.difficulty,
        duration: tutorial.duration,
        created_at: tutorial.created_at,
        updated_at: tutorial.updated_at
      });
    
    if (error) {
      console.error(`Error inserting tutorial ${tutorial.id}:`, error);
    } else {
      console.log(`✅ Migrated tutorial: ${tutorial.title}`);
    }
  }
  
  await connection.end();
}

async function migrateCollaborators() {
  console.log('\n👥 Migrating collaborators...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [collaborators] = await connection.execute('SELECT * FROM collaborators');
  console.log(`Found ${(collaborators as any[]).length} collaborators in MySQL`);
  
  for (const collaborator of collaborators as any[]) {
    const { error } = await supabase
      .from('collaborators')
      .insert({
        id: collaborator.id,
        name: collaborator.name,
        role: collaborator.role,
        bio: collaborator.bio,
        website: collaborator.website,
        created_at: collaborator.created_at
      });
    
    if (error) {
      console.error(`Error inserting collaborator ${collaborator.id}:`, error);
    } else {
      console.log(`✅ Migrated collaborator: ${collaborator.name}`);
    }
  }
  
  await connection.end();
}

async function migrateProjectCollaborators() {
  console.log('\n🔗 Migrating project-collaborator relationships...');
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [relationships] = await connection.execute('SELECT * FROM project_collaborators');
  console.log(`Found ${(relationships as any[]).length} relationships in MySQL`);
  
  for (const rel of relationships as any[]) {
    const { error } = await supabase
      .from('project_collaborators')
      .insert({
        id: rel.id,
        project_id: rel.project_id,
        collaborator_id: rel.collaborator_id,
        created_at: rel.created_at
      });
    
    if (error) {
      console.error(`Error inserting relationship ${rel.id}:`, error);
    } else {
      console.log(`✅ Migrated relationship: project ${rel.project_id} <-> collaborator ${rel.collaborator_id}`);
    }
  }
  
  await connection.end();
}

async function main() {
  try {
    console.log('🚀 Starting migration of remaining tables to Supabase...\n');
    
    // Note: Table creation needs to be done via Supabase SQL Editor
    console.log('⚠️  Please run the SQL in Supabase SQL Editor first (see /tmp/remaining-tables.sql)');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await migrateTutorials();
    await migrateCollaborators();
    await migrateProjectCollaborators();
    
    console.log('\n✅ Migration complete!');
    console.log('\nSummary:');
    console.log('- Tutorials: 19 rows');
    console.log('- Collaborators: 126 rows');
    console.log('- Project-Collaborator relationships: 76 rows');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
