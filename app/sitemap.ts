import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvchatter.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-writer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Dynamic profile pages
  let profilePages: MetadataRoute.Sitemap = []
  
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    
    // Fetch all public profiles
    const response = await fetch(`${API_BASE_URL}/users/public`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (response.ok) {
      const users = await response.json()
      
      profilePages = users.map((user: any) => ({
        url: `${baseUrl}/profile/${user.username}`,
        lastModified: new Date(user.updated_at || user.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching profiles for sitemap:', error)
    // Continue with static pages only if API fails
  }

  return [...staticPages, ...profilePages]
}
