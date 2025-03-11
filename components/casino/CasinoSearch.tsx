"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useAppStore, Casino } from "@/store";
import { useCasinoSearchStore } from "@/store/casino-search-store";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";

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

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(() => {
      searchCasinos(allCasinos);
    }, 300),
    [allCasinos, searchCasinos]
  );

  // Effect to perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch();
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
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[hsl(var(--muted-foreground))]">
          <FiSearch className="h-5 w-5" />
        </div>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 h-12 bg-[hsl(var(--background))] border-[hsl(var(--border))] rounded-lg shadow-sm focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-colors duration-200"
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
            className="absolute inset-y-0 right-3 flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <FiX className="h-5 w-5" />
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
            className="absolute z-50 w-full mt-2 bg-[hsl(var(--background))] rounded-lg border border-[hsl(var(--border))] shadow-lg overflow-hidden"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {isLoading ? (
              <div className="p-4 space-y-3">
                <ResultSkeleton />
                <ResultSkeleton />
                <ResultSkeleton />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center text-[hsl(var(--muted-foreground))]">
                {searchQuery.trim() ? (
                  <p>No casinos found matching &quot;{searchQuery}&quot;</p>
                ) : (
                  <p>Type to search casinos</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[hsl(var(--border))]">
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
  return (
    <Link
      href={`/casino/${casino._sys.filename}`}
      className="flex items-center p-3 hover:bg-[hsl(var(--accent)/0.1)] transition-colors group"
    >
      {casino.logo ? (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-[hsl(var(--muted)/0.3)] flex-shrink-0 border border-[hsl(var(--border))]">
          <Image
            src={casino.logo}
            alt={casino.title}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-md bg-[hsl(var(--muted)/0.5)] flex-shrink-0 flex items-center justify-center">
          <FiSearch className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
        </div>
      )}
      <div className="ml-3 flex-grow">
        <h4 className="text-sm font-medium text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-1">
          {casino.title}
        </h4>
        {casino.year_established && (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Est. {casino.year_established}
          </p>
        )}
      </div>
      {casino.casino_review_count !== undefined && (
        <div className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
          {casino.casino_review_count} reviews
        </div>
      )}
    </Link>
  );
}

// Loading skeleton for results
function ResultSkeleton() {
  return (
    <div className="flex items-center p-3">
      <Skeleton className="w-12 h-12 rounded-md" />
      <div className="ml-3 flex-grow">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full ml-2" />
    </div>
  );
} 