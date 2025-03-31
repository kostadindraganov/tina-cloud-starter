"use client"

import { useLayout } from "@/components/layout/layout-context"
import { CasinoConnectionQuery } from "@/tina/__generated__/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Casino } from "@/store"
import { PaginationInfo } from "../../app/casino/client-page"
import { CasinoCard } from "./casino-card"

// Define title color classes for different theme colors
const titleColorClasses = {
  blue: "group-hover:text-blue-600 dark:group-hover:text-blue-300",
  teal: "group-hover:text-teal-600 dark:group-hover:text-teal-300",
  green: "group-hover:text-green-600 dark:group-hover:text-green-300",
  red: "group-hover:text-red-600 dark:group-hover:text-red-300",
  pink: "group-hover:text-pink-600 dark:group-hover:text-pink-300",
  purple: "group-hover:text-purple-600 dark:group-hover:text-purple-300",
  orange: "group-hover:text-orange-600 dark:group-hover:text-orange-300",
  yellow: "group-hover:text-yellow-500 dark:group-hover:text-yellow-300",
}

type ExtendedCasinoConnectionQuery = CasinoConnectionQuery & {
  _pagination?: PaginationInfo;
  _allCasinos?: Casino[];
}

interface CasinoListProps {
  casinoData: ExtendedCasinoConnectionQuery | { casinoConnection: { edges: { node: Casino }[] } }
  isLoading: boolean
}

// Import the CasinoSkeleton directly to avoid module resolution issues
const CasinoSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border-2 border-gray-200 dark:border-gray-700"
        >
          {/* Left section - Logo skeleton */}
          <div className="w-full md:w-[300px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-6">
            <Skeleton className="w-full h-[200px] rounded-md" />
          </div>
          
          {/* Middle section - Casino details skeleton */}
          <div className="w-full md:w-2/4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            {/* Casino name skeleton */}
            <Skeleton className="h-10 w-3/4 mb-4" />
            
            {/* Safety index skeleton */}
            <Skeleton className="h-14 w-full mb-4 rounded-lg" />
            
            {/* User rating skeleton */}
            <Skeleton className="h-14 w-2/3 mb-4 rounded-lg" />
            
            {/* Info points skeleton */}
            <div className="space-y-3 mb-4">
              <div className="flex">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-5/6" /> {/* Text */}
              </div>
              <div className="flex">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-4/6" /> {/* Text */}
              </div>
              <div className="flex">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-5/6" /> {/* Text */}
              </div>
              <div className="flex">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-4/6" /> {/* Text */}
              </div>
            </div>
            
            {/* Bonus info skeleton */}
            <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start">
                <Skeleton className="h-8 w-8 mr-3 rounded" /> {/* Emoji */}
                <Skeleton className="h-8 w-2/3" /> {/* Bonus title */}
              </div>
            </div>
            
            {/* Action buttons skeleton */}
            <div className="mt-4 grid grid-cols-2 gap-4 mb-4">
              <Skeleton className="h-12 rounded-lg" /> {/* Visit Casino */}
              <Skeleton className="h-12 rounded-lg" /> {/* Read Review */}
            </div>
          </div>
          
          {/* Right section - Languages and Games */}
          <div className="w-full md:w-1/4 p-4 md:p-6 bg-gray-50 dark:bg-gray-800">
            {/* Languages skeleton */}
            <Skeleton className="h-6 w-1/2 mb-3" /> {/* Header */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-3/4" /> {/* Text */}
              </div>
            </div>
            
            {/* Support methods skeleton */}
            <Skeleton className="h-6 w-2/3 mb-3" /> {/* Header */}
            <div className="mb-6 flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            
            {/* Payment methods skeleton */}
            <Skeleton className="h-6 w-1/2 mb-3" /> {/* Header */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-3/4" /> {/* Text */}
              </div>
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> {/* Icon */}
                <Skeleton className="h-5 w-2/3" /> {/* Text */}
              </div>
            </div>
            
            {/* Games skeleton */}
            <Skeleton className="h-6 w-1/2 mb-3" /> {/* Header */}
            <div className="mb-6">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            
            {/* Providers skeleton */}
            <Skeleton className="h-6 w-1/2 mb-3" /> {/* Header */}
            <Skeleton className="h-5 w-3/4" /> {/* Provider */}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CasinoList({ casinoData, isLoading }: CasinoListProps) {
  const { theme } = useLayout()

  // If loading, show skeleton
  if (isLoading) {
    return <CasinoSkeleton />
  }

  // If no casinos found, show empty state
  if (!casinoData?.casinoConnection?.edges || casinoData.casinoConnection.edges.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-lg text-gray-600 dark:text-gray-300">No casinos found</p>
      </div>
    )
  }

  // Render casino list with the new CasinoCard component
  return (
    <div className="space-y-8">
      {casinoData.casinoConnection.edges.map((postData) => {
        if (!postData?.node) return null
        const casino = postData.node

        return (
          <div key={casino.id} className="mb-8 last:mb-0">
            <CasinoCard casino={casino} />
          </div>
        )
      })}
    </div>
  )
} 