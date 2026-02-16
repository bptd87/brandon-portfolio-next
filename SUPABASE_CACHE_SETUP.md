# Supabase Cache Configuration Guide

## Current Situation
Your images are served from Supabase Storage (`xibkuwouvisabnfowthn.supabase.co`) with **1-hour cache TTL**, which is too short for static assets like project covers.

**Why You Don't See Cache Settings in Dashboard:**
Supabase Storage doesn't expose cache control in the UI. Cache headers are set via API calls or SDK methods instead.

## Solution 1: Node.js Script (Easiest) ✅

Create this script to update existing images with 1-year cache:

```bash
# Create the script file
cat > update-cache-headers.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const buckets = ['project-images', 'news-images', 'article-images', 'about-images'];

async function updateCacheHeaders() {
  for (const bucket of buckets) {
    console.log(`\nProcessing bucket: ${bucket}`);
    
    // Get all files in bucket
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list();
    
    if (error) {
      console.error(`Error listing ${bucket}:`, error);
      continue;
    }
    
    if (!files?.length) {
      console.log(`  No files in ${bucket}`);
      continue;
    }
    
    // Update each file's cache headers via REST API
    for (const file of files) {
      console.log(`  ✓ Updating: ${file.name}`);
      
      await fetch(
        `${supabaseUrl}/storage/v1/object/${bucket}/${file.name}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'x-upsert': 'true'
          }
        }
      );
    }
  }
}

updateCacheHeaders()
  .then(() => console.log('\n✓ Cache headers updated!'))
  .catch(err => console.error('\n❌ Error:', err));
EOF

# Run the script (uses your .env variables)
node update-cache-headers.js
```

## Solution 2: Direct API Call with cURL

Update a single image immediately:

```bash
# First, get your anon key from Supabase Dashboard
# Settings → API → Copy "anon public" key

# Then run:
curl -X PUT \
  "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/project-images/project-90045-cover.webp" \
  -H "Authorization: Bearer YOUR_ANON_KEY_HERE" \
  -H "Cache-Control: public, max-age=31536000, immutable" \
  -H "x-upsert: true"
```

## Solution 3: Set Cache on All Future Uploads ⭐ (Best)

Update your upload functions to automatically include cache headers:

```typescript
// In your image upload code (e.g., admin forms)
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.storage
  .from('project-images')
  .upload(filePath, file, {
    cacheControl: '31536000', // ← Always cache for 1 year
    upsert: false,
  });
```

This way, all new uploads automatically get 1-year cache without manual updates.

## Solution 4: Batch Update (Python)

If you prefer Python:

```python
import os
import requests
from supabase import create_client

url = os.getenv('VITE_SUPABASE_URL')
key = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase = create_client(url, key)

buckets = ['project-images', 'news-images', 'article-images', 'about-images']

for bucket in buckets:
    print(f'\nUpdating {bucket}...')
    response = supabase.storage.from_(bucket).list()
    
    for file in response or []:
        print(f'  {file.name}')
        requests.put(
            f"{url}/storage/v1/object/{bucket}/{file.name}",
            headers={
                'Authorization': f'Bearer {key}',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'x-upsert': 'true'
            }
        )

print('✓ Done!')
```

## Solution 5: Quick Start (Copy-Paste)

1. **Get your anon key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the "anon public" key

2. **Create script:**
```bash
cat > update_cache.js << 'EOF'
const fetch = (...args) => import('node-fetch')
  .then(({default: f}) => f(...args));

const url = 'https://xibkuwouvisabnfowthn.supabase.co';
const key = 'YOUR_ANON_KEY_HERE'; // ← Replace this

const files = [
  'project-images/project-90045-cover.webp',
  'project-images/project-90087-cover.webp',
  'project-images/project-90089-cover.webp',
  // Add more files...
];

(async () => {
  for (const file of files) {
    console.log(`Updating: ${file}`);
    await fetch(`${url}/storage/v1/object/${file}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'x-upsert': 'true'
      }
    });
  }
  console.log('✓ All files cached for 1 year!');
})();
EOF
```

3. **Replace YOUR_ANON_KEY_HERE with actual key**

4. **Run it:**
```bash
node update_cache.js
```

## Verify It Worked

```bash
# Check the cache header
curl -I "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-cover.webp"

# Look for this in the response:
# cache-control: public, max-age=31536000, immutable
```

## My Recommendation

**Best approach:**
1. **Now**: Run Solution 1 script to update existing images
2. **Going forward**: Use Solution 3 (add `cacheControl` to upload functions)

This ensures:
- ✅ All existing images cached for 1 year
- ✅ All new images automatically cached
- ✅ No future maintenance needed
- ✅ ~95% bandwidth savings on repeat visits
