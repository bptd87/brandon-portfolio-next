# Admin Panel User Guide

## Accessing the Admin Panel

Navigate to `/admin` on your website. You must be logged in as an admin user to access this panel.

**Admin Access:** The project owner (your Manus account) is automatically set as an admin with full access to all features.

---

## Managing Projects

### Adding a New Project

1. Go to `/admin` and click the **Projects** tab
2. Click the **Add Project** button
3. Fill in the project details:
   - **Title**: Project name (e.g., "Million Dollar Quartet")
   - **Slug**: URL-friendly version (auto-generated from title, e.g., "million-dollar-quartet")
   - **Description**: Full project description with production details
   - **Category**: Select from dropdown (Scenic Design, Experiential, etc.)
   - **Tags**: Add relevant tags (Musical, Regional Theatre, etc.)
   - **Venue**: Theatre or venue name
   - **Production Company**: Producing organization
   - **Director**: Director's name
   - **Year**: Production year
   - **Location**: City, State
   - **Status**: Draft, Published, or Archived
   - **Featured**: Check to show on homepage

4. **Upload Images**:
   - Click "Upload Images" button
   - Select multiple production photos
   - Images are automatically uploaded to S3 storage
   - Set one image as the cover image

5. **SEO Settings** (optional but recommended):
   - SEO Title: Custom title for search engines
   - SEO Description: Brief description for search results
   - SEO Keywords: Comma-separated keywords

6. Click **Save Project**

### Editing an Existing Project

1. Go to `/admin` → **Projects** tab
2. Find the project in the list
3. Click the **Edit** button (pencil icon)
4. Make your changes
5. Click **Update Project**

### Deleting a Project

1. Go to `/admin` → **Projects** tab
2. Find the project in the list
3. Click the **Delete** button (trash icon)
4. Confirm deletion

**Warning:** Deletion is permanent and cannot be undone.

---

## Managing News Items

### Adding a News Item

1. Go to `/admin` → **News** tab
2. Click **Add News** button
3. Fill in the details:
   - **Title**: News headline
   - **Slug**: URL-friendly version
   - **Excerpt**: Brief summary (shown in listings)
   - **Category**: Select category (Project Launch, Publication, Award, etc.)
   - **Tags**: Add relevant tags
   - **Cover Image**: Upload a hero image
   - **Status**: Draft or Published
   - **Featured**: Check to highlight
   - **Published Date**: When to publish

4. **Add Content Blocks**:
   News items support flexible content blocks:
   
   - **Text Block**: Paragraphs of text
   - **Image Block**: Single image with caption
   - **Gallery Block**: Multiple images in a grid
   - **Quote Block**: Pull quotes with attribution
   - **Link Block**: External links with descriptions
   - **Team Block**: Team member credits
   - **Details Block**: Key-value pairs (Date, Venue, etc.)

5. Click **Save News**

### Content Block Examples

**Text Block:**
```json
{
  "type": "text",
  "content": "Your paragraph text here..."
}
```

**Image Block:**
```json
{
  "type": "image",
  "url": "https://your-image-url.com/image.jpg",
  "caption": "Image description"
}
```

**Gallery Block:**
```json
{
  "type": "gallery",
  "images": [
    { "url": "image1.jpg", "caption": "Caption 1" },
    { "url": "image2.jpg", "caption": "Caption 2" }
  ]
}
```

**Quote Block:**
```json
{
  "type": "quote",
  "content": "Quote text here",
  "author": "Author Name",
  "title": "Author Title"
}
```

---

## Managing Articles

### Adding an Article

1. Go to `/admin` → **Articles** tab
2. Click **Add Article** button
3. Fill in the details:
   - **Title**: Article headline
   - **Slug**: URL-friendly version
   - **Excerpt**: Brief summary
   - **Category**: Select category (Design Philosophy, Tutorial, etc.)
   - **Tags**: Add relevant tags
   - **Cover Image**: Upload a hero image
   - **Read Time**: Estimated minutes (auto-calculated if left blank)
   - **Status**: Draft or Published
   - **Featured**: Check to highlight

4. **Write Content**:
   Articles support structured content blocks:
   
   - **Heading**: Section headings (for table of contents)
   - **Paragraph**: Body text
   - **Quote**: Blockquotes with attribution
   - **Image**: Images with captions
   - **List**: Bulleted or numbered lists

5. **Add FAQ Section** (optional):
   - Add frequently asked questions
   - Questions appear in an accordion at the bottom

6. Click **Save Article**

### Article Content Structure

Articles use JSON content blocks for rich formatting:

