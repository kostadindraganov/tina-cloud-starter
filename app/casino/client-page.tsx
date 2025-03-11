"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTina } from "tinacms/dist/react";
import { BsArrowRight } from "react-icons/bs";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import {
  CasinoConnectionQuery,
  CasinoConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { useLayout } from "@/components/layout/layout-context";
import MermaidElement from "@/components/mermaid-renderer";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { useAppStore, Casino } from "@/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiSort } from "react-icons/bi";
import { Skeleton } from "@/components/ui/skeleton";

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const titleColorClasses = {
  blue: "group-hover:text-blue-600 dark:group-hover:text-blue-300",
  teal: "group-hover:text-teal-600 dark:group-hover:text-teal-300",
  green: "group-hover:text-green-600 dark:group-hover:text-green-300",
  red: "group-hover:text-red-600 dark:group-hover:text-red-300",
  pink: "group-hover:text-pink-600 dark:group-hover:text-pink-300",
  purple: "group-hover:text-purple-600 dark:group-hover:text-purple-300",
  orange: "group-hover:text-orange-600 dark:group-hover:text-orange-300",
  yellow: "group-hover:text-yellow-500 dark:group-hover:text-yellow-300",
};

interface ClientPostProps {
  data: CasinoConnectionQuery & {
    _pagination?: PaginationInfo;
    _allCasinos?: Casino[];
  };
  variables: CasinoConnectionQueryVariables;
  query: string;
  initialPage?: number;
  initialSearch?: string;
  initialSort?: 'title' | 'casino_review_count';
  initialOrder?: 'asc' | 'desc';
}

// Casino Skeleton Component for loading state
const CasinoSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className="block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-sm transition-all duration-150 ease-out"
        >
          {/* Title skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-3/4 mb-5" />
            <Skeleton className="h-8 w-8 rounded-full mb-5" /> {/* Arrow icon */}
          </div>
          
          {/* Content skeleton lines with varying widths */}
          <div className="space-y-3 mb-5">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          
          {/* Casino metadata skeletons */}
          <div className="flex gap-4 mt-5">
            <Skeleton className="h-7 w-24 rounded-md" /> {/* Rating */}
            <Skeleton className="h-7 w-32 rounded-md" /> {/* Reviews */}
          </div>
        </div>
      ))}
    </>
  );
};

