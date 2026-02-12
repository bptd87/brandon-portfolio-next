import { describe, it, expect } from 'vitest';
import { testConnection, listRecords, AIRTABLE_TABLES } from './airtableClient';

describe('Airtable Integration', () => {
  it('should connect to Airtable with valid credentials', async () => {
    const isConnected = await testConnection();
    expect(isConnected).toBe(true);
  }, 10000);

  it('should list categories from Airtable', async () => {
    const categories = await listRecords(AIRTABLE_TABLES.categories, { maxRecords: 5 });
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  }, 10000);

  it('should list tags from Airtable', async () => {
    const tags = await listRecords(AIRTABLE_TABLES.tags, { maxRecords: 5 });
    expect(tags).toBeDefined();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  }, 10000);

  it('should list projects from Airtable', async () => {
    const projects = await listRecords(AIRTABLE_TABLES.projects, { maxRecords: 5 });
    expect(projects).toBeDefined();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    
    // Check project structure
    const firstProject = projects[0];
    expect(firstProject.id).toBeDefined();
    expect(firstProject.fields).toBeDefined();
    expect(firstProject.fields.Title).toBeDefined();
  }, 10000);
});
