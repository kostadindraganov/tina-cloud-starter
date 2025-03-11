import { client } from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import SearchInput from "./search-input";

export default async function CasinoPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const ITEMS_PER_PAGE = 10;
  
  // Always reset to page 1 when searchQuery is provided but page is not explicitly set
  // This ensures when someone searches from page 3, they see results from page 1
  const currentPage = searchParams.q && !searchParams.page 
    ? 1 
    : Number(searchParams.page) || 1;
    
  const searchQuery = searchParams.q || "";
  
  console.log(`Server rendering: Page ${currentPage}, Search query: "${searchQuery}"`);
  
  // Fetch all casino items (with a reasonable limit)
  const allCasinos = await client.queries.casinoConnection({
    sort: "date",
    first: 1000, // Get a large number to effectively get all
  });
  
  // Filter casinos case-insensitively
  const edges = allCasinos.data?.casinoConnection.edges || [];
  const filteredEdges = searchQuery 
    ? edges.filter(edge => 
        edge?.node?.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : edges;
  
  const totalItems = filteredEdges.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Ensure current page is valid given the total pages
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  
  // Paginate the filtered results
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedEdges = filteredEdges.slice(startIndex, endIndex);
  
  // Create a format that matches what the client component expects
  const posts = {
    data: {
      casinoConnection: {
        totalCount: totalItems,
        pageInfo: allCasinos.data?.casinoConnection.pageInfo || {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: ''
        },
        edges: paginatedEdges
      },
      _pagination: {
        currentPage: validCurrentPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      }
    },
    variables: {
      sort: "date",
      first: ITEMS_PER_PAGE,
      searchQuery // Add the search query to the variables for client reference
    },
    query: "" // Required but not used in the component
  };
  
  return (
    <Layout>
      <div className="px-6 py-10">
        <h1 className="text-3xl font-semibold mb-10">Casinos</h1>
        
        <div className="mb-8">
          <SearchInput />
        </div>
        
        <CasinoClientPage {...posts} />
      </div>
    </Layout>
  );
}
