'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { useRouter, usePathname } from "next/navigation";
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import MermaidElement from '@/components/mermaid-renderer';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

// Define pagination info type
type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const titleColorClasses = {
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

export default function PostsClientPage(props: ClientPostProps) {
  // Get pagination data from raw props before Tina processing
  const paginationData = props.data?._pagination;
  
  const { data } = useTina({ ...props });
  const { theme } = useLayout();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset loading state when data changes
  useEffect(() => {
    setIsLoading(false);
  }, [data]);
  
  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page === paginationData?.currentPage) return;
    
    try {
      setError(null);
      setIsLoading(true);
      router.push(`${pathname}?page=${page}`);
    } catch (err) {
      setError("Failed to navigate to the selected page. Please try again.");
      setIsLoading(false);
      console.error("Pagination error:", err);
    }
  };

  // Sort posts by date in descending order
  const sortedPosts = useMemo(() => {
    if (!data?.postConnection?.edges) return { edges: [] };
    
    return {
      ...data.postConnection,
      edges: [...data.postConnection.edges].sort((a, b) => {
        const dateA = a?.node?.date ? new Date(a.node.date) : new Date(0);
        const dateB = b?.node?.date ? new Date(b.node.date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
    };
  }, [data?.postConnection]);

  const noPostsFound = !sortedPosts.edges || sortedPosts.edges.length === 0;

  return (
    <>
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md mb-8">
          <p>{error}</p>
        </div>
      )}
      
      {/* Posts grid */}
      <div className={isLoading ? "opacity-50 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
        {noPostsFound ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.edges?.map((postData) => {
              if (!postData?.node) return null;
              const post = postData.node;

              // Format date consistently
              const formattedDate = post.date ? formatPostDate(post.date) : "";
              const postUrl = `/posts/${post._sys.breadcrumbs.join("/")}`;
              
              return (
                <div 
                  key={post.id}
                  className="group flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-sm transition-all duration-150 ease-out hover:shadow-md"
                >
                  {/* Post image at the top */}
                  {post.heroImg ? (
                    <div className="h-64  min-h-[240px] w-full overflow-hidden relative">
                      <Link href={postUrl}>
                        <Image
                          src={post.heroImg}
                          alt={post.title || "Post featured image"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                    </div>
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
                        className={`text-xl font-semibold mb-3 transition-all duration-150  line-clamp-3 ease-out ${
                          theme?.color ? titleColorClasses[theme.color] : ''
                        }`}
                      >
                        {post.title}
                      </h3>
                    </Link>
                    
                    {/* Post excerpt - shortened */}
                    {/* <div className="prose dark:prose-dark prose-sm mb-4 flex-grow line-clamp-3 break-words overflow-hidden text-ellipsis">
                      <TinaMarkdown 
                        content={post.excerpt}
                        components={{
                          mermaid({ value }: { value: string }) {
                            return <MermaidElement value={value} />;
                          }
                        }}
                      />
                    </div> */}
                    
                    {/* Tags as category pills at bottom */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={`${post.id}-tag-${index}`}
                            className="px-3 py-1 text-xs font-medium rounded-full  border-[1px] border-green-400
                            text-grey-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!noPostsFound && paginationData && paginationData.totalPages > 1 && (
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
      )}
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
