import Layout from "@/components/layout/layout";
import client from "@/tina/__generated__/client";
import PostsClientPage from "./client-page";

const ITEMS_PER_PAGE = 10;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  const posts = await client.queries.postConnection({
    first: ITEMS_PER_PAGE,
    sort: "title",
    filter: {},
    after: currentPage > 1
      ? await getCursorForPage(currentPage - 1, ITEMS_PER_PAGE)
      : undefined,
  });

  const totalPosts = await client.queries.postConnection({
    sort: "title",
    filter: {},
  });

  const totalItems = totalPosts.data.postConnection.totalCount;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const enhancedPosts = {
    ...posts,
    data: {
      ...posts.data,
      _pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      }
    }
  };

  return (
    <Layout rawPageData={posts.data}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Posts</h1>
        <PostsClientPage {...enhancedPosts} />
      </div>
    </Layout>
  );
}

async function getCursorForPage(page: number, itemsPerPage: number): Promise<string | undefined> {
  if (page < 1) return undefined;

  const response = await client.queries.postConnection({
    first: itemsPerPage * page,
    sort: "title",
    filter: {},
  });

  const edges = response.data.postConnection.edges;
  if (!edges?.length) return undefined;

  const lastEdge = edges[edges.length - 1];
  return lastEdge?.cursor;
}
