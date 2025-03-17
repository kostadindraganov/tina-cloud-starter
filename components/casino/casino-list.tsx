"use client"

import Link from "next/link"
import { useLayout } from "@/components/layout/layout-context"
import { BsArrowRight } from "react-icons/bs"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import MermaidElement from "@/components/mermaid-renderer"
import { CasinoConnectionQuery } from "@/tina/__generated__/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Casino } from "@/store"
import { PaginationInfo } from "../../app/casino/client-page"

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
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-sm transition-all duration-150 ease-out"
        >
          <div className="flex items-start">
            {/* Logo skeleton */}
            <div className="flex-shrink-0 mr-6">
              <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-md" />
            </div>
            
            {/* Content skeleton */}
            <div className="flex-1">
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
          </div>
        </div>
      ))}
    </>
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

  // Render casino list
  return (
    <>
      {casinoData.casinoConnection.edges.map((postData) => {
        if (!postData?.node) return null
        const post = postData.node

        return (
          <Link
            key={post.id}
            href={`/casino/` + post._sys.breadcrumbs.join("/")}
            className="group block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800"
          >
            <div className="flex items-start">
              {/* Logo image on the left */}
              <div className="flex-shrink-0 mr-6">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
                  {post.logo ? (
                    <img 
                      src={post.logo} 
                      alt={`${post.title} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-300 dark:text-gray-600 text-xs text-center">
                      No logo
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
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
                        return <MermaidElement value={value} />
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
} 