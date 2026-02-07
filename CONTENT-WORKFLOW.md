# Content Workflow Documentation

## Overview

This portfolio uses a **markdown-based content workflow** for articles and news. Instead of using the web-based block editor, content is created as markdown files and imported via a script. This approach provides:

- **Better version control** - Track content changes in git
- **Faster editing** - Use your preferred text editor
- **Cleaner formatting** - No messy WYSIWYG issues
- **Bulk operations** - Import multiple articles at once
- **Image management** - Automatic S3 upload and CDN URLs

---

## Article Format

Create articles as markdown files with YAML frontmatter:

```markdown
---
title: "Your Article Title"
slug: "your-article-slug"
excerpt: "A brief summary of the article (1-2 sentences)"
coverImage: "./images/cover.jpg"
publishedAt: "2026-02-07"
categories:
  - Design Philosophy
  - Process
tags:
  - scenic design
  - workflow
  - technology
seo:
  title: "SEO Title (optional, defaults to title)"
  description: "SEO meta description"
---

# Your Article Title

Your article content goes here in standard markdown format.

## Headings

Use standard markdown headings (##, ###, etc.)

## Images

### Inline Images

![Alt text for image](./images/inline-image.jpg)

### Image with Caption

![Production photo of set design](./images/set-photo.jpg)
*Caption: The completed set for Act II*

### Image Galleries

Create galleries by grouping images together:

<!-- gallery -->
![Image 1](./images/gallery-1.jpg)
![Image 2](./images/gallery-2.jpg)
![Image 3](./images/gallery-3.jpg)
<!-- /gallery -->

## Quotes

> This is a pull quote or blockquote.
> It will be styled prominently in the article.

## Lists

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

## Links

[Link text](https://example.com)

## Emphasis

**Bold text** and *italic text*

## Code (if needed)

\`\`\`javascript
const example = "code block";
\`\`\`
```

---

## Directory Structure

Organize content in the `content/` directory:

```
content/
├── articles/
│   ├── 2026-02-07-article-slug/
│   │   ├── index.md
│   │   └── images/
│   │       ├── cover.jpg
│   │       ├── inline-1.jpg
│   │       └── inline-2.jpg
│   └── 2026-02-10-another-article/
│       ├── index.md
│       └── images/
│           └── cover.jpg
└── news/
    ├── 2026-02-01-news-item/
    │   ├── index.md
    │   └── images/
    │       └── photo.jpg
    └── 2026-02-05-another-news/
        └── index.md
```

---

## Import Process

### 1. Create Content

Create a new directory for your article:

```bash
mkdir -p content/articles/2026-02-07-my-new-article/images
```

### 2. Write Markdown

Create `index.md` with your content and frontmatter.

### 3. Add Images

Place all images in the `images/` subdirectory.

### 4. Run Import Script

```bash
cd /home/ubuntu/brandon-portfolio-v2
pnpm import:content
```

The script will:
- Parse markdown and frontmatter
- Upload all images to S3
- Convert content to block format
- Insert into database with proper relationships
- Generate slugs and SEO metadata

### 5. Verify

Check the articles page to see your imported content.

---

## Image Guidelines

### File Formats
- **Photos**: JPG/JPEG (optimized for web)
- **Graphics/Diagrams**: PNG
- **Avoid**: Large uncompressed files

### Naming
- Use descriptive names: `set-design-act-2.jpg` not `IMG_1234.jpg`
- Use hyphens, not spaces: `production-photo.jpg` not `production photo.jpg`
- Keep names short but meaningful

### Sizes
- **Cover images**: 1920x1080px or similar 16:9 ratio
- **Inline images**: Max 2000px width
- **Thumbnails**: Will be generated automatically

### Alt Text
Always provide descriptive alt text in markdown:
```markdown
![Scenic rendering showing Gothic cathedral interior with dramatic lighting](./images/cathedral-render.jpg)
```

---

## Categories and Tags

### Categories (Broad Topics)
- Design Philosophy
- Process
- Technology
- Case Studies
- Education
- Industry

### Tags (Specific Topics)
- scenic design
- rendering
- Vectorworks
- workflow
- collaboration
- lighting
- projection
- etc.

---

## SEO Best Practices

### Title
- 50-60 characters
- Include primary keyword
- Make it compelling

### Description
- 150-160 characters
- Include primary and secondary keywords
- Clear value proposition

### Slug
- Use hyphens between words
- Keep it short but descriptive
- Include primary keyword
- Example: `scenic-design-workflow-2026`

---

## Bulk Import

To import multiple articles at once:

1. Create multiple article directories in `content/articles/`
2. Run the import script once
3. All new articles will be processed

The script tracks what's already imported and only processes new content.

---

## Updating Existing Articles

To update an existing article:

1. Modify the markdown file
2. Run the import script with `--update` flag:
   ```bash
   pnpm import:content --update
   ```

The script will match by slug and update the content.

---

## News Items

News items follow the same format but typically:
- Shorter content
- More timely/date-sensitive
- May not need cover images
- Simpler structure

Place in `content/news/` instead of `content/articles/`.

---

## Troubleshooting

### Images not showing
- Check file paths are relative to the markdown file
- Ensure images are in the `images/` subdirectory
- Verify image files exist and aren't corrupted

### Import fails
- Check YAML frontmatter syntax
- Ensure required fields are present (title, slug, excerpt)
- Look for special characters that need escaping

### Formatting issues
- Use standard markdown syntax
- Avoid mixing HTML and markdown
- Test locally before importing

---

## Future Enhancements

Planned features:
- Draft mode for unpublished articles
- Scheduled publishing
- Automatic image optimization
- Related articles suggestions
- Reading time calculation
- Social media preview generation

---

## Questions?

For issues or questions about the content workflow, check the import script logs or contact the developer.
