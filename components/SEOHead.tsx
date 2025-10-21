'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface SEOHeadProps {
  structuredData?: any
  breadcrumbData?: any
  organizationData?: any
  websiteData?: any
}

export default function SEOHead({ 
  structuredData, 
  breadcrumbData, 
  organizationData, 
  websiteData 
}: SEOHeadProps) {
  useEffect(() => {
    // Add Google Analytics if available
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      document.head.appendChild(script)

      const gtagScript = document.createElement('script')
      gtagScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
          page_title: document.title,
          page_location: window.location.href,
        });
      `
      document.head.appendChild(gtagScript)
    }
  }, [])

  return (
    <>
      {/* Structured Data Scripts */}
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      {breadcrumbData && (
        <Script
          id="breadcrumb-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
      )}
      
      {organizationData && (
        <Script
          id="organization-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
      )}
      
      {websiteData && (
        <Script
          id="website-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData),
          }}
        />
      )}

      {/* Google Search Console Verification */}
      {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#10a37f" />
      <meta name="msapplication-TileColor" content="#10a37f" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="CVChatter" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </>
  )
}
