"use client";

import React, { useCallback } from "react";
import { useQueryState } from "@/lib/mock-nuqs";
import { Input } from "@/components/ui/input";
import { BsSearch } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";

export default function SearchInput() {
  const [search] = useQueryState("q");
  const [inputValue, setInputValue] = React.useState(search || "");
  const [debouncedValue, setDebouncedValue] = React.useState(search || "");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const pathname = usePathname();
  const router = useRouter();
  
  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500); // 500ms debounce
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);
  
  React.useEffect(() => {
    if (debouncedValue !== search) {
      const params = new URLSearchParams();
      
      if (debouncedValue) {
        params.set("q", debouncedValue);
      }
      
      // Reset to page 1 when searching
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedValue, search, pathname, router]);
  
  React.useEffect(() => {
    setInputValue(search || "");
  }, [search]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedValue(inputValue);
  };
  
  const handleClear = useCallback(() => {
    setInputValue("");
    setDebouncedValue("");
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <Input
        type="text"
        placeholder="Search casino posts..."
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