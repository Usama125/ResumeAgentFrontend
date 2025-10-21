import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateProfileMetadata, generateProfileStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo'
import { PublicUser } from '@/types'

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ username: string }>
}

async function getUserData(username: string): Promise<PublicUser | null> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const user = await getUserData(username)
  
  if (!user) {
    return {
      title: 'Profile Not Found | CVChatter',
      description: 'The requested profile could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return generateProfileMetadata(user)
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { username } = await params
  const user = await getUserData(username)
  
  if (!user) {
    notFound()
  }

  const structuredData = generateProfileStructuredData(user)
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com' },
    { name: 'Explore', url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'}/explore` },
    { name: user.name, url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'}/profile/${username}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      {children}
    </>
  )
}
