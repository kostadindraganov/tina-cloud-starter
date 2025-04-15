import type { Metadata } from "next";

/**
 * Content types supported by the metadata generator
 */
export type ContentType = 'casino' | 'sweepstakes' | 'post' | 'bonuses';

/**
 * Default SEO values for different content types
 */
const DEFAULT_SEO_VALUES = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com',
  
  // Common defaults
  common: {
    title: "GambleMentor Network",
    description: "Discover top-rated crypto and sweepstakes casinos with expert reviews and exclusive bonuses.",
    tags: [
      "crypto casinos", 
      "sweepstakes casinos", 
      "online gambling", 
      "bitcoin casinos", 
      "casino bonuses"
    ],
    ogImagePath: "/images/og-image.jpg",
    twitterImagePath: "/images/twitter-image.jpg"
  },
  
  // Content type specific defaults
  casino: {
    title: "Casino Review",
    description: "Online casino review and rating",
    suffix: "Casino"
  },
  
  sweepstakes: {
    title: "Sweepstakes Casino Review",
    description: "Online sweepstakes casino review and rating",
    suffix: "Sweepstakes"
  },
  
  post: {
    title: "Blog Post",
    description: "Latest gambling news and guides",
    suffix: "Article"
  },
  
  bonuses: {
    title: "Casino Bonus",
    description: "Exclusive casino bonus offers and promotions",
    suffix: "Bonus"
  }
};

/**
 * Content data interface - covers the common properties across different content types
 */
interface ContentData {
  title?: string;
  excerpt?: unknown;
  tags?: (string | null)[] | null;
  heroImg?: string | null | undefined;
  [key: string]: unknown;
}

/**
 * Content metadata parameters
 */
interface ContentMetadataParams {
  data: ContentData;
  type: ContentType;
  path: string; // URL path segment after the domain (e.g., "/casino/bitcoin-casino")
}

/**
 * Extracts plain text content from TinaCMS rich text objects
 * @param richText - The rich text object or string to parse
 * @returns Extracted plain text as string
 */
export function extractTextFromRichText(richText: unknown): string {
  if (!richText) return '';
  
  // Early return for simple string values
  if (typeof richText === 'string') return richText;
  
  try {
    // Handle any rich text structure from TinaCMS
    const richTextObj = typeof richText === 'string' 
      ? JSON.parse(richText) 
      : richText as Record<string, unknown>;
    
    let extractedText = '';
    
    // Recursive function to extract text from nodes
    const processNode = (node: any): void => {
      // Extract text content from text nodes
      if (node.text) {
        extractedText += `${node.text} `;
      }
      
      // Process child nodes recursively if they exist
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(processNode);
      }
    };
    
    // Process the root node and its children
    if (richTextObj.children && Array.isArray(richTextObj.children)) {
      richTextObj.children.forEach(processNode);
    }
    
    return extractedText.trim();
  } catch (error) {
    console.warn('[extractTextFromRichText] Error parsing rich text:', error);
    // Return empty string as fallback
    return '';
  }
}

/**
 * Generates metadata for content pages
 */
export function generateContentMetadata({
  data,
  type,
  path
}: ContentMetadataParams): Metadata {
  const { baseUrl, common } = DEFAULT_SEO_VALUES;
  const typeDefaults = DEFAULT_SEO_VALUES[type];
  
  // Process the content description from excerpt
  const contentDescription = data.excerpt 
    ? extractTextFromRichText(data.excerpt)
    : typeDefaults.description;

  // Filter out null values from tags with proper null checking
  const contentTags = data.tags 
    ? data.tags.filter(Boolean) as string[] 
    : [...common.tags];
  
  // Full URL for canonical and OG
  const fullUrl = `${baseUrl}${path}`;
  
  // Content title with fallback
  const contentTitle = data.title || typeDefaults.title;
  
  // Set up image URLs for OpenGraph and Twitter
  let ogImageUrl = `${baseUrl}${common.ogImagePath}`;
  let twitterImageUrl = `${baseUrl}${common.twitterImagePath}`;
  
  // For posts, use heroImg if available
  if (type === 'post' && data.heroImg) {
    ogImageUrl = data.heroImg;
    twitterImageUrl = data.heroImg;
  }
  
  return {
    title: contentTitle,
    description: contentDescription || typeDefaults.description,
    keywords: contentTags,
    openGraph: {
      title: contentTitle,
      description: contentDescription || typeDefaults.description,
      type: 'article',
      url: fullUrl,
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: contentTitle,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: contentTitle,
      description: contentDescription || typeDefaults.description,
      images: [twitterImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    }
  };
}

/**
 * Generates fallback metadata when content data is not available or an error occurs
 */
export function generateFallbackMetadata(type: ContentType): Metadata {
  const { common } = DEFAULT_SEO_VALUES;
  const typeDefaults = DEFAULT_SEO_VALUES[type];
  
  return {
    title: typeDefaults.title,
    description: typeDefaults.description,
    keywords: [...common.tags],
  };
}