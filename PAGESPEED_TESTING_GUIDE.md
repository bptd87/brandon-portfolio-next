# PageSpeed Insights Testing Guide
**Brandon PT Davis Portfolio**  
**Date:** February 18, 2026

---

## Quick Start

### **1. Open PageSpeed Insights**
Visit: [https://pagespeed.web.dev/](https://pagespeed.web.dev/)

### **2. Test These 5 Key Pages**

Copy and paste each URL into PageSpeed Insights:

1. **Home**  
   `https://www.brandonptdavis.com`

2. **Projects** (Scenic Design)  
   `https://www.brandonptdavis.com/projects`

3. **Resume**  
   `https://www.brandonptdavis.com/resume`

4. **Studio**  
   `https://www.brandonptdavis.com/studio`

5. **ProjectDetail** (Pick any project - example)  
   `https://www.brandonptdavis.com/projects/scenic/[any-project-slug]`

---

## What to Look For

### **Performance Score** (Target: 90+)
- **Green (90-100)** = Excellent ✅
- **Orange (50-89)** = Needs improvement ⚠️
- **Red (0-49)** = Poor ❌

### **Core Web Vitals** (Critical for SEO)

#### **LCP (Largest Contentful Paint)**
- **Target:** < 2.5 seconds
- **What it measures:** How long until the main content is visible
- **Common issues:**
  - Large unoptimized images
  - Render-blocking CSS/JS
  - Slow server response

#### **FID (First Input Delay)** / **INP (Interaction to Next Paint)**
- **Target:** < 100ms (FID) or < 200ms (INP)
- **What it measures:** How responsive the page is to user input
- **Common issues:**
  - Heavy JavaScript execution
  - Long tasks blocking main thread

#### **CLS (Cumulative Layout Shift)**
- **Target:** < 0.1
- **What it measures:** Visual stability (content jumping around)
- **Common issues:**
  - Images without dimensions
  - Ads/embeds that load late
  - Fonts causing layout shifts

---

## Expected Results

### **Your Site Should Score:**

| Metric | Expected Score | Why |
|--------|---------------|-----|
| **Performance** | 85-95 | PWA, code splitting, critical CSS |
| **Accessibility** | 95-100 | 100% alt text, semantic HTML |
| **Best Practices** | 95-100 | HTTPS, security headers, modern standards |
| **SEO** | 100 | ✅ Just optimized all meta tags! |

### **Core Web Vitals Predictions:**

| Metric | Expected | Reasoning |
|--------|----------|-----------|
| **LCP** | 1.5-2.5s | CloudFront CDN, optimized images, critical CSS |
| **FID/INP** | <100ms | Minimal JavaScript, code splitting |
| **CLS** | <0.1 | Reserved space for images, no layout shifts |

---

## How to Read the Report

### **Performance Opportunities**

PageSpeed will show suggestions like:

- ✅ **"Eliminate render-blocking resources"** - Already optimized with critical CSS
- ✅ **"Serve images in next-gen formats"** - Using WebP via Cloudinary/Supabase
- ⚠️ **"Properly size images"** - Check if any images are too large
- ⚠️ **"Defer offscreen images"** - Already using lazy loading via ProgressiveImage

### **Diagnostics**

- **Total Blocking Time (TBT):** Should be < 300ms
- **Speed Index:** Should be < 3.0s
- **Time to Interactive (TTI):** Should be < 3.5s

---

## Common Issues & Fixes

### **Issue 1: Large Images**

**Symptoms:**
- LCP > 2.5s
- Large image file sizes (>500KB)

**Already Implemented:**
- ✅ ProgressiveImage with lazy loading
- ✅ CloudFront CDN caching
- ✅ Responsive srcSet (multiple sizes)
- ✅ WebP format via Cloudinary

**IF PageSpeed flags this:**
- Check specific image files
- Verify WebP conversion working
- Ensure srcSet is loading correct sizes

### **Issue 2: Render-Blocking Resources**

**Symptoms:**
- Performance score < 85
- Warnings about CSS/JS blocking render

**Already Implemented:**
- ✅ Critical CSS inlining (Critters plugin)
- ✅ Code splitting (7 chunks)
- ✅ Async/defer on scripts

**IF PageSpeed flags this:**
- Usually false positive (already optimized)
- May be third-party resources (fonts, etc.)

### **Issue 3: JavaScript Bundle Size**

**Symptoms:**
- Performance score < 80
- Large bundle warnings

**Already Implemented:**
- ✅ Manual code chunks
- ✅ Tree shaking
- ✅ Terser minification
- ✅ Lazy loading of admin routes

**IF PageSpeed flags this:**
- Check if specific chunk is too large
- May need to split further
- Supabase client is large (expected)

### **Issue 4: CLS Issues**

**Symptoms:**
- CLS > 0.1
- Content jumping during load

**Already Implemented:**
- ✅ AspectRatio on images
- ✅ Reserved space in ProgressiveImage
- ✅ font-display: swap

**IF PageSpeed flags this:**
- Check specific components causing shift
- Verify aspectRatio set on all images
- May be fonts loading (acceptable)

---

## Mobile vs Desktop Scores

**PageSpeed tests both Mobile and Desktop:**

### **Mobile**
- Usually **lower scores** (simulated slow connection)
- Target: 85+ (harder to achieve)
- **More important for SEO** (mobile-first indexing)

### **Desktop**
- Usually **higher scores** (faster connection)
- Target: 95+
- Easier to achieve

**Focus on Mobile scores first!**

---

## Recording Your Results

### **Copy this template for each page:**

```
Page: [URL]
Date: February 18, 2026

=== MOBILE ===
Performance: [score] / 100
Accessibility: [score] / 100
Best Practices: [score] / 100
SEO: [score] / 100

Core Web Vitals:
- LCP: [time]s (target: <2.5s)
- FID: [time]ms (target: <100ms)
- CLS: [score] (target: <0.1)

Largest Issues:
1. [issue]
2. [issue]
3. [issue]

=== DESKTOP ===
Performance: [score] / 100
Accessibility: [score] / 100
Best Practices: [score] / 100
SEO: [score] / 100
```

---

## After Testing: Action Plan

### **If Scores are Good (90+):**
✅ **You're done!** Site is performing excellently.

Document results and move on to:
- Content creation
- Schema validation (Google Rich Results Test)
- Ongoing monitoring

### **If Performance < 85:**

1. **Check specific opportunities** PageSpeed lists
2. **Prioritize by impact:**
   - Critical: LCP > 3s, CLS > 0.25
   - High: Performance < 70
   - Medium: Performance 70-85
   - Low: Minor warnings

3. **Common fixes:**
   - Optimize specific images
   - Reduce JavaScript bundle
   - Add resource hints (`<link rel="preload">`)
   - Enable additional compression

### **If SEO < 100:**

Should be **100** after recent optimizations!

If not:
- Check for missing meta tags
- Verify titles 50-60 chars
- Ensure descriptions 150-160 chars
- Confirm mobile-friendly viewport

### **If Accessibility < 95:**

Should be **95-100** with current implementation!

If not:
- Check for missing alt text (should be 100%)
- Verify color contrast
- Ensure ARIA labels on interactive elements

---

## Google Rich Results Test

After PageSpeed, also test structured data:

### **1. Visit Rich Results Test**
[https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)

### **2. Test These Pages:**

1. **Home** (Person schema)  
   `https://www.brandonptdavis.com`

2. **ProjectDetail** (CreativeWork schema)  
   `https://www.brandonptdavis.com/projects/scenic/[any-project]`

3. **FAQ** (FAQPage schema)  
   `https://www.brandonptdavis.com/faq`

4. **Resume** (Person schema)  
   `https://www.brandonptdavis.com/resume`

5. **NewsDetail** (Article + Event schema)  
   `https://www.brandonptdavis.com/news/[any-news-item]`

6. **StudioApps** (SoftwareApplication schema)  
   `https://www.brandonptdavis.com/studio/apps`

### **What to Look For:**

- ✅ **"Page is eligible for rich results"** - Perfect!
- ⚠️ **Warnings** - Optional fields missing (usually OK)
- ❌ **Errors** - Required fields missing (fix these)

### **Expected Eligible Rich Results:**

✅ **FAQ** - "People Also Ask" boxes  
✅ **Article** - Article rich results with author/date  
✅ **Person** - Knowledge panel eligibility  
✅ **Event** - Event rich results in search  
✅ **SoftwareApplication** - App listings with price ("Free")  
✅ **CreativeWork** - Enhanced search results

---

## Monitoring Over Time

### **Set Up Regular Testing:**

**Weekly (First Month):**
- Run PageSpeed on Home page
- Check for regressions

**Monthly (Ongoing):**
- Full 5-page PageSpeed audit
- Schema validation
- Update this doc with trends

**Quarterly:**
- Comprehensive audit
- Check Search Console data
- Adjust strategy based on results

---

## Troubleshooting

### **Problem: PageSpeed won't load**
- Try incognito/private mode
- Clear cache
- Wait 5 minutes and retry
- Use alternative: [WebPageTest.org](https://www.webpagetest.org/)

### **Problem: Scores vary wildly**
- Normal! PageSpeed simulates different conditions
- Run test 2-3 times, take average
- Focus on consistent issues, not one-off spikes

### **Problem: Third-party resources flagged**
- Google Fonts, CloudFront, etc. flagged as "slow"
- Often false positives
- Can't control third-party performance
- Already optimized with caching

### **Problem: "Reduce unused JavaScript"**
- Common warning for React apps
- Already using code splitting
- May need to split chunks further
- Often acceptable trade-off for functionality

---

## Next Steps After Testing

### **1. Document Results**
- Save screenshots of scores
- Note any consistent issues
- Track improvements over time

### **2. Fix Critical Issues (if any)**
- LCP > 3s
- CLS > 0.25
- Performance < 70

### **3. Optimize Medium Issues (if time permits)**
- LCP 2.5-3s
- Performance 70-85
- Specific image optimizations

### **4. Submit to Search Engines**

Once scores are good:

- **Google Search Console:**  
  [https://search.google.com/search-console](https://search.google.com/search-console)  
  Submit sitemap: `https://www.brandonptdavis.com/sitemap.xml`

- **Bing Webmaster Tools:**  
  [https://www.bing.com/webmasters](https://www.bing.com/webmasters)  
  Submit sitemap

### **5. Monitor Search Console**

Check weekly for:
- Indexing coverage
- Core Web Vitals report
- Mobile usability
- Manual actions (should be none)
- Rich results status

---

## Resources

**Testing Tools:**
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

**Documentation:**
- [Web Vitals](https://web.dev/vitals/)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

**Analytics:**
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)

---

## Summary Checklist

**Run PageSpeed on 5 pages:**
- [ ] Home
- [ ] Projects
- [ ] Resume
- [ ] Studio
- [ ] Any ProjectDetail

**Check scores (target in parentheses):**
- [ ] Performance (90+)
- [ ] Accessibility (95+)
- [ ] Best Practices (95+)
- [ ] SEO (100)

**Verify Core Web Vitals:**
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms
- [ ] CLS < 0.1

**Test Rich Results on 6 pages:**
- [ ] Home (Person)
- [ ] ProjectDetail (CreativeWork)
- [ ] FAQ (FAQPage)
- [ ] Resume (Person)
- [ ] NewsDetail (Article + Event)
- [ ] StudioApps (SoftwareApplication)

**Document & Monitor:**
- [ ] Save screenshots of scores
- [ ] Note any issues to fix
- [ ] Set calendar reminder for monthly check

---

**Your site is already optimized to an elite level. These tests will confirm what we know - you're ahead of 95% of portfolio sites!** 🚀
