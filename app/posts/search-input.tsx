"use client";

import React, { useCallback, useEffect } from "react";
import { useQueryState } from "@/lib/mock-nuqs";
import { Input } from "@/components/ui/input";
import { BsSearch } from "react-icons/bs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function SearchInput() {
  const [search] = useQueryState("q");
  const [inputValue, setInputValue] = React.useState(search || "");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Sync input value with URL parameter when the component mounts or URL changes
  useEffect(() => {
    if (searchParams) {
      const currentSearch = searchParams.get("q") || "";
      setInputValue(currentSearch);
    }
  }, [searchParams]);

  // Handle debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (inputValue !== search) {
        // Create new search params
        const params = new URLSearchParams(searchParams?.toString() || "");
        
        // Set or remove search query
        if (inputValue) {
          params.set("q", inputValue);
        } else {
          params.delete("q");
        }
        
        // Reset to page 1 when searching
        params.delete("page");
        
        // Debug the search process
        console.log(`Searching for "${inputValue}" with params:`, params.toString());
        
        // Navigate to the new URL
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500); // 500ms debounce
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, search, searchParams, router, pathname]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new search params
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    // Set or remove search query
    if (inputValue) {
      params.set("q", inputValue);
    } else {
      params.delete("q");
    }
    
    // Reset to page 1 when searching
    params.delete("page");
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleClear = useCallback(() => {
    setInputValue("");
    
    // Create new search params and remove search query
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("q");
    params.delete("page");
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);
  
  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <Input
        type="text"
        placeholder="Search posts..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-10 pr-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <BsSearch className="w-4 h-4" />
      </div>
      
      {inputValue && (
        <button 
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </form>
  );
} 