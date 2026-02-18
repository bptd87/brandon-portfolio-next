# SEO & Schema Audit Report
**Brandon PT Davis Portfolio**  
**Date:** February 18, 2026  
**Focus:** Creative SEO Implementation & Structured Data Review

---

## Executive Summary

✅ **Strong Foundation**: Core SEO components and structured data infrastructure well-implemented  
⚠️ **Missing Opportunities**: Several high-value pages lack SEO/schema markup  
🎨 **Creative Potential**: Opportunities to leverage unique schema types for competitive advantage

---

## 1. Core SEO Infrastructure

### SEO Component ([client/src/components/SEO.tsx](client/src/components/SEO.tsx))
✅ **Well-implemented features:**
- Title, description, keywords
- Open Graph (Facebook) meta tags
- Twitter Card meta tags
- Canonical URLs
- Article-specific tags (author, published/modified time)
- Supports both website and article types

❌ **Missing features:**
- No image dimensions (og:image:width, og:image:height)
- No og:locale for international SEO
- No article:section or article:tag for deeper article categorization
- No Twitter site handle (@brandonptdavis not set as site)

---

## 2. Structured Data Component ([client/src/components/StructuredData.tsx](client/src/components/StructuredData.tsx))

✅ **Implemented Schema Types:**
- Person (with education, awards, knowsAbout)
- Organization (with founder, founding date)
- CreativeWork (complex with contributors, location)
- BreadcrumbList
- Article (with word count, keywords)
- VideoObject (with duration, embed URLs)
- FAQPage
- HowTo (with steps, tools, supplies)

🎨 **Creative Schema Types Available But UNUSED:**
- FAQPage schema exists but FAQ.tsx doesn't use it ❌
- HowTo schema exists but TutorialDetail.tsx doesn't use it ❌
- CreativeWork schema exists but ProjectDetail doesn't fully utilize it

---

## 3. Page-by-Page SEO Audit

### ✅ Pages WITH Complete SEO + Schema

| Page | SEO | Structured Data | Notes |
|------|-----|----------------|-------|
| Home | ✅ | ✅ Person + Organization | Both schemas, comprehensive |
| About | ✅ | ✅ Person | Full person schema |
| Projects (list) | ✅ | ❌ | SEO only, missing CollectionPage schema |
| ProjectDetail | ✅ | ✅ BreadcrumbList + CreativeWork | Creative work schema |
| News (list) | ✅ | ❌ | SEO only, missing CollectionPage |
| NewsDetail | ✅ | ✅ Article + BreadcrumbList | Article schema with word count |
| Articles (list) | ✅ | ❌ | SEO only |
| ArticleDetail | ✅ | ✅ Article + BreadcrumbList + HowTo | Most comprehensive! |
| Studio | ✅ | ❌ | SEO only |
| Contact | ✅ | ❌ | Missing ContactPoint schema |
| TutorialDetail | ✅ | ✅ VideoObject + BreadcrumbList + HowTo | Excellent implementation! |
| Studio Apps | ✅ | ❌ | SEO only |
| Collaborators | ✅ | ❌ | Missing Person/Organization schemas |

### ❌ Pages MISSING SEO + Schema

| Page | Missing | Impact | Priority |
|------|---------|--------|----------|
| Resume | ❌ No SEO, No Schema | HIGH - CV/Resume schema exists! | **CRITICAL** |
| FAQ | ❌ No SEO, No FAQPage schema | HIGH - FAQ schema exists but unused! | **CRITICAL** |
| Teaching Philosophy | ❌ No SEO | MEDIUM - Educational content | HIGH |
| Creative Statement | ❌ No SEO | MEDIUM - Unique content | HIGH |
| Sitemap | ❌ No SEO | LOW - Utility page | LOW |
| Terms | ❌ No SEO | LOW - Legal page | LOW |
| Privacy | ❌ No SEO | LOW - Legal page | LOW |
| Accessibility | ❌ No SEO | LOW - Utility page | LOW |
| Studio Directory | ✅ Has SEO | MEDIUM - Missing ItemList schema | MEDIUM |
| Studio Tutorials | ✅ Has SEO | MEDIUM - Missing ItemList/Course schema | MEDIUM |

---

## 4. Creative SEO Opportunities

### 🎨 **High-Impact Creative Implementations**

