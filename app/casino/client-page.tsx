"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTina } from "tinacms/dist/react";
import {
  CasinoConnectionQuery,
  CasinoConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { useAppStore, Casino } from "@/store";
import CasinoSearch from "@/components/casino/CasinoSearch";
import { SortControls } from "../../components/casino/sort-controls";
import { CasinoList } from "../../components/casino/casino-list";
import { PaginationControls } from "../../components/casino/pagination-controls";
import SidebarBanners from "@/components/banners/SidebarBanners";

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type SortField = 'title' | 'casino_review_count';
export type SortOrder = 'asc' | 'desc';

interface CasinoClientPageProps {
  data: CasinoConnectionQuery & {
    _pagination?: PaginationInfo;
    _allCasinos?: Casino[];
  };
  variables: CasinoConnectionQueryVariables;
  query: string;
  initialPage?: number;
  initialSearch?: string;
  initialSort?: SortField;
  initialOrder?: SortOrder;
}

export default function CasinoClientPage(props: CasinoClientPageProps) {
  // Extract initial data from props
  const initialPagination = props.data?._pagination;
  const allCasinos = useMemo(() => props.data?._allCasinos || [], [props.data?._allCasinos]);
  const searchParams = useSearchParams();
  
  // Local loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Router hooks
  const router = useRouter();
  const pathname = usePathname();

  // Get URL parameters
  const searchQuery = searchParams?.get('search') || props.initialSearch || '';
  const currentPage = Number(searchParams?.get('page')) || props.initialPage || 1;
  const sortField = (searchParams?.get('sort') as SortField) || props.initialSort || 'casino_review_count';
  const sortOrder = (searchParams?.get('order') as SortOrder) || props.initialOrder || 'desc';

  // Get state from store
  const { 
    casinos,
    casinosLoading, 
    casinosPagination,
    fetchCasinos,
    setCasinoSort,
    getCasinoPage,
    allCasinos: storeAllCasinos,
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
    if (casinosLoading) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [casinosLoading]);
  
  // Update sort when parameters change
  useEffect(() => {
    if (storeAllCasinos.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      
      setCasinoSort(sortField, sortOrder);
      
      return () => clearTimeout(timer);
    }
  }, [sortField, sortOrder, setCasinoSort, storeAllCasinos.length]);

  // Update page when parameters change
  useEffect(() => {
    if (storeAllCasinos.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      
      getCasinoPage(currentPage, searchQuery);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage, searchQuery, getCasinoPage, storeAllCasinos.length]);

  // Use data from store or fallback to Tina data
  const casinoData = casinos.length > 0 
    ? { casinoConnection: { edges: casinos.map(casino => ({ node: casino })) } } 
    : tinaData;
  
  // Use pagination from store or fallback to initial data
  const pagination = casinosPagination || initialPagination;

  // Initialize store with SSR data
  useEffect(() => {
    if (allCasinos.length > 0 && storeAllCasinos.length === 0) {
      // Set initial data
      useAppStore.setState({ 
        allCasinos,
        casinosLoading: false
      });
      
      // Set initial sort and page
      setCasinoSort(sortField, sortOrder);
      getCasinoPage(currentPage, searchQuery);
    } else if (storeAllCasinos.length === 0) {
      // Fetch data if not available
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
                  <CasinoSearch 
                    className="w-full" 
                    placeholder="Search by name, features or bonuses..."
                  />
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
     
            
            {/* Casino list with loading state */}
            <CasinoList 
              casinoData={casinoData} 
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
