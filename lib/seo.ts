import { Metadata } from 'next'
import { PublicUser } from '@/types'

// Base SEO configuration
export const baseSEO = {
  title: 'CVChatter - AI-Powered Professional Profiles & Talent Discovery',
  description: 'Discover top talent with AI-powered professional profiles. Connect with skilled professionals, explore interactive profiles, and find the perfect match for your team.',
  keywords: [
    'professional profiles',
    'talent discovery',
    'AI profiles',
    'recruitment',
    'hiring',
    'job search',
    'career networking',
    'professional networking',
    'resume builder',
    'CV builder',
    'talent acquisition',
    'human resources',
    'employment',
    'career development',
    'professional development'
  ],
  authors: [{ name: 'CVChatter Team' }],
  creator: 'CVChatter',
  publisher: 'CVChatter',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com',
    siteName: 'CVChatter',
    title: 'CVChatter - AI-Powered Professional Profiles & Talent Discovery',
    description: 'Discover top talent with AI-powered professional profiles. Connect with skilled professionals, explore interactive profiles, and find the perfect match for your team.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CVChatter - AI-Powered Professional Profiles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVChatter - AI-Powered Professional Profiles & Talent Discovery',
    description: 'Discover top talent with AI-powered professional profiles. Connect with skilled professionals, explore interactive profiles, and find the perfect match for your team.',
    images: ['/images/og-image.png'],
    creator: '@cvchatter',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
}

// Generate metadata for profile pages
export function generateProfileMetadata(user: PublicUser): Metadata {
  const fullName = user.name || 'Professional'
  const title = `${fullName} - Professional Profile | CVChatter`
  const description = user.summary 
    ? `${user.summary.substring(0, 150)}${user.summary.length > 150 ? '...' : ''}`
    : `View ${fullName}'s professional profile on CVChatter. Discover their skills, experience, and connect with this talented professional.`
  
  const skills = user.skills?.map(skill => skill.name).join(', ') || ''
  const location = user.location || ''
  
  const keywords = [
    fullName,
    'professional profile',
    'resume',
    'CV',
    'talent',
    'skills',
    'experience',
    'career',
    'employment',
    'hiring',
    'recruitment',
    ...(skills ? skills.split(', ') : []),
    ...(location ? [location] : [])
  ].filter(Boolean)

  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'}/profile/${user.username}`
  const profileImage = user.profile_picture || '/images/default-profile.png'

  return {
    title,
    description,
    keywords,
    authors: [{ name: fullName }],
    creator: fullName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'profile',
      locale: 'en_US',
      url: profileUrl,
      siteName: 'CVChatter',
      title,
      description,
      images: [
        {
          url: profileImage,
          width: 400,
          height: 400,
          alt: `${fullName} - Professional Profile`,
        },
        {
          url: '/images/og-profile-banner.png',
          width: 1200,
          height: 630,
          alt: `${fullName} - Professional Profile on CVChatter`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [profileImage],
      creator: '@cvchatter',
    },
    alternates: {
      canonical: profileUrl,
    },
    other: {
      'profile:first_name': user.name?.split(' ')[0] || '',
      'profile:last_name': user.name?.split(' ').slice(1).join(' ') || '',
      'profile:username': user.username || '',
    },
  }
}

// Generate structured data for profiles
export function generateProfileStructuredData(user: PublicUser) {
  const fullName = user.name || 'Professional'
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'}/profile/${user.username}`
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    url: profileUrl,
    image: user.profile_picture || '/images/default-profile.png',
    description: user.summary || `Professional profile of ${fullName}`,
    jobTitle: user.designation || 'Professional',
    worksFor: {
      '@type': 'Organization',
      name: user.profession || 'Freelance',
    },
    address: user.location ? {
      '@type': 'PostalAddress',
      addressLocality: user.location,
    } : undefined,
    email: user.email,
    telephone: user.contact_info?.phone,
    sameAs: [
      ...(user.contact_info?.linkedin ? [user.contact_info.linkedin] : []),
      ...(user.contact_info?.github ? [user.contact_info.github] : []),
      ...(user.contact_info?.portfolio ? [user.contact_info.portfolio] : []),
    ].filter(Boolean),
    knowsAbout: user.skills?.map(skill => skill.name) || [],
    hasOccupation: {
      '@type': 'Occupation',
      name: user.designation || 'Professional',
      description: user.summary || `Professional in ${user.skills?.[0]?.name || 'technology'}`,
    },
    alumniOf: user.education?.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
      description: `${edu.degree} in ${edu.field_of_study}`,
    })) || [],
    memberOf: user.experience_details?.map(exp => ({
      '@type': 'Organization',
      name: exp.company,
      description: exp.position,
    })) || [],
  }

  return structuredData
}