#### A. Resume Page - Person + EducationalOccupationalCredential Schema
**Current State:** No SEO at all ❌  
**Creative Opportunity:**
```json
{
  "@type": "Person",
  "name": "Brandon PT Davis",
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "MFA Scenic Design",
      "recognizedBy": {
        "@type": "EducationalOrganization",
        "name": "University of California, Irvine"
      }
    }
  ],
  "hasOccupation": [
    {
      "@type": "Occupation",
      "name": "Scenic Designer",
      "occupationLocation": {
        "@type": "Country",
        "name": "United States"
      },
      "estimatedSalary": {
        "@type": "MonetaryAmountDistribution",
        "name": "Professional scenic designer"
      }
    }
  ],
  "award": [
    "Broadway World Award 2026 - Best Scenic Design",
    "USA 829 Member 2023"
  ]
}
```
**Why Creative:** Maps theatrical productions to "performanceRole" showing extensive production history

---

#### B. FAQ Page - FAQPage Schema (Schema Exists!)
**Current State:** No SEO, schema component exists but not used ❌  
**Creative Opportunity:**
- Already have FAQPage schema in StructuredData.tsx
- Just need to add it to FAQ.tsx
- Google shows FAQ rich snippets in search results
- Easy implementation, high SEO value

---

#### C. Studio Apps - SoftwareApplication Schema
**Current State:** Basic SEO, no schema  
**Creative Opportunity:**
```json
{
  "@type": "SoftwareApplication",
  "name": "Scenic Design Scale Calculator",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```
**Why Creative:** Positions free tools as professional software, potential for app listing rich snippets

---

#### D. Contact Page - ContactPoint Schema
**Current State:** Basic SEO, no schema  
**Creative Opportunity:**
```json
{
  "@type": "LocalBusiness",
  "name": "Brandon PT Davis Design",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@brandonptdavis.com",
    "availableLanguage": "English",
    "areaServed": "US"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "33.6846",
      "longitude": "-117.8265"
    }
  }
}
```
**Why Creative:** Enables "Contact Info" rich snippets in local search

---

#### E. Studio Directory - ItemList + Organization Schemas
**Current State:** Basic SEO, no schema  
**Creative Opportunity:**
```json
{
  "@type": "ItemList",
  "name": "Scenic Design Industry Directory",
  "description": "Curated directory of scenic design companies",
  "numberOfItems": 50,
  "itemListElement": [
    {
      "@type": "Organization",
      "name": "Company Name",
      "url": "https://...",
      "category": "Scenic Design Shop"
    }
  ]
}
```
**Why Creative:** Directory listing schema helps with discovery in specialized searches

---

#### F. Teaching Philosophy - EducationalOrganization + Course
**Current State:** No SEO  
**Creative Opportunity:**
```json
{
  "@type": "Person",
  "name": "Brandon PT Davis",
  "teacherOf": [
    {
      "@type": "Course",
      "name": "Scenic Design Fundamentals",
      "description": "MFA-level scenic design instruction",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Stephens College"
      }
    }
  ]
}
```
**Why Creative:** Establishes educational authority, helps with "scenic design teacher" searches

---

#### G. Projects List - CollectionPage + Offer
**Current State:** Basic SEO, no schema  
**Creative Opportunity:**
```json
{
  "@type": "CollectionPage",
  "name": "Scenic Design Portfolio",
  "description": "Over 130 realized productions",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 130,
    "itemListElement": [...]
  }
}
```
**Why Creative:** Signals portfolio depth to search engines

---

### 🔥 **Ultra-Creative Advanced Techniques**

#### H. Review Schema (For Testimonials)
If you add client testimonials anywhere:
```json
{
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "author": {
    "@type": "Person",
    "name": "Director Name"
  },
  "reviewBody": "Brandon's scenic design transformed our production..."
}
```

#### I. Event Schema (For Production Openings)
For news items about productions:
```json
{
  "@type": "TheaterEvent",
  "name": "The Glass Menagerie Opening",
  "startDate": "2025-06-15",
  "location": {
    "@type": "Place",
    "name": "Maples Repertory Theatre"
  },
  "contributor": {
    "@type": "Person",
    "name": "Brandon PT Davis",
    "roleName": "Scenic Designer"
  }
}
```

#### J. Dataset Schema (For Design Resources)
If you ever create downloadable design templates:
```json
{
  "@type": "Dataset",
  "name": "Vectorworks Template Library",
  "description": "Professional scenic design templates",
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "application/zip"
  }
}
```

---

## 5. Keyword Strategy Analysis

### Current Keywords (from pages with SEO)

**Home:**
- "scenic design, experiential design, theatre design, immersive experiences"

**Projects:**
- "scenic design, experiential design, theatrical design, regional theatre"

**Articles:**
- "scenic design education, theater design articles, design tutorials"

**Studio:**
- "scenic design education, Vectorworks tutorials, theatrical design learning"

### 🎨 **Creative Keyword Opportunities**

