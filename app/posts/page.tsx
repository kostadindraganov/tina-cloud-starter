import Layout from '@/components/layout/layout';
import client from '@/tina/__generated__/client';
import PostsClientPage from './client-page';
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import { Suspense } from 'react';
import PostsGridSkeleton from '@/components/posts/post-skeleton';
import { 
  WebsiteSchema, 
  OrganizationSchema, 
  BlogSchema, 
  BreadcrumbSchema 
} from '@/components/structured-data';

const POSTS_PAGE_SIZE = 12;

// Enable revalidation for improved performance
export const revalidate = 3600;

// export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Casino News & Guides – GambleMentor Network",
    template: "%s | GMBL",
  },
  description: "Stay informed with the latest news, tips, and strategies for crypto and sweepstakes gambling.",
  keywords: ["casino news", "gambling guides", "crypto casino tips", "sweepstakes strategies", "sweepstakes news", "sweepstakes bonuses", "GMBL", "Gamblementor"],
  authors: [{ name: "GMBL Team" }],
  creator: "GambleMentor Networks",
  publisher: "GambleMentor Networks",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: baseUrl,
    title: "Casino News & Guides – GambleMentor Network",
    description: "Stay informed with the latest news, tips, and strategies for crypto and sweepstakes gambling.",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Gamblementor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casino News & Guides – GambleMentor Network",
    description: "Stay informed with the latest news, tips, and strategies for crypto and sweepstakes gambling.",
    images: [`${baseUrl}/images/twitter-image.jpg`],
    creator: "@gamblementor",
  },

  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': `${baseUrl}/en-US`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Types for better type safety
interface PostQueryOptions {
  first?: number;
  after?: string;
  forCount?: boolean;
}

// SINGLE SOURCE OF TRUTH - One function for all post queries (DRY principle)
// async function fetchPosts(options: PostQueryOptions = {}) {
//   const { first = ITEMS_PER_PAGE, after, forCount = false } = options;
//   const currentDate = new Date().toISOString();

//   try {
//     const response = await client.queries.postConnection({
//       last: forCount ? 1000 : first, // Retrieve the latest posts
//       sort: 'date', // Sort by date field
//       ...(after && { before: after }) // Use 'before' for reverse pagination
//     });

//     return response;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     throw error;
//   }
// }

async function fetchPosts(options: PostQueryOptions = {}) {
  const { first = POSTS_PAGE_SIZE, after, forCount = false } = options;
  const currentDate = new Date().toISOString();

  try {
    const response = await client.queries.postConnection({
      last: forCount ? 1 : first,
      ...(after && { before: after }),
      sort: 'date',
      filter: {
        date: { before: currentDate },
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}


// Helper function to generate structured data from posts
function generateStructuredData(postsData: any, baseUrl: string) {
  const posts = postsData?.data?.postConnection?.edges || [];
  
  const blogPosts = posts.map((edge: any) => {
    const post = edge?.node;
    if (!post) return null;
    
    const breadcrumbs = post._sys?.breadcrumbs || [];
    const postUrl = `${baseUrl}/posts/${breadcrumbs.join("/")}`;
    
    return {
      headline: post.title || 'Untitled',
      url: postUrl,
      datePublished: post.date || new Date().toISOString(),
      dateModified: post.date || new Date().toISOString(),
      author: {
        name: post.author?.name || 'GMBL Team',
        url: post.author?.url
      },
      image: post.heroImg || post.thumbnail,
      description: post.excerpt || post.title
    };
  }).filter(Boolean);

  return { blogPosts };
}

// Get cursor for specific page using the single fetch function
async function getCursorForPage(page: number, itemsPerPage: number): Promise<string | undefined> {
  if (page < 1) return undefined;
  
  try {
    const response = await fetchPosts({ 
      first: itemsPerPage * page 
    });

    const edges = response.data.postConnection.edges;
    return edges?.length ? edges[edges.length - 1]?.cursor : undefined;
  } catch (error) {
    console.error("Error getting cursor for pagination:", error);
    return undefined;
  }
}

// Fetch posts for specific page using the single fetch function
async function fetchPagedPosts(page: number, itemsPerPage: number) {
  const cursor = page > 1 
    ? await getCursorForPage(page - 1, itemsPerPage) 
    : undefined;

  return fetchPosts({
    first: itemsPerPage,
    after: cursor,
  });
}

// Posts content component that handles data fetching
async function PostsContent({
  currentPage,
}: {
  currentPage: number;
}) {
  try {
    // Fetch total counts and current page data in parallel for better performance
    const [totalPostsQuery, postsForCurrentPage] = await Promise.all([
      // Query for counts only - using the single fetch function
      fetchPosts({ forCount: true }),
      
      // Get posts for the current page - using the single fetch function
      fetchPagedPosts(currentPage, POSTS_PAGE_SIZE)
    ]);
    
    const totalItems = totalPostsQuery.data.postConnection.totalCount;
    const totalPages = Math.max(1, Math.ceil(totalItems / POSTS_PAGE_SIZE));
    const validPage = Math.min(currentPage, totalPages);

    // Add pagination metadata to the posts data
    const enhancedPosts = {
      ...postsForCurrentPage,
      data: {
        ...postsForCurrentPage.data,
        _pagination: {
          currentPage: validPage,
          totalPages,
          totalItems,
          itemsPerPage: POSTS_PAGE_SIZE
        }
      }
    };

    // Generate structured data
    const { blogPosts } = generateStructuredData(enhancedPosts, baseUrl);
    
    return (
      <>
        {/* Structured Data */}
        <WebsiteSchema
          url={baseUrl}
          name="GambleMentor Network"
          description="Stay informed with the latest news, tips, and strategies for crypto and sweepstakes gambling."
          searchUrl={`${baseUrl}/search`}
        />
        
        <OrganizationSchema
          name="GambleMentor Networks"
          url={baseUrl}
          logo={`${baseUrl}/logo/logo.png`}
          description="Leading source for casino news, gambling guides, and crypto casino tips."
          socialMedia={[
            "https://twitter.com/gamblementor",
            "https://facebook.com/gamblementor"
          ]}
        />
        
        <BlogSchema
          name="Casino News & Guides – GambleMentor Network"
          description="Stay informed with the latest news, tips, and strategies for crypto and sweepstakes gambling."
          url={`${baseUrl}/posts`}
          posts={blogPosts}
          publisher={{
            name: "GambleMentor Networks",
            logo: `${baseUrl}/logo/logo.png`
          }}
        />
        
        <BreadcrumbSchema
          breadcrumbs={[
            { name: "Home", url: baseUrl, position: 1 },
            { name: "News", url: `${baseUrl}/posts`, position: 2 }
          ]}
        />
        
        {/* Posts Component */}
        <PostsClientPage {...enhancedPosts} />
      </>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    if (error instanceof Error && 
        (error.message.includes("Unable to find record") || 
         error.message.includes("404"))) {
      notFound();
    }
    
    return <p className="text-red-500">Error loading posts. Please try again later.</p>;
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const requestedPage = Number(searchParams.page) || 1;
  const currentPage = Math.max(1, requestedPage);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <h1 className="text-3xl font-bold mb-8">Top gambling and casino news</h1>
        <Suspense fallback={<PostsGridSkeleton />} >
          <PostsContent currentPage={currentPage} />
        </Suspense>
      </div>
    </Layout>
  );
}
