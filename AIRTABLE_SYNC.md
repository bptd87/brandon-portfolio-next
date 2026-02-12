# Airtable Sync Workflow

This project uses **Airtable** as an external content management system. You can edit your portfolio content in Airtable's spreadsheet interface, then sync it to your website when ready.

---

## 🎯 How It Works

1. **Edit in Airtable** - Manage projects, news, articles, categories, and tags in Airtable's beautiful interface
2. **Sync to Website** - Run the sync script to copy Airtable data → MySQL database
3. **Deploy** - Your website reads from MySQL and shows the updated content

---

## 📊 Your Airtable Base

**Base Name**: Brandon Portfolio  
**Base ID**: `appYlwqLxSBOEwVVv`

**Tables**:
- **Categories** (20 records) - Content categories
- **Tags** (133 records) - Content tags
- **Projects** (37 records) - Portfolio projects
- **Project Images** (245 records) - Gallery images for projects
- **News** (45 records) - News items and updates
- **Articles** (23 records) - Blog articles

**Access Airtable**: https://airtable.com/appYlwqLxSBOEwVVv

---

## 🔄 Syncing Content

### From Manus (Recommended)

1. Edit your content in Airtable
2. In Manus chat, say: "Sync Airtable"
3. I'll run the sync and confirm when complete
4. Check your website to see updates

### From Command Line

```bash
# Run sync script
pnpm sync:airtable

# Output:
# 🚀 Starting Airtable → MySQL sync...
# ✅ Connected to MySQL database
# 📁 Syncing Categories...
# ✅ Synced 20 categories
# 🏷️  Syncing Tags...
# ✅ Synced 133 tags
# 🎨 Syncing Projects...
# ✅ Synced 37 projects
# 🖼️  Syncing Project Images...
# ✅ Synced 245 project images
# 📰 Syncing News...
# ✅ Synced 45 news items
# 📝 Syncing Articles...
# ✅ Synced 23 articles
# ✅ Sync complete!
```

---

## 📝 Editing Content in Airtable

### Projects

**Required Fields**:
- Title
- Slug (URL-friendly, e.g., "million-dollar-quartet")
- Discipline (scenic_design, experiential_design, rendering, scenic_models)
- Status (draft, published, archived)

**Optional Fields**:
- Excerpt (short description for listing pages)
- Design Notes (detailed project notes)
- Cover Image (attachment field - upload directly)
- Client, Location, Year, Month
- Category (link to Categories table)
- Tags (link to Tags table)
- SEO Title, SEO Description, SEO Keywords

**Gallery Images**:
- Go to "Project Images" table
- Add new row
- Link to project
- Upload image (attachment field)
- Set Image Type (production, rendering, technical_drawing, video)
- Add Caption, Alt Text, Sort Order

### News

**Required Fields**:
- Title
- Slug
- Status (draft, published, archived)

**Optional Fields**:
- Excerpt
- Cover Image (attachment)
- Location, Date
- External Link
- Blocks (JSON format for rich content)
- Category, Tags
- SEO fields

### Articles

**Required Fields**:
- Title
- Slug
- Status (draft, published, archived)

**Optional Fields**:
- Excerpt
- Content (long text field)
- Cover Image (attachment)
- Read Time (minutes)
- Category, Tags
- SEO fields

---

## 🖼️ Image Handling

**Option 1: Upload to Airtable** (Simpler)
- Click attachment field → Upload from computer
- Airtable hosts the image
- ⚠️ **Pre-optimize images** before uploading (use TinyPNG, Squoosh, or Photoshop)

**Option 2: Use Cloudinary** (Better Performance)
- Upload via website admin panel (`/admin`)
- Get Cloudinary URL
- Paste URL into Airtable text field

---

## ⚙️ How Sync Works

The sync script (`scripts/sync-airtable.mjs`):

1. **Connects to Airtable** using API token
2. **Fetches all records** from each table
3. **Maps Airtable IDs** to MySQL IDs (Airtable uses `rec123abc`, MySQL uses integers)
4. **Updates or inserts** records in MySQL database
5. **Syncs relationships** (projects → tags, projects → categories, etc.)

**Sync is safe**:
- ✅ Existing records are updated (matched by slug)
- ✅ New records are created
- ❌ Records are NOT deleted (manual cleanup required)

---

## 🔐 Environment Variables

Required in `.env`:

```
AIRTABLE_TOKEN=patXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appYlwqLxSBOEwVVv
DATABASE_URL=mysql://user:password@host:port/database
```

These are already configured in your Manus project.

---

## 🚀 Deployment Workflow

1. **Edit in Airtable** (work at your own pace)
2. **Sync when ready**: `pnpm sync:airtable`
3. **Test locally**: Check `http://localhost:3000`
4. **Create checkpoint** in Manus
5. **Publish** via Manus UI

---

## 💡 Tips

- **Slugs must be unique** - Use lowercase, hyphens only (e.g., `my-project-name`)
- **Status controls visibility** - Only `published` items show on public site
- **Featured flag** - Mark projects/news as featured for homepage
- **Sync is fast** - Takes ~30 seconds for full sync
- **No data loss** - Sync updates existing records, doesn't delete

---

## 🆘 Troubleshooting

**Sync fails with "HTTP 401"**:
- Check `AIRTABLE_TOKEN` is correct
- Regenerate token in Airtable if needed

**Sync fails with "MySQL connection error"**:
- Check `DATABASE_URL` is correct
- Ensure database is accessible

**Images not showing**:
- Check image URLs in Airtable are valid
- Ensure images are uploaded to attachment fields (not text fields)

**Content not updating on website**:
- Run sync again: `pnpm sync:airtable`
- Check record status is `published`
- Clear browser cache

---

## 📚 Resources

- **Airtable Base**: https://airtable.com/appYlwqLxSBOEwVVv
- **Airtable API Docs**: https://airtable.com/developers/web/api/introduction
- **Sync Script**: `scripts/sync-airtable.mjs`
- **Package Command**: `pnpm sync:airtable`
