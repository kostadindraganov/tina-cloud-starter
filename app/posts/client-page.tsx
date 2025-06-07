'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTina } from 'tinacms/dist/react';
import { useRouter, usePathname } from "next/navigation";
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { ArrowRight } from 'lucide-react';
import { ImageWithLoading } from '@/components/ui/image-with-loading';

// Define pagination info type
type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const titleColorClasses: Record<string, string> = {
  blue: 'group-hover:text-blue-600 dark:group-hover:text-blue-300',
  teal: 'group-hover:text-teal-600 dark:group-hover:text-teal-300',
  green: 'group-hover:text-green-600 dark:group-hover:text-green-300',
  red: 'group-hover:text-red-600 dark:group-hover:text-red-300',
  pink: 'group-hover:text-pink-600 dark:group-hover:text-pink-300',
  purple: 'group-hover:text-purple-600 dark:group-hover:text-purple-300',
  orange: 'group-hover:text-orange-600 dark:group-hover:text-orange-300',
  yellow: 'group-hover:text-yellow-500 dark:group-hover:text-yellow-300',
};

interface ClientPostProps {
  data: PostConnectionQuery & {
    _pagination?: PaginationInfo;
  };
  variables: PostConnectionQueryVariables;
  query: string;
}

// Loading component
function PostsLoading() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// Post card component to handle individual post rendering
function PostCard({ post, theme }: { post: any, theme: any }) {
  // Format date consistently
  const formattedDate = post.date ? formatPostDate(post.date) : "";
  
  // Safely handle breadcrumbs
  const breadcrumbs = post._sys?.breadcrumbs || [];
  const postUrl = `/posts/${breadcrumbs.join("/")}`;
  
  return (
    <div 
      key={post.id}
      className="group flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-sm transition-all duration-150 ease-out hover:shadow-md"
    >
      {/* Post image at the top */}
      {(post.heroImg || post.thumbnail) ? (
        <Link href={postUrl}>
          <div className="h-64 min-h-[240px] w-full overflow-hidden relative">
            <ImageWithLoading
              src={post.heroImg || post.thumbnail}
              alt={post.title || "Post featured image"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      ) : (
        <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-800"></div>
      )}
      
      {/* Content below image */}
      <div className="flex flex-col h-full p-5 line-clamp-3">
        {/* Author and date - simplified layout */}
        {(post?.author?.name || formattedDate) && (
          <div className="mb-2">
            <p className="text-xs text-grey-500 dark:text-gray-400 text-right">
              {formattedDate || ""}
            </p>
          </div>
        )}
        
        {/* Post title */}
        <Link href={postUrl}>
          <h3
            className={`text-xl font-semibold mb-3 transition-all duration-150 line-clamp-3 ease-out ${
              theme?.color ? titleColorClasses[theme.color] : ''
            }`}
          >
            {post.title}
          </h3>
        </Link>
        
        {/* Tags and arrow container */}
        <div className="mt-auto flex items-end justify-between">
          {/* Tags as category pills */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start items-center">
              {post.tags.slice(0, 2).map((tag: string | null, index: number) => (
                tag && (
                  <span 
                    key={`${post.id}-tag-${index}`}
                    className="px-2 py-1 text-xs font-medium rounded-lg border-[1px] border-green-400
                    text-grey-500"
                  >
                    {tag}
                  </span>
                )
              ))}
            </div>
          )}
          
          {/* Arrow link */}
          <Link href={postUrl} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Posts grid component
function PostsGrid({ data, theme }: { 
  data: PostConnectionQuery, 
  theme: any
}) {
  // Get posts without sorting
  const sortedPosts = useMemo(() => {
    if (!data?.postConnection?.edges) return { edges: [] };
    
    return {
      ...data.postConnection,
      edges: [...data.postConnection.edges]
    };
  }, [data?.postConnection]);

  const noPostsFound = !sortedPosts.edges || sortedPosts.edges.length === 0;

  if (noPostsFound) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sortedPosts.edges?.map((postData) => {
        if (!postData?.node) return null;
        return <PostCard key={postData.node.id} post={postData.node} theme={theme} />;
      })}
    </div>
  );
}

// Pagination component
function PostsPagination({ 
  paginationData, 
  handlePageChange 
}: { 
  paginationData: PaginationInfo, 
  handlePageChange: (page: number) => void 
}) {
  if (!paginationData || paginationData.totalPages <= 1) return null;

  return (
    <div className="mt-12">
      <Pagination>
        <PaginationContent>
          {/* Previous page button */}
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (paginationData.currentPage > 1) {
                  handlePageChange(paginationData.currentPage - 1);
                }
              }}
              className={paginationData.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              aria-disabled={paginationData.currentPage <= 1}
            />
          </PaginationItem>
          
          {/* Page numbers */}
          {generatePaginationItems(paginationData.currentPage, paginationData.totalPages).map((item) => {
            if (item === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={item}>
                <PaginationLink 
                  href="#" 
                  isActive={paginationData.currentPage === item}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next page button */}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (paginationData.currentPage < paginationData.totalPages) {
                  handlePageChange(paginationData.currentPage + 1);
                }
              }}
              className={paginationData.currentPage >= paginationData.totalPages ? "pointer-events-none opacity-50" : ""}
              aria-disabled={paginationData.currentPage >= paginationData.totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default function PostsClientPage(props: ClientPostProps) {
  // Get pagination data from raw props before Tina processing
  const paginationData = props.data?._pagination;
  const { data } = useTina({ ...props });
  const { theme } = useLayout();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset loading state when data changes
  useEffect(() => {
    setIsLoading(false);
  }, [data]);
  
  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page === paginationData?.currentPage) return;
    setIsLoading(true);
    router.push(`${pathname}?page=${page}`);
  };

  return (
    <>
      {/* Loading indicator */}
      {isLoading && <PostsLoading />}
      
      {/* Posts content with opacity when loading */}
      <div className={isLoading ? "opacity-50 pointer-events-none transition-opacity duration-300" : ""}>
        <PostsGrid data={data} theme={theme} />
        {paginationData && paginationData.totalPages > 1 && (
          <PostsPagination 
            paginationData={paginationData} 
            handlePageChange={handlePageChange} 
          />
        )}
      </div>
    </>
  );
}

// Format post date safely
function formatPostDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";
  } catch {
    return "";
  }
}

// Generate pagination items with ellipsis
function generatePaginationItems(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const items: (number | 'ellipsis')[] = [];
  
  // Always include first page
  items.push(1);
  
  // Add ellipsis if needed
  if (currentPage > 3) {
    items.push('ellipsis');
  }
  
  // Add pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always included
    items.push(i);
  }
  
  // Add ellipsis if needed
  if (currentPage < totalPages - 2) {
    items.push('ellipsis');
  }
  
  // Always include last page if more than 1 page
  if (totalPages > 1) {
    items.push(totalPages);
  }
  
  return items;
}
