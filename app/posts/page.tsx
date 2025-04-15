import Layout from '@/components/layout/layout';
import client from '@/tina/__generated__/client';
import PostsClientPage from './client-page';
import { notFound } from 'next/navigation';
import { Metadata } from "next";

export const revalidate = 300;

const ITEMS_PER_PAGE = 9;

export const dynamic = 'force-dynamic';



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

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const requestedPage = Number(searchParams.page) || 1;
  const currentPage = Math.max(1, requestedPage);

  try {
    const currentDate = new Date().toISOString();

    // Fetch total counts and current page data in parallel for better performance
    const [totalPostsQuery, postsForCurrentPage] = await Promise.all([
      // Query for counts only - minimal data needed
      client.queries.postConnection({
        filter: { date: { before: currentDate } },
      }),
      
      // Get posts for the current page
      fetchPagedPosts(currentPage, ITEMS_PER_PAGE)
    ]);
    
    const totalItems = totalPostsQuery.data.postConnection.totalCount;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
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
          itemsPerPage: ITEMS_PER_PAGE
        }
      }
    };
    
    return (
      <Layout rawPageData={totalPostsQuery.data}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Top gambling and casino news</h1>
          <PostsClientPage {...enhancedPosts} />
        </div>
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    if (error instanceof Error && 
        (error.message.includes("Unable to find record") || 
         error.message.includes("404"))) {
      notFound();
    }
    
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Top gambling and casino news</h1>
          <p className="text-red-500">Error loading posts. Please try again later.</p>
        </div>
      </Layout>
    );
  }
}

// Helper function to fetch posts for a specific page
async function fetchPagedPosts(page: number, itemsPerPage: number) {
  const currentDate = new Date().toISOString();
  const cursor = page > 1 
    ? await getCursorForPage(page - 1, itemsPerPage) 
    : undefined;

  return client.queries.postConnection({
    first: itemsPerPage,
    filter: {
      date: { before: currentDate }
    },
    after: cursor,
  });
}

// Get cursor for pagination
async function getCursorForPage(
  page: number, 
  itemsPerPage: number
): Promise<string | undefined> {
  if (page < 1) return undefined;
  
  try {
    const currentDate = new Date().toISOString();
    const response = await client.queries.postConnection({
      first: itemsPerPage * page,
      filter: {
        date: { before: currentDate }
      },
    });

    const edges = response.data.postConnection.edges;
    return edges?.length ? edges[edges.length - 1]?.cursor : undefined;
  } catch (error) {
    console.error("Error getting cursor for pagination:", error);
    return undefined;
  }
}
