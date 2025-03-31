"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useAppStore, Casino } from "@/store";
import { useCasinoSearchStore } from "@/store/casino-search-store";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface CasinoSearchProps {
  placeholder?: string;
  className?: string;
}

export default function CasinoSearch({
  placeholder = "Search casinos...",
  className = "",
}: CasinoSearchProps) {
  // Get stores
  const { allCasinos } = useAppStore();
  const {
    searchQuery,
    isDropdownOpen,
    searchResults,
    isLoading,
    setSearchQuery,
    toggleDropdown,
    searchCasinos,
    clearSearch,
  } = useCasinoSearchStore();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchCasinos(allCasinos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        toggleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleDropdown]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search and close dropdown
  const handleClearSearch = () => {
    clearSearch();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-emerald-600">
          <HiOutlineSearch className="h-5 w-5" />
        </div>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 h-12 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800 placeholder:text-emerald-400 rounded-lg shadow-md focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent transition-colors duration-200"
          onFocus={() => {
            if (searchQuery.trim()) {
              toggleDropdown(true);
            }
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-emerald-400 hover:text-emerald-600 transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            ref={dropdownRef}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-emerald-200 shadow-xl overflow-hidden"
            style={{ 
              maxHeight: "400px", 
              overflowY: "auto",
              zIndex: 50,
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)"
            }}
          >
            <div className="sticky top-0 bg-green-500 py-2 px-4 border-b border-emerald-100">
              <div className="flex items-center justify-between ">
                <span className="text-sm font-medium text-white">Search Results</span>
                {searchResults.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full text-white">
                    {searchResults.length} found
                  </span>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-4 space-y-3">
                <ResultSkeleton />
                <ResultSkeleton />
                <ResultSkeleton />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center text-emerald-600/70">
                {searchQuery.trim() ? (
                  <div className="flex flex-col items-center">
                    <HiOutlineSearch className="h-8 w-8 mb-2 text-emerald-300" />
                    <p>No casinos found matching &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <HiOutlineSearch className="h-8 w-8 mb-2 text-emerald-300" />
                    <p>Type to search casinos</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-emerald-100">
                {searchResults.map((casino) => (
                  <CasinoSearchResult key={casino.id} casino={casino} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Casino Result Item
function CasinoSearchResult({ casino }: { casino: Casino }) {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const maxRating = 10;
    const normalizedRating = Math.min(Math.max(rating, 0), maxRating);
    
    return (
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => (
          index < normalizedRating ? (
            <FaStar key={index} className="h-3 w-3 text-yellow-500" />
          ) : (
            <FaRegStar key={index} className="h-3 w-3 text-yellow-400" />
          )
        ))}
      </div>
    );
  };

  return (
    <Link
      href={`/casino/${casino._sys.filename}`}
      className="flex items-center p-4 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-green-50/80 transition-all duration-200 group"
    >
      {casino.logo ? (
        <div className="w-14 h-14 rounded-md overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 flex-shrink-0 border border-emerald-200 p-1 shadow-sm group-hover:shadow group-hover:border-emerald-300 transition-all duration-200">
          <Image
            src={casino.logo}
            alt={casino.title}
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-md bg-emerald-100 flex-shrink-0 flex items-center justify-center shadow-sm group-hover:shadow group-hover:bg-emerald-200 transition-all duration-200">
          <HiOutlineSearch className="h-6 w-6 text-emerald-600 text-green-500" />
        </div>
      )}
      <div className="ml-4 flex-grow">
        <h4 className="text-sm font-medium text-emerald-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {casino.title}
        </h4>
      </div>
      {casino.casino_review_count !== undefined && (
        <div className="ml-2 px-3 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 shadow-sm group-hover:from-emerald-200 group-hover:to-green-200 transition-all duration-200 flex flex-col items-center gap-0.5">
          <span className="text-emerald-700 text-[10px] font-semibold -mt-0.5 uppercase tracking-wide text-green-600">Casino Review</span>
          {renderStars(casino.casino_review_count)}
        </div>
      )}
    </Link>
  );
}

// Loading skeleton for results
function ResultSkeleton() {
  return (
    <div className="flex items-center p-3">
      <Skeleton className="w-12 h-12 rounded-md bg-emerald-100/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent animate-shimmer" />
      </Skeleton>
      <div className="ml-3 flex-grow">
        <Skeleton className="h-4 w-3/4 mb-2 bg-emerald-100/50 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent animate-shimmer" />
        </Skeleton>
        <Skeleton className="h-3 w-1/3 bg-emerald-100/50 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent animate-shimmer" />
        </Skeleton>
      </div>
      <Skeleton className="h-6 w-20 rounded-full ml-2 bg-emerald-100/50 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent animate-shimmer" />
      </Skeleton>
    </div>
  );
} 