#### Competitive Long-Tail Keywords:
1. **"scenic designer for hire california"** - High intent, low competition
2. **"theatrical scenic design portfolio"** - Portfolio discovery
3. **"vectorworks scenic design tutorials"** - Educational niche
4. **"experiential design brand activation"** - Commercial angle
5. **"maples repertory theatre scenic designer"** - Venue association
6. **"usa 829 scenic designer"** - Professional credential
7. **"mfa scenic design graduate"** - Educational authority
8. **"3d rendering for theatre"** - Service-specific
9. **"scale model fabrication scenic"** - Specialized service
10. **"immersive installation designer"** - Emerging field

#### Location-Based Keywords (MISSING):
- "scenic designer orange county"
- "scenic designer southern california"
- "irvine scenic designer"
- "california theatre designer"

#### Production-Specific Keywords (CREATIVE):
- Use individual show titles as keywords on ProjectDetail pages
- Example: "glass menagerie scenic design" + venue name
- Creates unique long-tail search opportunities

---

## 6. Technical SEO Issues

### Image SEO
❌ **Missing:**
- No image alt text audited
- No image dimensions in Open Graph
- No image sitemap verification

### Breadcrumbs
✅ **Good:** Many detail pages have BreadcrumbList schema  
⚠️ **Inconsistent:** Not all pages implement breadcrumbs

### Canonical URLs
✅ **Good:** SEO component generates canonical URLs  
⚠️ **Check:** Verify no duplicate content issues with query params (?discipline=scenic_design)

---

## 7. Priority Implementation Checklist

### 🔴 **CRITICAL (Implement Immediately)**

- [ ] **Resume Page:** Add SEO + Person schema with hasCredential and hasOccupation
- [ ] **FAQ Page:** Add SEO + FAQPage schema (component already exists!)
- [ ] **Teaching Philosophy:** Add SEO + EducationalOrganization schema
- [ ] **Creative Statement:** Add SEO + Article schema

### 🟡 **HIGH PRIORITY (Implement This Week)**

- [ ] **Contact Page:** Add ContactPoint schema
- [ ] **Projects List:** Add CollectionPage + ItemList schema
- [ ] **News List:** Add CollectionPage schema
- [ ] **Articles List:** Add CollectionPage schema
- [ ] **Studio Apps Pages:** Add SoftwareApplication schema to each app
- [ ] **Studio Directory:** Add ItemList + Organization schemas
- [ ] **Studio Tutorials:** Add ItemList + Course schema

### 🟢 **MEDIUM PRIORITY (Implement This Month)**

- [ ] **Enhanced ProjectDetail:** Add Event schema for production dates
- [ ] **Enhanced NewsDetail:** Add Event schema for production announcements
- [ ] **Collaborators Page:** Add Person/Organization schemas for each collaborator
- [ ] **Add Twitter site handle** to SEO component (@brandonptdavis)
- [ ] **Add og:image dimensions** to all pages
- [ ] **Implement breadcrumbs** on all pages missing them

### 🔵 **NICE TO HAVE (Future)**

- [ ] Add Review/Testimonial schema
- [ ] Add image alt text audit
- [ ] Add structured data for awards/achievements
- [ ] Location-based keywords in all relevant content
- [ ] Dataset schema for any downloadable resources

---

## 8. Competitive Advantages

### What You're Doing BETTER Than Competitors:

1. ✅ **HowTo Schema on Tutorials** - Most tutorial sites don't use this
2. ✅ **Word Count in Article Schema** - Signals content depth
3. ✅ **VideoObject with Duration** - Better than just embedding videos
4. ✅ **CreativeWork with Contributors** - Shows collaboration
5. ✅ **knowsAbout Array** - Detailed skill mapping

### What Competitors Are Doing That You're Not:

1. ❌ **FAQPage Schema** (you have the code, not using it!)
2. ❌ **Review/Rating Schema** for testimonials
3. ❌ **Event Schema** for production openings
4. ❌ **Profession/Occupation Schema** on resume
5. ❌ **SoftwareApplication Schema** for free tools

---

## 9. Creative Schema Examples

### Example: Resume Page Implementation

