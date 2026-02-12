import https from 'https';

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;

export const AIRTABLE_TABLES = {
  categories: 'tblraijFpBeZ1OmLS',
  tags: 'tbluWvFRlMSIX7pTZ',
  projects: 'tblRwDjfCy9vN2KUo',
  projectImages: 'tbl3AkEtBOYIk1OxJ',
  news: 'tblzRfniYgcQkxYxy',
  articles: 'tbltt0XLQxXD7tAuP'
};

export interface AirtableRecord<T = any> {
  id: string;
  fields: T;
  createdTime: string;
}

interface AirtableListResponse<T = any> {
  records: AirtableRecord<T>[];
  offset?: string;
}

function airtableRequest<T = any>(
  method: string,
  path: string,
  data?: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${body}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * List all records from a table with optional filtering
 */
export async function listRecords<T = any>(
  tableId: string,
  options?: {
    filterByFormula?: string;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    maxRecords?: number;
    view?: string;
  }
): Promise<AirtableRecord<T>[]> {
  const params = new URLSearchParams();
  
  if (options?.filterByFormula) {
    params.append('filterByFormula', options.filterByFormula);
  }
  
  if (options?.sort) {
    options.sort.forEach((s, i) => {
      params.append(`sort[${i}][field]`, s.field);
      params.append(`sort[${i}][direction]`, s.direction);
    });
  }
  
  if (options?.maxRecords) {
    params.append('maxRecords', options.maxRecords.toString());
  }
  
  if (options?.view) {
    params.append('view', options.view);
  }
  
  const queryString = params.toString();
  const path = `/v0/${AIRTABLE_BASE_ID}/${tableId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await airtableRequest<AirtableListResponse<T>>('GET', path);
  return response.records;
}

/**
 * Get a single record by ID
 */
export async function getRecord<T = any>(
  tableId: string,
  recordId: string
): Promise<AirtableRecord<T>> {
  const path = `/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;
  return airtableRequest<AirtableRecord<T>>('GET', path);
}

/**
 * Create a new record
 */
export async function createRecord<T = any>(
  tableId: string,
  fields: T
): Promise<AirtableRecord<T>> {
  const path = `/v0/${AIRTABLE_BASE_ID}/${tableId}`;
  const response = await airtableRequest<AirtableRecord<T>>('POST', path, { fields });
  return response;
}

/**
 * Update a record
 */
export async function updateRecord<T = any>(
  tableId: string,
  recordId: string,
  fields: Partial<T>
): Promise<AirtableRecord<T>> {
  const path = `/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;
  const response = await airtableRequest<AirtableRecord<T>>('PATCH', path, { fields });
  return response;
}

/**
 * Delete a record
 */
export async function deleteRecord(
  tableId: string,
  recordId: string
): Promise<{ deleted: boolean; id: string }> {
  const path = `/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;
  return airtableRequest('DELETE', path);
}

/**
 * Test connection to Airtable
 */
export async function testConnection(): Promise<boolean> {
  try {
    await listRecords(AIRTABLE_TABLES.categories, { maxRecords: 1 });
    return true;
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    return false;
  }
}
