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
  
  // Create separate sitemap entries for each content type
  const staticPaths: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/casino`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sweepstakes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bonuses`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    }
  ]
  
  const postsEntries: MetadataRoute.Sitemap = []
  const casinoEntries: MetadataRoute.Sitemap = []
  const sweepstakesEntries: MetadataRoute.Sitemap = []
  const bonusesEntries: MetadataRoute.Sitemap = []
  const pageEntries: MetadataRoute.Sitemap = []
  
  // Directly create individual casino entries if they exist
  // This is a simplified example - adjust according to your data structure
  try {
    const casinoResult = await client.queries.casinoConnection?.()
    if (casinoResult?.data?.casinoConnection?.edges) {
      casinoResult.data.casinoConnection.edges.forEach(casino => {
        if (casino?.node) {
          casinoEntries.push({
            url: `${baseUrl}/casino/${casino.node._sys.filename}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      })
    }
  } catch (error) {
    // If casinoConnection doesn't exist, continue without it
    console.log('Casino query not available, skipping...')
  }
  
  // Directly create individual sweepstakes entries if they exist
  try {
    const sweepstakesResult = await client.queries.sweepstakesConnection?.()
    if (sweepstakesResult?.data?.sweepstakesConnection?.edges) {
      sweepstakesResult.data.sweepstakesConnection.edges.forEach(sweepstake => {
        if (sweepstake?.node) {
          sweepstakesEntries.push({
            url: `${baseUrl}/sweepstakes/${sweepstake.node._sys.filename}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      })
    }
  } catch (error) {
    // If sweepstakesConnection doesn't exist, continue without it
    console.log('Sweepstakes query not available, skipping...')
  }
  
  // Directly create individual bonuses entries if they exist
  try {
    const bonusesResult = await client.queries.bonusesConnection?.()
    if (bonusesResult?.data?.bonusesConnection?.edges) {
      bonusesResult.data.bonusesConnection.edges.forEach(bonus => {
        if (bonus?.node) {
          bonusesEntries.push({
            url: `${baseUrl}/bonuses/${bonus.node._sys.filename}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      })
    }
  } catch (error) {
    // If bonusesConnection doesn't exist, continue without it
    console.log('Bonuses query not available, skipping...')
  }
  
  // Process all posts for categorization based on path and content
  allPosts.forEach(post => {
    if (!post?.node) return
    
    const breadcrumbs = post.node._sys.breadcrumbs || []
    const path = `/posts/${breadcrumbs.join('/')}`
    const lastModDate = post.node.date ? new Date(post.node.date) : currentDate
    
    const entry = {
      url: `${baseUrl}${path}`,
      lastModified: lastModDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
    
    // Add to main posts list
    postsEntries.push(entry)
    
    // Also add to category-specific lists if relevant
    // This ensures content appears in both general posts and category-specific sections
    // Analyze post content/title for keywords if breadcrumbs/tags aren't available
    const postTitle = (post.node.title || '').toLowerCase()
    const postContent = (post.node._body ? (post.node._body.toString() || '') : '').toLowerCase()
    
    const hasCasinoContent = 
      breadcrumbs.some(b => b.includes('casino')) || 
      (post.node.tags && post.node.tags.includes('casino')) ||
      postTitle.includes('casino') ||
      postContent.includes('casino')
    
    const hasSweepstakesContent = 
      breadcrumbs.some(b => b.includes('sweepstakes')) || 
      (post.node.tags && post.node.tags.includes('sweepstakes')) ||
      postTitle.includes('sweepstakes') ||
      postContent.includes('sweepstakes')
    
    const hasBonusContent = 
      breadcrumbs.some(b => b.includes('bonus')) || 
      (post.node.tags && post.node.tags.includes('bonus')) ||
      postTitle.includes('bonus') ||
      postContent.includes('bonus')
    
    if (hasCasinoContent) {
      casinoEntries.push(entry)
    }
    
    if (hasSweepstakesContent) {
      sweepstakesEntries.push(entry)
    }
    
    if (hasBonusContent) {
      bonusesEntries.push(entry)
    }
  })
  
  // Process all pages
  allPages.forEach(page => {
    if (!page?.node) return
    
    const breadcrumbs = page.node._sys.breadcrumbs || []
    const path = `/${breadcrumbs.join('/')}`
    
    const entry = {
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
    
    // Add to appropriate category based on path
    if (path.includes('/casino/') || breadcrumbs.some(b => b.includes('casino'))) {
      casinoEntries.push(entry)
    } else if (path.includes('/sweepstakes/') || breadcrumbs.some(b => b.includes('sweepstakes'))) {
      sweepstakesEntries.push(entry)
    } else if (path.includes('/bonuses/') || breadcrumbs.some(b => b.includes('bonus'))) {
      bonusesEntries.push(entry)
    } else {
      // Only add to page entries if not already categorized
      pageEntries.push(entry)
    }
  })
  
  // Combine all entries, ensuring each category appears in the sitemap
  return [
    ...staticPaths,
    ...pageEntries,
    ...postsEntries,
    ...casinoEntries,
    ...sweepstakesEntries,
    ...bonusesEntries
  ]
} 