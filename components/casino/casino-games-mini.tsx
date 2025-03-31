"use client"

import React from "react"
import { IoGameController } from "react-icons/io5"
import { cn } from "@/lib/utils"

interface GameCategory {
  __typename?: string
  all_games_count?: number | null
  game_category?: (string | null)[] | null
}

interface CasinoGamesMiniProps {
  gameCategories?: (GameCategory | null)[] | null
  className?: string
  maxDisplay?: number
}

export function CasinoGamesMini({ gameCategories, className, maxDisplay = 4 }: CasinoGamesMiniProps) {
  // Return early if no game categories data is available
  if (!gameCategories || gameCategories.length === 0) {
    return null
  }

  // Get the first (and usually only) game category entry
  const gameCategory = gameCategories[0]
  
  if (!gameCategory || !gameCategory.game_category || gameCategory.game_category.length === 0) {
    return null
  }

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

  // Display only a limited number of game types
  const displayedGames = gameCategory.game_category.slice(0, maxDisplay)
  const remainingCount = Math.max(0, (gameCategory.game_category.length || 0) - maxDisplay)

  return (
    <div className={cn("", className)}>
      <div className="flex items-center mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center">
          <IoGameController className="text-gray-500 dark:text-gray-400 mr-1 text-sm" />
          {gameCategory.all_games_count && gameCategory.all_games_count > 0 && (
            <span>{gameCategory.all_games_count}+ games</span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {displayedGames.map((game, index) => (
          game && (
            <span 
              key={index}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300"
            >
              <span className="mr-0.5">{gameIcons[game] || "🎮"}</span>
              {game}
            </span>
          )
        ))}
        
        {/* Show count of remaining game types if any */}
        {remainingCount > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-xs text-purple-700 dark:text-purple-300">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  )
} 