// Generate metadata for different page types
export function generatePageMetadata(
  pageType: 'home' | 'explore' | 'ai-writer' | 'auth' | 'onboarding' | 'admin',
  additionalData?: any
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'
  
  const pageConfigs = {
    home: {
      title: 'CVChatter - AI-Powered Professional Profiles & Talent Discovery',
      description: 'Discover top talent with AI-powered professional profiles. Connect with skilled professionals, explore interactive profiles, and find the perfect match for your team.',
      url: baseUrl,
      keywords: ['talent discovery', 'professional profiles', 'AI recruitment', 'hiring platform', 'career networking'],
    },
    explore: {
      title: 'Explore Talent - Discover Top Professionals | CVChatter',
      description: 'Browse and discover talented professionals across various industries. Find the perfect candidate for your team or connect with like-minded professionals.',
      url: `${baseUrl}/explore`,
      keywords: ['explore talent', 'find professionals', 'browse profiles', 'talent search', 'professional discovery'],
    },
    'ai-writer': {
      title: 'AI Writer - Generate Professional Content | CVChatter',
      description: 'Create compelling cover letters, proposals, and professional content with our AI-powered writing assistant. Save time and improve your applications.',
      url: `${baseUrl}/ai-writer`,
      keywords: ['AI writer', 'cover letter generator', 'proposal writer', 'AI content', 'professional writing'],
    },
    auth: {
      title: 'Sign In - Join CVChatter | Professional Networking Platform',
      description: 'Join CVChatter to create your AI-powered professional profile and connect with top talent. Start building your professional network today.',
      url: `${baseUrl}/auth`,
      keywords: ['sign up', 'join', 'professional networking', 'create profile', 'career platform'],
    },
    onboarding: {
      title: 'Complete Your Profile - CVChatter',
      description: 'Complete your professional profile setup to start connecting with opportunities and showcasing your skills to potential employers.',
      url: `${baseUrl}/onboarding`,
      keywords: ['complete profile', 'profile setup', 'onboarding', 'professional profile'],
    },
    admin: {
      title: 'Admin Dashboard - CVChatter',
      description: 'Administrative dashboard for managing CVChatter platform.',
      url: `${baseUrl}/admin`,
      robots: {
        index: false,
        follow: false,
      },
    },
  }

  const config = pageConfigs[pageType]
  
  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    openGraph: {
      ...baseSEO.openGraph,
      url: config.url,
      title: config.title,
      description: config.description,
    },
    twitter: {
      ...baseSEO.twitter,
      title: config.title,
      description: config.description,
    },
    alternates: {
      canonical: config.url,
    },
  }

  // Add keywords if they exist
  if ('keywords' in config) {
    metadata.keywords = config.keywords
  }

  // Add robots if they exist
  if ('robots' in config) {
    metadata.robots = config.robots
  } else {
    metadata.robots = baseSEO.robots
  }

  return metadata
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CVChatter',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'}/logo_updated.png`,
    description: 'AI-powered professional profiles and talent discovery platform',
    sameAs: [
      'https://twitter.com/cvchatter',
      'https://linkedin.com/company/cvchatter',
      'https://github.com/cvchatter',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@cvchatter.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  }
}

// Generate website structured data
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CVChatter',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com',
    description: 'AI-powered professional profiles and talent discovery platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