// Sort dropdown component
const SortDropdown = () => {
  const { casinoSortField, casinoSortOrder, setCasinoSort } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (field: 'title' | 'casino_review_count', order: 'asc' | 'desc') => {
    // Update the store
    setCasinoSort(field, order);
    
    // Update URL params
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set("sort", field);
    params.set("order", order);
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2 border border-gray-700"
        >
          <BiSort className="h-4 w-4" />
          <span>Sort Casinos</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-gray-800 text-white border border-gray-700 shadow-lg"
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-gray-300 font-medium">Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${casinoSortField === 'title' && casinoSortOrder === 'asc' ? 'bg-gray-700 text-blue-300' : ''}`}
            onClick={() => handleSort('title', 'asc')}
          >
            Title (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${casinoSortField === 'title' && casinoSortOrder === 'desc' ? 'bg-gray-700 text-blue-300' : ''}`}
            onClick={() => handleSort('title', 'desc')}
          >
            Title (Z-A)
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${casinoSortField === 'casino_review_count' && casinoSortOrder === 'asc' ? 'bg-gray-700 text-blue-300' : ''}`}
            onClick={() => handleSort('casino_review_count', 'asc')}
          >
            Review Count (Low to High)
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${
              // Highlight this option by default or when it's specifically selected
              (casinoSortField === 'casino_review_count' && casinoSortOrder === 'desc') || 
              (!casinoSortField && !casinoSortOrder) ? 
                'bg-gray-700 text-blue-300' : ''
            }`}
            onClick={() => handleSort('casino_review_count', 'desc')}
          >
            Review Count (High to Low)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function PostsClientPage(props: ClientPostProps) {
  // Get the raw props before Tina processes them
  const rawProps = { ...props };
  const initialPagination = rawProps.data?._pagination;
  const allCasinos = rawProps.data?._allCasinos || [];
  const searchParams = useSearchParams();
  
  // Add state for skeleton loading effect
  const [showSkeleton, setShowSkeleton] = useState(true); // Show skeleton by default
  
  // Use the Zustand store for state management
  const { 
    casinos, 
    casinosLoading, 
    casinosPagination,
    fetchCasinos,
    setCasinoSort,
    getCasinoPage,
    allCasinos: storeAllCasinos,
  } = useAppStore();

  // Use Tina's hook for the initial data
  const { data: tinaData } = useTina({ ...props });
  const { theme } = useLayout();
  const router = useRouter();
  const pathname = usePathname();

  // Get search and sort params from URL
  const searchQuery = searchParams?.get('search') || props.initialSearch || '';
  const currentPage = Number(searchParams?.get('page')) || props.initialPage || 1;
  const sortField = searchParams?.get('sort') as 'title' | 'casino_review_count' 
    || props.initialSort 
    || 'casino_review_count'; // Default sort field
  const sortOrder = searchParams?.get('order') as 'asc' | 'desc' 
    || props.initialOrder 
    || 'desc'; // Default sort order

  // Hide initial skeleton after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show skeleton effect when loading state changes
  useEffect(() => {
    if (casinosLoading) {
      setShowSkeleton(true);
      // Keep showing skeleton for 1 second even if loading completes sooner
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [casinosLoading]);
  
  // Update sort settings when URL parameters change
  useEffect(() => {
    if (storeAllCasinos.length > 0 && (sortField && sortOrder)) {
      // Show skeleton when sorting changes
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
      
      // Update the sort
      setCasinoSort(sortField, sortOrder);
      
      return () => clearTimeout(timer);
    }
  }, [sortField, sortOrder, setCasinoSort, storeAllCasinos.length]);

  // Update pagination when URL parameters change
  useEffect(() => {
    if (storeAllCasinos.length > 0) {
      // Show skeleton when page changes
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
      
      // Update the page
      getCasinoPage(currentPage, searchQuery);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, searchQuery, getCasinoPage, storeAllCasinos.length]);

  // Use the store data if available, otherwise fall back to Tina data
  const casinoData = casinos.length > 0 
    ? { casinoConnection: { edges: casinos.map(casino => ({ node: casino })) } } 
    : tinaData;
  
  // For first render, use the pagination data from SSR
  // For subsequent renders, use the store's pagination data
  const pagination = casinosPagination || initialPagination;

  // Initialize store with all casinos from SSR data if available
  useEffect(() => {
    if (allCasinos.length > 0 && storeAllCasinos.length === 0) {
      // Set the allCasinos in the store
      useAppStore.setState({ 
        allCasinos,
        casinosLoading: false
      });
      
      // Apply initial sorting
      setCasinoSort(sortField, sortOrder);
      
      // Apply initial pagination
      getCasinoPage(currentPage, searchQuery);
    } else if (storeAllCasinos.length === 0) {
      // If we don't have all casinos yet, fetch them
      fetchCasinos(currentPage, searchQuery);
    }
  }, [
    allCasinos, 
    storeAllCasinos.length, 
    setCasinoSort, 
    getCasinoPage, 
    currentPage, 
    searchQuery, 
    sortField, 
    sortOrder, 
    fetchCasinos
  ]);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* Sorting dropdown */}
      <div className="mb-6 flex justify-end">
        <SortDropdown />
      </div>

      {/* Show skeleton loading effect */}
      {showSkeleton && <CasinoSkeleton />}

      {/* Show casinos when not loading, and not showing skeleton */}
      {!showSkeleton && !casinosLoading && casinoData?.casinoConnection?.edges?.map((postData) => {
        if (!postData?.node) return null;
        const post = postData.node;

        return (
          <Link
            key={post.id}
            href={`/casino/` + post._sys.breadcrumbs.join("/")}
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
          </Link>
        );
      })}

      {/* No results message */}
      {!showSkeleton && !casinosLoading && (!casinoData?.casinoConnection?.edges || casinoData.casinoConnection.edges.length === 0) && (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300">No casinos found</p>
        </div>
      )}

      {/* Pagination UI */}
      {pagination && pagination.totalPages > 1 ? (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {/* Previous page button */}
              {pagination.currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage - 1);
                    }} 
                  />
                </PaginationItem>
              )}
              
              {/* First page */}
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  isActive={pagination.currentPage === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis if needed */}
              {pagination.currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Page before current if applicable */}
              {pagination.currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage - 1);
                    }}
                  >
                    {pagination.currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page (if not first or last) */}
              {pagination.currentPage !== 1 && pagination.currentPage !== pagination.totalPages && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    isActive={true}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage);
                    }}
                  >
                    {pagination.currentPage}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Page after current if applicable */}
              {pagination.currentPage < pagination.totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage + 1);
                    }}
                  >
                    {pagination.currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {pagination.currentPage < pagination.totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page (if not first) */}
              {pagination.totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    isActive={pagination.currentPage === pagination.totalPages}
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
              {pagination.currentPage < pagination.totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage + 1);
                    }} 
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </>
  );
}
