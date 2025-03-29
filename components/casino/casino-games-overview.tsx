"use client"

import React, { useState } from "react"
import { IoGameController } from "react-icons/io5"
import { FaCode } from "react-icons/fa"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface GameCategory {
  __typename?: string
  all_games_count?: number | null
  game_category?: (string | null)[] | null
}

interface SoftwareProvider {
  count?: number | null
  all_software_providers?: string | null
}

interface CasinoGamesOverviewProps {
  gameCategories?: (GameCategory | null)[] | null
  softwareProviders?: (SoftwareProvider | null)[] | null
  className?: string
}

export function CasinoGamesOverview({ gameCategories, softwareProviders, className }: CasinoGamesOverviewProps) {
  const [showAll, setShowAll] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const maxInitialDisplay = 8;
  const maxInitialProviders = 20;

  // Return early if no game categories data is available
  if ((!gameCategories || gameCategories.length === 0) && (!softwareProviders || softwareProviders.length === 0)) {
    return (
      <div className={cn("text-center p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm w-full md:w-1/2 mx-auto", className)}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No game information available</p>
      </div>
    )
  }

  // Process game categories
  const gameCategory = gameCategories?.[0];
  const hasGameData = gameCategory && gameCategory.game_category && gameCategory.game_category.length > 0;
  
  // Process software providers
  const provider = softwareProviders?.[0];
  const hasProviderData = provider && provider.all_software_providers;
  
  // Parse software providers into an array
  const providersArray = hasProviderData 
    ? provider.all_software_providers?.split(',').map(item => item.trim()).filter(Boolean) || [] 
    : [];
  
  // Game type icons mapping
  const gameIcons: Record<string, string> = {
    slots: "🎰",
    roulette: "🎡",
    blackjack: "🃏",
    betting: "🎲",
    video_poker: "🎮",
    bingo: "📋",
    baccarat: "🎭",
    jackpot_games: "💰",
    live_games: "📺",
    no_poker: "🎴",
    craps_dice: "🎲",
    keno: "🔢",
    scratch_cards: "🎟️",
    sports_betting: "⚽",
    esports_betting: "🏆",
    crash_games: "📈"
  }

  // Format game type label
  const formatGameType = (type: string | null): string => {
    if (!type) return "Unknown"
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Determine which games to display based on state
  const displayedGames = hasGameData && gameCategory?.game_category 
    ? (showAll ? gameCategory.game_category : gameCategory.game_category.slice(0, maxInitialDisplay))
    : [];

  const hasMoreGames = hasGameData && gameCategory?.game_category && gameCategory.game_category.length > maxInitialDisplay;
  
  // Determine which providers to display
  const displayedProviders = showAllProviders 
    ? providersArray 
    : providersArray.slice(0, maxInitialProviders);
    
  const hasMoreProviders = providersArray.length > maxInitialProviders;

  return (
    <div className={cn(" rounded-md shadow-sm overflow-hidden w-full mx-auto", className)}>
      <div className="flex flex-col md:flex-row w-full gap-8">
        {/* Games Column */}
        <div className={`w-full md:w-1/2 ${hasProviderData ? 'border-b md:border-b-0 ' : ''} border-gray-200 dark:border-gray-700  bg-white`}>
          {/* Games Header */}
          <div className=" bg-green-600 dark:bg-green-700 p-3 rounded-lg flex items-center justify-between border-b border-green-500 dark:border-green-600">
            <div className="flex items-center justify-center space-x-2">
              <IoGameController className="text-white dark:text-white text-lg" />
              <p className="font-medium p-0 text-sm text-white dark:text-white m-2">Games</p>
            </div>
            {gameCategory?.all_games_count && gameCategory.all_games_count > 0 && (
              <span className="text-white dark:text-white text-xs font-medium">
                {gameCategory.all_games_count}+ Games
              </span>
            )}
          </div>
          
          {/* Games List */}
          {hasGameData && (
            <div className="p-3">
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="mb-3 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-md h-8">
                  <TabsTrigger value="grid" className="text-xs h-6  border-gray-300 dark:border-gray-600 text-green-600 dark:text-green-400 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20">Grid</TabsTrigger>
                  <TabsTrigger value="list" className="text-xs h-6 text-green-600 dark:text-green-400 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20">List</TabsTrigger>
                </TabsList>
                
                {/* Grid View */}
                <TabsContent value="grid" className="mt-2">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {displayedGames && displayedGames.map((game, index) => (
                      <div 
                        key={index}
                        className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 transition-all duration-200"
                      >
                        <span className="text-lg mb-1">{game && gameIcons[game] ? gameIcons[game] : "🎮"}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">
                          {formatGameType(game)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Show more/less toggle */}
                  {hasMoreGames && (
                    <button 
                      onClick={() => setShowAll(!showAll)}
                      className="w-full mt-3 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center justify-center gap-1 py-1"
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
                          <span>Show All Games</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </TabsContent>
                
                {/* List View */}
                <TabsContent value="list" className="mt-2">
                  <div className="grid grid-cols-2 gap-1">
                    {gameCategory?.game_category && gameCategory.game_category.map((game, index) => (
                      <div 
                        key={index}
                        className="flex items-center py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors duration-150"
                      >
                        <span className="text-sm mr-1.5">{game && gameIcons[game] ? gameIcons[game] : "🎮"}</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                          {formatGameType(game)}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        
        {/* Software Providers Column */}
        {hasProviderData && (
          <div className="w-full md:w-1/2 bg-white">
            {/* Providers Header */}
            <div className="bg-green-600 dark:bg-green-700 rounded-lg p-3 flex items-center justify-between border-b border-green-500 dark:border-green-600">
              <div className="flex items-center justify-center space-x-2">
                <FaCode className="text-white dark:text-white text-sm" />
                <p className="font-medium p-0 text-sm text-white dark:text-white m-2">Software Providers</p>
              </div>
              {provider?.count && provider.count > 0 && (
                <span className="text-white dark:text-white text-xs font-medium">
                  {provider.count} Providers
                </span>
              )}
            </div>
            
            {/* Providers List - Simplified */}
            <div className="p-3">
              <div className="flex flex-wrap gap-1.5">
                {displayedProviders.map((providerName, index) => (
                  <div 
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-md border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 transition-all duration-150"
                  >
                    {providerName}
                  </div>
                ))}
              </div>
              
              {/* Show more/less toggle */}
              {hasMoreProviders && (
                <button 
                  onClick={() => setShowAllProviders(!showAllProviders)}
                  className="w-full mt-3 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center justify-center gap-1 py-1"
                >
                  {showAllProviders ? "Show Less" : "Show All Providers"}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAllProviders ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 