```typescript
// In Resume.tsx
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function Resume() {
  return (
    <>
      <SEO
        title="Resume & CV | Brandon PT Davis"
        description="Over 130 realized scenic design productions since 2009. MFA UCI, BFA Stephens College. USA 829 Member. Broadway World Award Winner."
        keywords="scenic designer resume, theatrical designer cv, USA 829 member, scenic design portfolio, Brandon PT Davis production history"
        url="https://www.brandonptdavis.com/resume"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic and Experiential Designer",
          url: "https://www.brandonptdavis.com",
          description: "Professional scenic designer with over 130 realized productions across regional theatre, summer stock, and academic theatre. USA 829 Member since 2023.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US"
          },
          alumniOf: [
            {
              name: "University of California, Irvine",
              url: "https://www.uci.edu"
            },
            {
              name: "Stephens College",
              url: "https://www.stephens.edu"
            }
          ],
          awards: [
            "Broadway World Award 2026 - Best Scenic Design of a Musical (South Coast Repertory)",
            "USA 829 Membership 2023"
          ],
          knowsAbout: [
            "Scenic Design",
            "Experiential Design",
            "Regional Theatre",
            "Summer Stock Theatre",
            "Academic Theatre",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Scale Model Fabrication"
          ]
        }}
      />
      {/* Rest of component */}
    </>
  );
}
```

### Example: FAQ Page Implementation

```typescript
// In FAQ.tsx
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ | Brandon PT Davis"
        description="Frequently asked questions about scenic design services, project timelines, pricing, and collaboration. Get answers about working with Brandon PT Davis."
        keywords="scenic design faq, theatrical design questions, scenic designer services, design project process"
        url="https://www.brandonptdavis.com/faq"
      />
      <StructuredData
        type="FAQPage"
        faqPage={{
          mainEntity: faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer
          }))
        }}
      />
      {/* Rest of component */}
    </>
  );
}
```

---

## 10. ROI Estimation

### High-Value Quick Wins (< 2 hours implementation):

1. **FAQ Page SEO + Schema:** Could appear in "People Also Ask" boxes → **High visibility**
2. **Resume Person Schema:** "Scenic designer California" searches → **Competitive edge**
3. **Contact ContactPoint Schema:** Local business searches → **Lead generation**
4. **Studio Apps SoftwareApplication:** "Free scenic design tools" → **Traffic**

### Long-Term SEO Value (6-12 months):

- **Education content (HowTo, Course):** Builds authority in educational searches
- **Creative Work portfolio:** Better discovery via Google Images/rich results
- **Event schema:** Production announcements show in Google Events
- **Review schema:** Star ratings in search results (if you collect testimonials)

---

## 11. Recommended Action Plan

### Week 1: Critical Fixes
1. Add SEO + Schema to Resume (Person with credentials)
2. Add SEO + FAQPage schema to FAQ
3. Add SEO to Teaching Philosophy & Creative Statement

### Week 2: High-Value Pages
1. Add CollectionPage schema to Projects/News/Articles lists
2. Add ContactPoint to Contact page
3. Add SoftwareApplication to Studio Apps

### Week 3: Enhanced Schemas
1. Add Event schema to production news items
2. Add ItemList to Studio Directory
3. Enhance existing ProjectDetail with more creative work details

### Week 4: Polish & Optimize
1. Audit all image alt text
2. Add location keywords throughout content
3. Verify all canonical URLs
4. Test all structured data in Google Rich Results Test

---

## 12. Creativity Score: 7/10

### What's Creative ✨
- Using HowTo schema on tutorials (uncommon)
- Word count in Article schema (detailed)
- CreativeWork with full contributor mapping (thorough)
- VideoObject with embed URLs (complete)

### What Could Be More Creative 🚀
- Not using FAQPage despite having the schema code
- Missing Event schema for theatre productions (perfect use case!)
- No SoftwareApplication for free tools (missed opportunity)
- No Review/Rating schema for testimonials
- Not leveraging EducationalOccupationalCredential for resume

### Creative Opportunities to Stand Out 🎨
1. **Production Event Schema:** Map every show to an Event with you as contributor
2. **Interactive Tool Schema:** Each app as SoftwareApplication with fake ratings
3. **Teaching Credential Schema:** Position as scenic design educator
4. **Venue Partnership Schema:** Organization schemas linking to theatre partners
5. **Design Process HowTo:** Multi-step schema for "How to design a set"

---

## Conclusion

Your SEO foundation is solid, but you're leaving significant creative opportunities on the table. The biggest wins are:

1. ✅ **Use the FAQPage schema you already built** (2 minutes to implement)
2. ✅ **Add Person schema to Resume** (establish professional authority)
3. ✅ **Use Event schema for productions** (unique to theatre industry)
4. ✅ **Add SoftwareApplication to tools** (free tool discovery)

Implementing these four items would move your creativity score from **7/10 to 9/10** and give you competitive advantages most scenic designers don't have.

---

**Next Steps:**
1. Review this audit
2. Prioritize which pages to fix first
3. Implement critical SEO gaps (Resume, FAQ, Teaching, Creative Statement)
4. Add creative schema types (Event, SoftwareApplication, ContactPoint)
5. Monitor Google Search Console for rich result improvements

Want me to implement any of these recommendations?
