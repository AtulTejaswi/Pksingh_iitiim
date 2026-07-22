import { SITE_CONFIG } from '@/lib/seo';

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/courses?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function PersonJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'PK Singh',
    givenName: 'PK',
    familyName: 'Singh',
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    url: SITE_CONFIG.url,
    jobTitle: 'Mentor, Author & Educator',
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'PK Singh Academy',
    },
    sameAs: [
      SITE_CONFIG.url,
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function EducationalOrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'PK Singh Academy',
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    description: 'Premium mentorship for JEE, NEET, SAT, CAT and GMAT aspirants by IIT + IIM alumnus PK Singh.',
    founder: {
      '@type': 'Person',
      name: 'PK Singh',
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Course Catalog',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Physics Courses' },
        { '@type': 'OfferCatalog', name: 'Chemistry Courses' },
        { '@type': 'OfferCatalog', name: 'Mathematics Courses' },
      ],
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function CourseJsonLd({
  title,
  description,
  courseId,
  subject,
  examTags,
}: {
  title: string;
  description: string;
  courseId: string;
  subject: string;
  examTags: string[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url: `${SITE_CONFIG.url}/courses/${courseId}`,
    provider: {
      '@type': 'Person',
      name: 'PK Singh',
    },
    educationalLevel: examTags.includes('JEE_ADVANCED') ? 'Advanced' : 'Intermediate',
    courseCode: courseId,
    teaches: subject,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      instructor: {
        '@type': 'Person',
        name: 'PK Singh',
      },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