```json
[
  {
    "type": "heading",
    "content": "Section Title"
  },
  {
    "type": "paragraph",
    "content": "Your paragraph text..."
  },
  {
    "type": "quote",
    "content": "Quote text",
    "author": "Author Name"
  },
  {
    "type": "image",
    "url": "https://image-url.jpg",
    "caption": "Image description"
  },
  {
    "type": "list",
    "items": ["Item 1", "Item 2", "Item 3"]
  }
]
```

---

## Managing Categories

### Adding a Category

1. Go to `/admin` → **Categories** tab
2. Click **Add Category** button
3. Fill in:
   - **Name**: Category name (e.g., "Scenic Design")
   - **Slug**: URL-friendly version
   - **Type**: Project, News, or Article
   - **Description**: Brief description (optional)

4. Click **Save Category**

### Editing/Deleting Categories

- Click **Edit** to modify a category
- Click **Delete** to remove (only if no content uses it)

---

## Managing Tags

### Adding a Tag

1. Go to `/admin` → **Tags** tab
2. Click **Add Tag** button
3. Fill in:
   - **Name**: Tag name (e.g., "Musical Theatre")
   - **Slug**: URL-friendly version

4. Click **Save Tag**

### Using Tags

Tags help organize and filter content:
- Add multiple tags to projects, news, and articles
- Users can filter content by tags
- Tags improve SEO and discoverability

---

## Image Management

### Uploading Images

All images are stored in S3 cloud storage for fast, reliable access.

**Upload Process:**
1. Click "Upload Image" or "Choose File" button
2. Select image file (JPG, PNG, WebP)
3. Image is automatically uploaded to S3
4. You receive a permanent URL
5. Image is linked to your content

**Best Practices:**
- Use high-quality production photos (1920px wide minimum)
- Optimize images before upload (under 2MB recommended)
- Use descriptive filenames
- Add captions and alt text for accessibility

### Image URLs

After upload, you'll receive URLs like:
```
https://your-cdn.s3.amazonaws.com/projects/image-abc123.jpg
```

These URLs are permanent and can be used anywhere in your content.

---

## Content Workflow

### Draft → Published Workflow

1. **Create Draft**: Start with status="Draft"
2. **Preview**: View draft content (visible only to admins)
3. **Publish**: Change status to "Published" when ready
4. **Archive**: Set status to "Archived" to hide without deleting

### Featured Content

- Check "Featured" to highlight content on homepage
- Featured projects appear in the hero carousel
- Featured news/articles appear in special sections

---

## SEO Best Practices

### For Projects:
- Write detailed descriptions (300+ words)
- Include production credits and venue information
- Add relevant tags and categories
- Upload high-quality production photos
- Fill in SEO title and description

### For Articles:
- Write clear, descriptive titles
- Include section headings for table of contents
- Add relevant internal links
- Use structured content blocks
- Include FAQ section when applicable

### For News:
- Write compelling headlines
- Include high-quality images
- Add relevant category and tags
- Link to related projects or articles

---

## Troubleshooting

### Images Not Uploading

1. Check file size (must be under 10MB)
2. Check file format (JPG, PNG, WebP only)
3. Check internet connection
4. Try refreshing the page

### Content Not Saving

1. Check all required fields are filled
2. Ensure you're logged in as admin
3. Check browser console for errors
4. Try refreshing and re-entering data

### Content Not Appearing on Site

1. Check status is set to "Published"
2. Check published date is not in the future
3. Clear browser cache
4. Check category/tags are correctly assigned

---

## Tips for Success

1. **Start with Categories**: Set up your categories and tags before adding content
2. **Use Drafts**: Create content as drafts and preview before publishing
3. **Consistent Naming**: Use consistent naming conventions for projects and venues
4. **Regular Updates**: Keep news section updated with recent work
5. **Quality Photos**: Invest time in uploading high-quality production photography
6. **SEO Matters**: Fill in SEO fields for better search engine visibility
7. **Mobile Preview**: Check how content looks on mobile devices

---

## Support

For technical issues or questions:
- Check the browser console for error messages
- Review this guide for common solutions
- Contact the developer for assistance

---

## Quick Reference

### Admin Panel Sections

- **Projects**: Manage portfolio projects
- **News**: Manage news and updates
- **Articles**: Manage blog articles
- **Categories**: Manage content categories
- **Tags**: Manage content tags

### Content Status Options

- **Draft**: Work in progress, not visible to public
- **Published**: Live and visible to everyone
- **Archived**: Hidden from public but not deleted

### Content Types

- **Projects**: Portfolio work with credits and images
- **News**: Updates, announcements, and milestones
- **Articles**: Long-form blog posts and tutorials
