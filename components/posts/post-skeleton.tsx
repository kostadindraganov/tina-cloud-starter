import React from 'react';

interface PostSkeletonProps {
  count?: number;
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden group animate-pulse">
      {/* Image skeleton */}
      <div className="h-64 min-h-[240px] w-full bg-gray-200 dark:bg-gray-800"></div>
      
      {/* Content skeleton */}
      <div className="p-5">
        {/* Date skeleton */}
        <div className="flex justify-end mb-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        
        {/* Tags and arrow skeleton */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function PostsGridSkeleton({ count = 6 }: PostSkeletonProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
} 