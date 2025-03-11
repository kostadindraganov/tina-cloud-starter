import { MetadataRoute } from 'next'
import client from '@/tina/__generated__/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com'
  const currentDate = new Date()
  
  // Fetch all posts
  let postsResult = await client.queries.postConnection()
  const allPosts = postsResult.data.postConnection.edges || []
  
  while (postsResult.data?.postConnection.pageInfo.hasNextPage) {
    postsResult = await client.queries.postConnection({
      after: postsResult.data.postConnection.pageInfo.endCursor,
    })
    if (postsResult.data?.postConnection.edges) {
      allPosts.push(...postsResult.data.postConnection.edges)
    }
  }
  
  // Fetch all pages
  let pagesResult = await client.queries.pageConnection()
  const allPages = pagesResult.data.pageConnection.edges || []
  
  while (pagesResult.data?.pageConnection.pageInfo.hasNextPage) {
    pagesResult = await client.queries.pageConnection({
      after: pagesResult.data.pageConnection.pageInfo.endCursor,
    })
    if (pagesResult.data?.pageConnection.edges) {
      allPages.push(...pagesResult.data.pageConnection.edges)
    }
  }
  
  // Create sitemap entries for posts
  const postEntries = allPosts.map((post) => {
    if (!post?.node) return null
    const breadcrumbs = post.node._sys.breadcrumbs || []
    const path = `/posts/${breadcrumbs.join('/')}`
    
    // Use post date if available, otherwise use current date
    const lastModDate = post.node.date ? new Date(post.node.date) : currentDate
    
    return {
      url: `${baseUrl}${path}`,
      lastModified: lastModDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  }).filter(Boolean) as MetadataRoute.Sitemap
  
  // Create sitemap entries for pages
  const pageEntries = allPages.map((page) => {
    if (!page?.node) return null
    const breadcrumbs = page.node._sys.breadcrumbs || []
    const path = `/${breadcrumbs.join('/')}`
    return {
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  }).filter(Boolean) as MetadataRoute.Sitemap
  
  // Add home page
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }
  ]
  
  return [...staticPaths, ...postEntries, ...pageEntries]
} 