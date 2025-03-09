import Layout from "@/components/layout/layout";
import client from "@/tina/__generated__/client";
import PostsClientPage from "./client-page";
import SearchInput from "./search-input";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const searchQuery = searchParams.q || "";
  
  // Calculate total count first to know total pages
  const countQuery = await client.queries.postConnection({
    sort: "date",
    first: 0,
    filter: searchQuery ? {
      title: { startsWith: searchQuery }
    } : undefined
  });
  
  const totalItems = countQuery.data?.postConnection.totalCount || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Fetch items for current page
  const posts = await client.queries.postConnection({
    sort: "date",
    first: ITEMS_PER_PAGE,
    filter: searchQuery ? {
      title: { startsWith: searchQuery }
    } : undefined,
    // Skip items from previous pages
    after: currentPage > 1 
      ? await getCursorForPage(currentPage - 1, ITEMS_PER_PAGE, searchQuery) 
      : undefined,
  });
  
  // For better UX, reverse the order if needed
  if (posts.data?.postConnection?.edges) {
    posts.data.postConnection.edges.reverse();
  }

  // Add pagination data to the posts object directly
  const enhancedPosts = {
    ...posts,
    data: posts.data ? {
      ...posts.data,
      _pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      }
    } : posts.data
  };

  return (
    <Layout rawPageData={posts.data}>
      <SearchInput />
      <PostsClientPage {...enhancedPosts} />
    </Layout>
  );
}

// Helper function to get cursor for pagination
async function getCursorForPage(page: number, itemsPerPage: number, searchQuery?: string): Promise<string | undefined> {
  if (page <= 0) return undefined;
  
  const skipCount = (page * itemsPerPage) - 1;
  
  // Fetch just enough to get the cursor
  const result = await client.queries.postConnection({
    sort: "date",
    first: skipCount + 1,
    filter: searchQuery ? {
      title: { startsWith: searchQuery }
    } : undefined,
  });
  
  const edges = result.data?.postConnection?.edges;
  if (!edges || edges.length === 0) return undefined;
  
  const lastEdge = edges[edges.length - 1];
  return lastEdge?.cursor;
}
