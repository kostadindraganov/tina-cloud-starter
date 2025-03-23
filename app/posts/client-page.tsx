'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTina } from 'tinacms/dist/react';
import { BsArrowRight } from 'react-icons/bs';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import MermaidElement from '@/components/mermaid-renderer';
import { mermaid } from '@/components/blocks/mermaid';
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTina } from 'tinacms/dist/react';
import { BsArrowRight } from 'react-icons/bs';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { useRouter, usePathname } from "next/navigation";
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import MermaidElement from '@/components/mermaid-renderer';
import { mermaid } from '@/components/blocks/mermaid';
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
  // Get the raw props before Tina processes them
  const rawProps = { ...props };
  const paginationData = rawProps.data?._pagination;
  
  const { data } = useTina({ ...props });
  const { theme } = useLayout();
  const router = useRouter();
  const pathname = usePathname();
  
  // Use the pagination data from raw props since Tina might strip it out
  const pagination = paginationData;
  
  // Add loading state for page transitions
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset loading state when the data changes
  useEffect(() => {
    setIsLoading(false);
  }, [data]);
  
  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page === pagination?.currentPage) return;
    
    try {
      setError(null);
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    } catch (err) {
      setError("Failed to navigate to the selected page. Please try again.");
      setIsLoading(false);
      console.error("Pagination error:", err);
    }
  };

  // If no posts found
  const noPostsFound = !data?.postConnection.edges || data.postConnection.edges.length === 0;

  return (
    <>
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md mb-8">
          <p>{error}</p>
        </div>
      )}
      
      <div className={isLoading ? "opacity-50 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
        {noPostsFound ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
          </div>
        ) : (
          data?.postConnection.edges?.map((postData) => {
            if (!postData?.node) return null;
            const post = postData.node;

            const date = new Date(post.date || "");
            let formattedDate = "";
            if (!isNaN(date.getTime())) {
              formattedDate = format(date, "MMM dd, yyyy");
            }
            
            return (
              <Link
                key={post.id}
                href={`/posts/` + post._sys.breadcrumbs.join("/")}
                className="group block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800"
              >
                <h3
                  className={`text-gray-700 dark:text-white text-3xl lg:text-4xl font-semibold title-font mb-5 transition-all duration-150 ease-out ${
                    theme?.color ? titleColorClasses[theme.color] : ''
                  }`}
                >
                  {post.title}{" "}
                  <span className="inline-block opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <BsArrowRight className="inline-block h-8 -mt-1 ml-1 w-auto opacity-70" />
                  </span>
                </h3>
                <div className="prose dark:prose-dark w-full max-w-none mb-5 opacity-70">
                  <TinaMarkdown 
                    content={post.excerpt}
                    components={{
                      mermaid({ value }: { value: string }) {
                        return <MermaidElement value={value} />;
                      }
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    {post?.author?.avatar && (
                      <Image
                        width={500}
                        height={500}
                        className="h-10 w-10 object-cover rounded-full shadow-sm"
                        src={post.author.avatar}
                        alt={post?.author?.name || "Author"}
                      />
                    )}
                  </div>
                  <p className="text-base font-medium text-gray-600 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-white">
                    {post?.author?.name}
                  </p>
                  {formattedDate !== "" && (
                    <>
                      <span className="font-bold text-gray-200 dark:text-gray-500 mx-2">
                        —
                      </span>
                      <p className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150">
                        {formattedDate}
                      </p>
                    </>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
      
      {/* Only show pagination if we have posts and more than one page */}
      {!noPostsFound && pagination && pagination.totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {/* Previous page button */}
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.currentPage > 1) {
                      handlePageChange(pagination.currentPage - 1);
                    }
                  }}
                  className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  aria-disabled={pagination.currentPage <= 1}
                />
              </PaginationItem>
              
              {/* Generate page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                // Logic for smart pagination display
                let pageNum;
                if (pagination.totalPages <= 5) {
                  // If 5 or fewer pages, show all pages
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  // If on pages 1-3, show pages 1-5
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  // If on last 3 pages, show last 5 pages
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  // Otherwise show current page and 2 before/after
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      isActive={pagination.currentPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Show ellipsis at the end if needed */}
              {pagination.totalPages > 5 && 
               (pagination.currentPage < pagination.totalPages - 2) && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page (if not visible in the paginated range) */}
              {pagination.totalPages > 5 && 
               (pagination.currentPage < pagination.totalPages - 2) && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.totalPages);
                    }}
                  >
                    {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next page button */}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.currentPage < pagination.totalPages) {
                      handlePageChange(pagination.currentPage + 1);
                    }
                  }}
                  className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  aria-disabled={pagination.currentPage >= pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
