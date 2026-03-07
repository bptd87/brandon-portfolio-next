import { Helmet } from 'react-helmet-async';

/**
 * Structured Data component for adding JSON-LD schema markup
 * Supports Person and Organization schemas for rich snippets in search results
 */

interface PersonSchema {
  name: string;
  jobTitle?: string;
  url?: string;
  image?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  sameAs?: string[]; // Social media profiles
  alumniOf?: Array<{
    name: string;
    url?: string;
  }>;
  knowsAbout?: string[];
  awards?: string[];
}

interface OrganizationSchema {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  founder?: {
    name: string;
    url?: string;
  };
  foundingDate?: string;
  email?: string;
  sameAs?: string[];
  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  image?: string | string[];
}

interface CreativeWorkSchema {
  name: string;
  description?: string;
  image?: string | string[];
  creator?: {
    name: string;
    url?: string;
  };
  dateCreated?: string;
  datePublished?: string;
  dateModified?: string;
  genre?: string;
  keywords?: string[];
  mainEntityOfPage?: string;
  locationCreated?: {
    name: string;
    address?: {
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  };
  url?: string;
  workExample?: Array<{
    type: 'ImageObject';
    contentUrl: string;
    caption?: string;
    name?: string;
    description?: string;
    thumbnailUrl?: string;
    encodingFormat?: string;
    width?: number;
    height?: number;
  }>;
  about?: string;
  contributor?: Array<{
    type: 'Person';
    name: string;
    roleName?: string;
  }>;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ArticleSchema {
  headline: string;
  description?: string;
  image?: string;
  author: {
    name: string;
    url?: string;
  };
  datePublished: string;
  dateModified?: string;
  publisher: {
    name: string;
    logo?: string;
  };
  url: string;
  articleBody?: string;
  wordCount?: number;
  keywords?: string[];
}

interface VideoObjectSchema {
  name: string;
  description?: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 duration format (e.g., "PT10M30S")
  contentUrl?: string;
  embedUrl?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
}

interface FAQPageSchema {
  mainEntity: Array<{
    question: string;
    answer: string;
  }>;
}

interface HowToSchema {
  name: string;
  description?: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M")
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: Array<{
    name: string;
    url?: string;
  }>;
  tool?: Array<{
    name: string;
    url?: string;
  }>;
  step: Array<{
    name: string;
    text?: string;
    url?: string;
    image?: string;
  }>;
}

interface EventSchema {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: {
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  };
  performer?: {
    name: string;
    jobTitle?: string;
    url?: string;
  };
  image?: string;
  url?: string;
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}

interface SoftwareApplicationSchema {
  name: string;
  description?: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  image?: string;
  url?: string;
  softwareVersion?: string;
  aggregateRating?: {
    ratingValue: string;
    ratingCount: number;
  };
}

interface WebSiteSchema {
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  publisher?: {
    name: string;
    logo?: string;
  };
}

interface ProfilePageSchema {
  url: string;
  name: string;
  description?: string;
  dateModified?: string;
  primaryImageOfPage?: string;
  mainEntity: PersonSchema;
}

interface EducationalOrganizationSchema {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

interface CourseSchema {
  name: string;
  description?: string;
  url?: string;
  provider: {
    name: string;
    url?: string;
    type?: 'Organization' | 'EducationalOrganization';
  };
  courseCode?: string;
  educationalCredentialAwarded?: string;
  teaches?: string[];
  inLanguage?: string;
  keywords?: string[];
}

interface ItemListSchema {
  name: string;
  description?: string;
  url?: string;
  itemListElement: Array<{
    name: string;
    url: string;
    position?: number;
    datePublished?: string;
    image?: string;
  }>;
}

interface CollectionPageSchema {
  name: string;
  url: string;
  description?: string;
  about?: string;
  primaryImageOfPage?: string;
  mainEntity?: ItemListSchema;
}

interface StructuredDataProps {
  type: 'Person' | 'Organization' | 'Both' | 'CreativeWork' | 'BreadcrumbList' | 'Article' | 'NewsArticle' | 'VideoObject' | 'FAQPage' | 'HowTo' | 'Event' | 'SoftwareApplication' | 'WebSite' | 'ProfilePage' | 'ItemList' | 'CollectionPage' | 'EducationalOrganization' | 'Course';
  person?: PersonSchema;
  organization?: OrganizationSchema;
  creativeWork?: CreativeWorkSchema;
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleSchema;
  videoObject?: VideoObjectSchema;
  faqPage?: FAQPageSchema;
  howTo?: HowToSchema;
  event?: EventSchema;
  softwareApplication?: SoftwareApplicationSchema;
  webSite?: WebSiteSchema;
  profilePage?: ProfilePageSchema;
  itemList?: ItemListSchema;
  collectionPage?: CollectionPageSchema;
  educationalOrganization?: EducationalOrganizationSchema;
  course?: CourseSchema;
}

export default function StructuredData({ type, person, organization, creativeWork, breadcrumbs, article, videoObject, faqPage, howTo, event, softwareApplication, webSite, profilePage, itemList, collectionPage, educationalOrganization, course }: StructuredDataProps) {
  const generatePersonSchema = (data: PersonSchema) => {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
    };

    if (data.jobTitle) schema.jobTitle = data.jobTitle;
    if (data.url) schema.url = data.url;
    if (data.image) schema.image = data.image;
    if (data.description) schema.description = data.description;
    if (data.email) schema.email = `mailto:${data.email}`;
    if (data.telephone) schema.telephone = data.telephone;

    if (data.address) {
      schema.address = {
        '@type': 'PostalAddress',
        ...data.address,
      };
    }

    if (data.sameAs && data.sameAs.length > 0) {
      schema.sameAs = data.sameAs;
    }

    if (data.alumniOf && data.alumniOf.length > 0) {
      schema.alumniOf = data.alumniOf.map(school => ({
        '@type': 'EducationalOrganization',
        name: school.name,
        ...(school.url && { url: school.url }),
      }));
    }

    if (data.knowsAbout && data.knowsAbout.length > 0) {
      schema.knowsAbout = data.knowsAbout;
    }

    if (data.awards && data.awards.length > 0) {
      schema.award = data.awards;
    }

    return schema;
  };

  const generatePersonEntity = (data: PersonSchema) => {
    const schema: any = {
      '@type': 'Person',
      name: data.name,
    };

    if (data.jobTitle) schema.jobTitle = data.jobTitle;
    if (data.url) schema.url = data.url;
    if (data.image) schema.image = data.image;
    if (data.description) schema.description = data.description;
    if (data.email) schema.email = `mailto:${data.email}`;
    if (data.telephone) schema.telephone = data.telephone;
    if (data.knowsAbout && data.knowsAbout.length > 0) {
      schema.knowsAbout = data.knowsAbout;
    }
    if (data.awards && data.awards.length > 0) {
      schema.award = data.awards;
    }
    if (data.sameAs && data.sameAs.length > 0) {
      schema.sameAs = data.sameAs;
    }

    if (data.address) {
      schema.address = {
        '@type': 'PostalAddress',
        ...data.address,
      };
    }

    if (data.alumniOf && data.alumniOf.length > 0) {
      schema.alumniOf = data.alumniOf.map((school) => ({
        '@type': 'EducationalOrganization',
        name: school.name,
        ...(school.url && { url: school.url }),
      }));
    }

    return schema;
  };

  const generateOrganizationSchema = (data: OrganizationSchema) => {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
    };

    if (data.url) schema.url = data.url;
    if (data.logo) schema.logo = data.logo;
    if (data.description) schema.description = data.description;
    if (data.email) schema.email = `mailto:${data.email}`;
    if (data.foundingDate) schema.foundingDate = data.foundingDate;

    if (data.founder) {
      schema.founder = {
        '@type': 'Person',
        name: data.founder.name,
        ...(data.founder.url && { url: data.founder.url }),
      };
    }

    if (data.address) {
      schema.address = {
        '@type': 'PostalAddress',
        ...data.address,
      };
    }

    if (data.sameAs && data.sameAs.length > 0) {
      schema.sameAs = data.sameAs;
    }

    return schema;
  };

  const generateCreativeWorkSchema = (data: CreativeWorkSchema) => {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: data.name,
    };

    if (data.description) schema.description = data.description;
    if (data.image) schema.image = data.image;
    if (data.url) schema.url = data.url;
    if (data.dateCreated) schema.dateCreated = data.dateCreated;
    if (data.datePublished) schema.datePublished = data.datePublished;
    if (data.dateModified) schema.dateModified = data.dateModified;
    if (data.genre) schema.genre = data.genre;
    if (data.about) schema.about = data.about;
    if (data.mainEntityOfPage) schema.mainEntityOfPage = data.mainEntityOfPage;

    if (data.creator) {
      schema.creator = {
        '@type': 'Person',
        name: data.creator.name,
        ...(data.creator.url && { url: data.creator.url }),
      };
    }

    if (data.locationCreated) {
      schema.locationCreated = {
        '@type': 'Place',
        name: data.locationCreated.name,
        ...(data.locationCreated.address && {
          address: {
            '@type': 'PostalAddress',
            ...data.locationCreated.address,
          },
        }),
      };
    }

    if (data.keywords && data.keywords.length > 0) {
      schema.keywords = data.keywords.join(', ');
    }

    if (data.workExample && data.workExample.length > 0) {
      schema.workExample = data.workExample.map(work => ({
        '@type': work.type,
        contentUrl: work.contentUrl,
        ...(work.caption && { caption: work.caption }),
        ...(work.name && { name: work.name }),
        ...(work.description && { description: work.description }),
        ...(work.thumbnailUrl && { thumbnailUrl: work.thumbnailUrl }),
        ...(work.encodingFormat && { encodingFormat: work.encodingFormat }),
        ...(work.width && { width: work.width }),
        ...(work.height && { height: work.height }),
      }));
    }

    if (data.contributor && data.contributor.length > 0) {
      schema.contributor = data.contributor.map(person => ({
        '@type': person.type,
        name: person.name,
        ...(person.roleName && { roleName: person.roleName }),
      }));
    }

    return schema;
  };

