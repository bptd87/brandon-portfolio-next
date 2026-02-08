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
  genre?: string;
  keywords?: string[];
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
  }>;
  about?: string;
  contributor?: Array<{
    type: 'Person';
    name: string;
    roleName?: string;
  }>;
}

interface StructuredDataProps {
  type: 'Person' | 'Organization' | 'Both' | 'CreativeWork';
  person?: PersonSchema;
  organization?: OrganizationSchema;
  creativeWork?: CreativeWorkSchema;
}

export default function StructuredData({ type, person, organization, creativeWork }: StructuredDataProps) {
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
    if (data.genre) schema.genre = data.genre;
    if (data.about) schema.about = data.about;
    
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
