"use client"

import React, { useState } from "react"
import { GrLanguage } from "react-icons/gr"
import { MdOutlineTranslate } from "react-icons/md"
import { cn } from "@/lib/utils"

interface Language {
  count?: number | null
  all_language?: string | null
}

interface CasinoLanguagesProps {
  languages?: (Language | null)[] | null
  className?: string
}

export function CasinoLanguages({ languages, className }: CasinoLanguagesProps) {
  const [showAll, setShowAll] = useState(false)
  const maxInitialDisplay = 8

  // Return early if no language data is available
  if (!languages || languages.length === 0) {
    return (
      <div className={cn("text-center p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm", className)}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No language information available</p>
      </div>
    )
  }

  // Process language data
  const language = languages[0]
  const hasLanguageData = language && language.all_language

  // Parse languages into an array
  const languagesArray = hasLanguageData 
    ? language.all_language?.split(',').map(item => item.trim()).filter(Boolean) || []
    : []

  // Language flag/icon mapping
  const languageFlags: Record<string, string> = {
    'english': '🇬🇧',
    'german': '🇩🇪',
    'french': '🇫🇷',
    'spanish': '🇪🇸',
    'italian': '🇮🇹',
    'portuguese': '🇵🇹',
    'dutch': '🇳🇱',
    'swedish': '🇸🇪',
    'finnish': '🇫🇮',
    'norwegian': '🇳🇴',
    'danish': '🇩🇰',
    'russian': '🇷🇺',
    'polish': '🇵🇱',
    'czech': '🇨🇿',
    'turkish': '🇹🇷',
    'hungarian': '🇭🇺',
    'romanian': '🇷🇴',
    'greek': '🇬🇷',
    'chinese': '🇨🇳',
    'japanese': '🇯🇵',
    'korean': '🇰🇷',
    'arabic': '🇸🇦',
    'thai': '🇹🇭',
    'vietnamese': '🇻🇳',
    'hindi': '🇮🇳',
    'indonesian': '🇮🇩',
    'malay': '🇲🇾',
    'filipino': '🇵🇭',
    'bulgarian': '🇧🇬',
    'ukrainian': '🇺🇦',
    'serbian': '🇷🇸',
    'croatian': '🇭🇷',
    'slovenian': '🇸🇮',
    'slovak': '🇸🇰',
    'latvian': '🇱🇻',
    'lithuanian': '🇱🇹',
    'estonian': '🇪🇪'
  }

  // Format language name
  const formatLanguage = (lang: string): string => {
    return lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()
  }

  // Determine which languages to display based on state
  const displayedLanguages = showAll
    ? languagesArray
    : languagesArray.slice(0, maxInitialDisplay)

  const hasMoreLanguages = languagesArray.length > maxInitialDisplay

  return (
    <div className={cn("rounded-md shadow-sm overflow-hidden", className)}>
      {/* Languages Header */}
      <div className="bg-blue-600 dark:bg-blue-700 p-3 rounded-lg flex items-center justify-between border-b border-blue-500 dark:border-blue-600">
        <div className="flex items-center justify-center space-x-2">
          <MdOutlineTranslate className="text-white dark:text-white text-lg" />
          <p className="font-medium p-0 text-sm text-white dark:text-white m-2">Languages</p>
        </div>
        {language?.count && language.count > 0 && (
          <span className="text-white dark:text-white text-xs font-medium">
            {language.count} Languages
          </span>
        )}
      </div>
      
      {/* Languages List */}
      {hasLanguageData && (
        <div className="p-3 bg-white dark:bg-gray-900">
          <div className="flex flex-wrap gap-2">
            {displayedLanguages.map((lang, index) => {
              const langLower = lang.toLowerCase()
              const flagEmoji = languageFlags[langLower] || '🌐'
              
              return (
                <div 
                  key={index}
                  className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
                >
                  <span className="text-base mr-2">{flagEmoji}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatLanguage(lang)}
                  </span>
                </div>
              )
            })}
          </div>
          
          {/* Show more/less toggle */}
          {hasMoreLanguages && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 py-1"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show All Languages</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
} 