  const schemas = [];

  if ((type === 'Person' || type === 'Both') && person) {
    schemas.push(generatePersonSchema(person));
  }

  if ((type === 'Organization' || type === 'Both') && organization) {
    schemas.push(generateOrganizationSchema(organization));
  }

  if (type === 'CreativeWork' && creativeWork) {
    schemas.push(generateCreativeWorkSchema(creativeWork));
  }

  if (type === 'BreadcrumbList' && breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  if ((type === 'Article' || type === 'NewsArticle') && article) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': type,
      headline: article.headline,
      author: {
        '@type': 'Person',
        name: article.author.name,
        ...(article.author.url && { url: article.author.url }),
      },
      datePublished: article.datePublished,
      publisher: {
        '@type': 'Organization',
        name: article.publisher.name,
        ...(article.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: article.publisher.logo,
          },
        }),
      },
      url: article.url,
    };

    if (article.description) schema.description = article.description;
    if (article.image) schema.image = article.image;
    if (article.dateModified) schema.dateModified = article.dateModified;
    if (article.articleBody) schema.articleBody = article.articleBody;
    if (article.wordCount) schema.wordCount = article.wordCount;
    if (article.keywords && article.keywords.length > 0) {
      schema.keywords = article.keywords.join(', ');
    }

    schemas.push(schema);
  }

  if (type === 'VideoObject' && videoObject) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: videoObject.name,
      thumbnailUrl: videoObject.thumbnailUrl,
      uploadDate: videoObject.uploadDate,
    };

    if (videoObject.description) schema.description = videoObject.description;
    if (videoObject.duration) schema.duration = videoObject.duration;
    if (videoObject.contentUrl) schema.contentUrl = videoObject.contentUrl;
    if (videoObject.embedUrl) schema.embedUrl = videoObject.embedUrl;
    if (videoObject.publisher) {
      schema.publisher = {
        '@type': 'Organization',
        name: videoObject.publisher.name,
        ...(videoObject.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: videoObject.publisher.logo,
          },
        }),
      };
    }

    schemas.push(schema);
  }

  if (type === 'FAQPage' && faqPage) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqPage.mainEntity.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    });
  }

  if (type === 'HowTo' && howTo) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howTo.name,
      step: howTo.step.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        ...(s.text && { text: s.text }),
        ...(s.url && { url: s.url }),
        ...(s.image && { image: s.image })
      }))
    };

    if (howTo.description) schema.description = howTo.description;
    if (howTo.image) schema.image = howTo.image;
    if (howTo.totalTime) schema.totalTime = howTo.totalTime;
    if (howTo.estimatedCost) schema.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: howTo.estimatedCost.currency,
      value: howTo.estimatedCost.value
    };
    if (howTo.supply && howTo.supply.length > 0) {
      schema.supply = howTo.supply.map(s => ({
        '@type': 'HowToSupply',
        name: s.name,
        ...(s.url && { url: s.url })
      }));
    }
    if (howTo.tool && howTo.tool.length > 0) {
      schema.tool = howTo.tool.map(t => ({
        '@type': 'HowToTool',
        name: t.name,
        ...(t.url && { url: t.url })
      }));
    }

    schemas.push(schema);
  }

  if (type === 'Event' && event) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      startDate: event.startDate,
    };

    if (event.description) schema.description = event.description;
    if (event.endDate) schema.endDate = event.endDate;
    if (event.image) schema.image = event.image;
    if (event.url) schema.url = event.url;
    if (event.eventStatus) schema.eventStatus = `https://schema.org/${event.eventStatus}`;
    if (event.eventAttendanceMode) schema.eventAttendanceMode = `https://schema.org/${event.eventAttendanceMode}`;

    if (event.location) {
      schema.location = {
        '@type': 'Place',
        name: event.location.name,
      };
      if (event.location.address) {
        schema.location.address = {
          '@type': 'PostalAddress',
          ...event.location.address,
        };
      }
    }

    if (event.performer) {
      schema.performer = {
        '@type': 'Person',
        name: event.performer.name,
        ...(event.performer.jobTitle && { jobTitle: event.performer.jobTitle }),
        ...(event.performer.url && { url: event.performer.url }),
      };
    }

    schemas.push(schema);
  }

  if (type === 'SoftwareApplication' && softwareApplication) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: softwareApplication.name,
      applicationCategory: softwareApplication.applicationCategory,
      operatingSystem: softwareApplication.operatingSystem,
    };

    if (softwareApplication.description) schema.description = softwareApplication.description;
    if (softwareApplication.image) schema.image = softwareApplication.image;
    if (softwareApplication.url) schema.url = softwareApplication.url;
    if (softwareApplication.softwareVersion) schema.softwareVersion = softwareApplication.softwareVersion;

    if (softwareApplication.offers) {
      schema.offers = {
        '@type': 'Offer',
        price: softwareApplication.offers.price,
        priceCurrency: softwareApplication.offers.priceCurrency,
      };
    }

    if (softwareApplication.aggregateRating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: softwareApplication.aggregateRating.ratingValue,
        ratingCount: softwareApplication.aggregateRating.ratingCount,
      };
    }

    schemas.push(schema);
  }

  if (type === 'WebSite' && webSite) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: webSite.name,
      url: webSite.url,
    };

    if (webSite.description) schema.description = webSite.description;
    if (webSite.inLanguage) schema.inLanguage = webSite.inLanguage;
    if (webSite.publisher) {
      schema.publisher = {
        '@type': 'Organization',
        name: webSite.publisher.name,
        ...(webSite.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: webSite.publisher.logo,
          },
        }),
      };
    }

    schemas.push(schema);
  }

  if (type === 'ProfilePage' && profilePage) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: profilePage.url,
      name: profilePage.name,
      mainEntity: generatePersonEntity(profilePage.mainEntity),
    };

    if (profilePage.description) schema.description = profilePage.description;
    if (profilePage.dateModified) schema.dateModified = profilePage.dateModified;
    if (profilePage.primaryImageOfPage) schema.primaryImageOfPage = profilePage.primaryImageOfPage;

    schemas.push(schema);
  }

  if (type === 'ItemList' && itemList) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: itemList.name,
      itemListElement: itemList.itemListElement.map((item, index) => ({
        '@type': 'ListItem',
        position: item.position || index + 1,
        url: item.url,
        name: item.name,
        ...(item.datePublished && { datePublished: item.datePublished }),
        ...(item.image && { image: item.image }),
      })),
    };

    if (itemList.description) schema.description = itemList.description;
    if (itemList.url) schema.url = itemList.url;

    schemas.push(schema);
  }

  if (type === 'CollectionPage' && collectionPage) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collectionPage.name,
      url: collectionPage.url,
    };

    if (collectionPage.description) schema.description = collectionPage.description;
    if (collectionPage.about) schema.about = collectionPage.about;
    if (collectionPage.primaryImageOfPage) schema.primaryImageOfPage = collectionPage.primaryImageOfPage;
    if (collectionPage.mainEntity) {
      schema.mainEntity = {
        '@type': 'ItemList',
        name: collectionPage.mainEntity.name,
        itemListElement: collectionPage.mainEntity.itemListElement.map((item, index) => ({
          '@type': 'ListItem',
          position: item.position || index + 1,
          url: item.url,
          name: item.name,
          ...(item.datePublished && { datePublished: item.datePublished }),
          ...(item.image && { image: item.image }),
        })),
      };
    }

    schemas.push(schema);
  }

  if (type === 'EducationalOrganization' && educationalOrganization) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: educationalOrganization.name,
    };

    if (educationalOrganization.url) schema.url = educationalOrganization.url;
    if (educationalOrganization.logo) schema.logo = educationalOrganization.logo;
    if (educationalOrganization.description) schema.description = educationalOrganization.description;
    if (educationalOrganization.sameAs && educationalOrganization.sameAs.length > 0) schema.sameAs = educationalOrganization.sameAs;
    if (educationalOrganization.address) {
      schema.address = {
        '@type': 'PostalAddress',
        ...educationalOrganization.address,
      };
    }

    schemas.push(schema);
  }

  if (type === 'Course' && course) {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      provider: {
        '@type': course.provider.type || 'EducationalOrganization',
        name: course.provider.name,
        ...(course.provider.url && { url: course.provider.url }),
      },
    };

    if (course.description) schema.description = course.description;
    if (course.url) schema.url = course.url;
    if (course.courseCode) schema.courseCode = course.courseCode;
    if (course.educationalCredentialAwarded) schema.educationalCredentialAwarded = course.educationalCredentialAwarded;
    if (course.teaches && course.teaches.length > 0) schema.teaches = course.teaches;
    if (course.inLanguage) schema.inLanguage = course.inLanguage;
    if (course.keywords && course.keywords.length > 0) schema.keywords = course.keywords.join(', ');

    schemas.push(schema);
  }

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema, null, 2)}
        </script>
      ))}
    </Helmet>
  );
}
