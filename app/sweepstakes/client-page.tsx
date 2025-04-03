"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTina } from "tinacms/dist/react";
import {
  SweepstakesConnectionQuery,
  SweepstakesConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { useAppStore, Sweepstakes } from "@/store";
import { SortControls } from "../../components/sweepstakes/sort-controls";
import { SweepstakesList } from "../../components/sweepstakes/sweepstakes-list";
import { PaginationControls } from "../../components/sweepstakes/pagination-controls";
import SidebarBanners from "@/components/banners/SidebarBanners";

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type SortField = 'title' | 'sweepstakes_review_count';
export type SortOrder = 'asc' | 'desc';

interface SweepstakesClientPageProps {
  data: SweepstakesConnectionQuery & {
    _pagination?: PaginationInfo;
    _allSweepstakes?: Sweepstakes[];
  };
  variables: SweepstakesConnectionQueryVariables;
  query: string;
  initialPage?: number;
  initialSearch?: string;
  initialSort?: SortField;
  initialOrder?: SortOrder;
}

export default function SweepstakesClientPage(props: SweepstakesClientPageProps) {
  // Extract initial data from props
  const initialPagination = props.data?._pagination;
  const allSweepstakes = useMemo(() => props.data?._allSweepstakes || [], [props.data?._allSweepstakes]);
  const searchParams = useSearchParams();
  
  // Local loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Router hooks
  const router = useRouter();
  const pathname = usePathname();

  // Get URL parameters
  const searchQuery = searchParams?.get('search') || props.initialSearch || '';
  const currentPage = Number(searchParams?.get('page')) || props.initialPage || 1;
  const sortField = (searchParams?.get('sort') as SortField) || props.initialSort || 'sweepstakes_review_count';
  const sortOrder = (searchParams?.get('order') as SortOrder) || props.initialOrder || 'desc';

  // Get state from store
  const { 
    sweepstakes,
    sweepstakesLoading, 
    sweepstakesPagination,
    fetchSweepstakes,
    setSweepstakesSort,
    getSweepstakesPage,
    allSweepstakes: storeAllSweepstakes,
  } = useAppStore();

  // Process data with Tina CMS
  const { data: tinaData } = useTina({ ...props });
  
  // Handle loading state with a minimum duration
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state when data is loading
  useEffect(() => {
    if (sweepstakesLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [sweepstakesLoading]);
  
  // Update sort when parameters change
  useEffect(() => {
    if (storeAllSweepstakes.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      
      setSweepstakesSort(sortField, sortOrder);
      
      return () => clearTimeout(timer);
    }
  }, [sortField, sortOrder, setSweepstakesSort, storeAllSweepstakes.length]);

  // Update page when parameters change
  useEffect(() => {
    if (storeAllSweepstakes.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      
      getSweepstakesPage(currentPage, searchQuery);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, searchQuery, getSweepstakesPage, storeAllSweepstakes.length]);

  // Use data from store or fallback to Tina data
  const sweepstakesData = sweepstakes.length > 0 
    ? { sweepstakesConnection: { edges: sweepstakes.map(sweepstake => ({ node: sweepstake })) } } 
    : tinaData;
  
  // Use pagination from store or fallback to initial data
  const pagination = sweepstakesPagination || initialPagination;

  // Initialize store with SSR data
  useEffect(() => {
    if (allSweepstakes.length > 0 && storeAllSweepstakes.length === 0) {
      // Set initial data
      useAppStore.setState({ 
        allSweepstakes,
        sweepstakesLoading: false
      });
      
      // Set initial sort and page
      setSweepstakesSort(sortField, sortOrder);
      getSweepstakesPage(currentPage, searchQuery);
    } else if (storeAllSweepstakes.length === 0) {
      // Fetch data if not available
      fetchSweepstakes(currentPage, searchQuery);
    }
  }, [
    allSweepstakes, 
    storeAllSweepstakes.length, 
    setSweepstakesSort, 
    getSweepstakesPage, 
    currentPage, 
    searchQuery, 
    sortField, 
    sortOrder, 
    fetchSweepstakes
  ]);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle sort change
  const handleSortChange = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set("sort", field);
    params.set("order", order);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
      <div className="flex flex-col md:flex-row justify-between w-full gap-6">
        <div className="flex-1 flex flex-col gap-4">

            <div className="mb-8 "> 
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:flex-1 pb-8">
                  <h3 className="text-2xl font-bold text-gray-800">
                  Best Sweepstakes Casinos
                 </h3>
                 <span className="text-gray-400">
                 Backed by our unique Safety Index.                  
                 </span>
                  {/* <SweepstakesSearch 
                    className="w-full" 
                    placeholder="Search by name, features or bonuses..."
                  /> */}
                </div>
                <div className="pb-8">
                <SortControls 
                  sortField={sortField} 
                  sortOrder={sortOrder} 
                  onSortChange={handleSortChange} 
                />
                </div>
           
              </div>
            </div>
     
            
            {/* Sweepstakes list with loading state */}
            <SweepstakesList 
              sweepstakesData={sweepstakesData} 
              isLoading={isLoading} 
            />

            {/* Pagination controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12">
                <PaginationControls 
                  pagination={pagination} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
        </div>
        <aside className="w-full md:w-[300px] lg:w-[350px] p-4  rounded-lg shrink-0 h-fit sticky top-24">
          <div className="space-y-6 flex flex-col items-center">
          <SidebarBanners maxBanners={3} position="sidebar" />
          </div>
        </aside>
      </div>
  );
}
