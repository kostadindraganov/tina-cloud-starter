import Layout from '@/components/layout/layout';
import client from '@/tina/__generated__/client';
import PostsClientPage from './client-page';

export const revalidate = 300;

const ITEMS_PER_PAGE = 10;

export const dynamic = 'force-dynamic';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Ensure page is a positive number
  const requestedPage = Number(searchParams.page) || 1;
  const currentPage = requestedPage > 0 ? requestedPage : 1;

  try {
    // Get total post count for pagination
    const totalPostsQuery = await client.queries.postConnection({
      sort: "date",
      filter: {},
    });

    const totalItems = totalPostsQuery.data.postConnection.totalCount;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Validate requested page is in range
    const validPage = Math.min(currentPage, totalPages || 1);

    // Get cursor for pagination
    const cursor = validPage > 1
      ? await getCursorForPage(validPage - 1, ITEMS_PER_PAGE)
      : undefined;

    // Fetch posts for the current page
    const posts = await client.queries.postConnection({
      first: ITEMS_PER_PAGE,
      sort: "date",
      filter: {},
      after: cursor,
    });

    // Add pagination metadata to the posts data
    const enhancedPosts = {
      ...posts,
      data: {
        ...posts.data,
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
          <h1 className="text-3xl font-bold mb-8">Posts</h1>
          <PostsClientPage {...enhancedPosts} />
        </div>
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Posts</h1>
          <p className="text-red-500">Error loading posts. Please try again later.</p>
        </div>
      </Layout>
    );
  }
}

async function getCursorForPage(page: number, itemsPerPage: number): Promise<string | undefined> {
  if (page < 1) return undefined;

  const response = await client.queries.postConnection({
    first: itemsPerPage * page,
    sort: "date",
    filter: {},
  });

  const edges = response.data.postConnection.edges;
  if (!edges?.length) return undefined;

  const lastEdge = edges[edges.length - 1];
  return lastEdge?.cursor;
}
