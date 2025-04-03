"use client"

import React from "react"
import { FaCode } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface SoftwareProvider {
  count?: number | null
  all_software_providers?: string | null
}

interface SweepstakesProvidersMiniProps {
  softwareProviders?: (SoftwareProvider | null)[] | null
  className?: string
  maxDisplay?: number
}

export function SweepstakesProvidersMini({ softwareProviders, className, maxDisplay = 4 }: SweepstakesProvidersMiniProps) {
  // Return early if no providers data is available
  if (!softwareProviders || softwareProviders.length === 0) {
    return null
  }

  // Get the first (and usually only) provider entry
  const provider = softwareProviders[0]
  
  if (!provider || !provider.all_software_providers) {
    return null
  }

  // Parse software providers into an array
  const providersArray = provider.all_software_providers.split(',')
    .map(item => item.trim())
    .filter(Boolean);

  // Display only a limited number of providers
  const displayedProviders = providersArray.slice(0, maxDisplay)
  const remainingCount = Math.max(0, providersArray.length - maxDisplay)

  return (
    <div className={cn("", className)}>
      <div className="flex items-center mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center">
          <FaCode className="text-gray-500 dark:text-gray-400 mr-1 text-sm" />
          {provider.count && provider.count > 0 && (
            <span>{provider.count} providers</span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {displayedProviders.map((providerName, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/10 text-xs text-purple-700 dark:text-purple-300"
          >
            {providerName}
          </span>
        ))}
        
        {/* Show count of remaining providers if any */}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-xs text-purple-700 dark:text-purple-300">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  )
} 