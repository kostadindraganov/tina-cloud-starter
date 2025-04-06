import React from "react";
import { CasinoItemQueryQuery } from "@/tina/__generated__/types";
import Link from "next/link";


interface ASidePanelProps {
  casino: CasinoItemQueryQuery["casino"];
}

export default function ASidePanel({ casino }: ASidePanelProps) {
  if (!casino) return null;

  const casinoTitle ="wQ4BbY?name=dsfsfsf";

  // Get safety level based on rating
  const getSafetyLevel = (rating: number | null | undefined) => {
    if (!rating) return "UNKNOWN";
    if (rating >= 8) return "HIGH";
    if (rating >= 6) return "MEDIUM";
    return "LOW";
  };

  // Get color based on rating
  const getSafetyColor = (rating: number | null | undefined) => {
    if (!rating) return "text-gray-500";
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    if (rating >= 4) return "text-orange-500";
    return "text-red-500";
  };

  // Define the user feedback type based on rating
  const getUserFeedback = (rating: number | null | undefined) => {
    if (!rating) return "UNKNOWN";
    if (rating >= 8) return "POSITIVE";
    if (rating >= 6) return "MIXED";
    if (rating >= 4) return "NEGATIVE";
    return "VERY NEGATIVE";
  };

  // Convert to star rating bar percentage
  const getRatingBarPercentage = (rating: number | null | undefined) => {
    if (!rating) return { positive: 0, neutral: 0, negative: 0 };
    
    // For simplicity in this example:
    const positive = rating >= 7 ? 60 : rating >= 5 ? 30 : 10;
    const negative = rating <= 3 ? 60 : rating <= 5 ? 30 : 10;
    const neutral = 100 - positive - negative;
    
    return { positive, neutral, negative };
  };

  const ratingBars = getRatingBarPercentage(casino.player_review_count);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-10">
      {/* Casino Title */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
      <div className="w-full flex items-center justify-center p-6 transition-all duration-300">
        {casino.logo ? (
          <img 
            src={casino.logo} 
            alt={`${casino.title} logo`}
            className="max-w-full w-full max-h-[200px] object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-gray-300 text-center">
            No logo available
          </div>
        )}
         </div>
      </div>

      {/* Rating Box */}
      <div className="relative ">
        <div className="flex">
          {/* Left side - Rating number */}
          <div className="w-1/2 bg-green-500 p-8 flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-white">
              {casino.casino_review_count ? 
                (casino.casino_review_count % 1 === 0 
                  ? casino.casino_review_count 
                  : casino.casino_review_count.toFixed(1)) 
                : '8.6'}
            </div>
            <div className="text-2xl font-medium text-white">/10</div>
          </div>
          
          {/* Right side - Safety Index */}
          <div className="w-1/2 bg-white dark:bg-gray-800 p-4 flex flex-col justify-center ">
            <div className="text-center">
              <div className={"uppercase text-2xl font-bold  text-grey-500"}>
                SAFETY INDEX
              </div>
              <div className={`uppercase text-3xl font-bold ${getSafetyColor(casino.casino_review_count || 8.6)} mt-2`}>
                {getSafetyLevel(casino.casino_review_count || 8.6)}
              </div>
         
            </div>
          </div>
        </div>
        
        {/* Star icon overlay */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 border-4 border-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </div>

      {/* User Feedback */}
      <div className="p-6 border-y border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              User Rating
            </span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = casino.player_review_count ?? 0;
                const starValue = rating / 2;
                const isFullStar = starValue >= star;
                const isHalfStar = !isFullStar && starValue >= star - 0.5;
                
                return (
                  <span key={star} className="relative inline-block mr-1 group cursor-pointer transition-transform hover:scale-110">
                    {/* Empty star (background) */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-gray-300"
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    
                    {/* Full or half star (overlay) */}
                    {(isFullStar || isHalfStar) && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="absolute top-0 left-0 h-6 w-6 text-yellow-400"
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ 
                          clipPath: isHalfStar 
                            ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' 
                            : undefined 
                        }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </span>
                );
              })}
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                ({casino.player_review_count ? 
                  (casino.player_review_count % 1 === 0 
                    ? casino.player_review_count 
                    : casino.player_review_count.toFixed(1)) 
                  : '0'}/10)
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Based on trusted user reviews
            </div>
          </div>
        </div>
      </div>

      {/* Visit Casino Button */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          href={casino.casino_url || "#"}
          className="flex items-center justify-center py-4 px-6 w-full bg-green-500 hover:bg-green-600 text-white hover:text-white text-xl font-bold rounded-md transition-all duration-300 relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></span>
          <span className="relative flex items-center justify-center z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Visit Casino
          </span>
        </Link>
      </div>



  
    {/*  Write a review */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="#"
          data-tally-open="wQ4BbY" data-ref={casino.title} data-tally-align-left="1" data-tally-emoji-text="👋" data-tally-emoji-animation="wave" data-tally-auto-close="3000"
          className="group flex items-center justify-center py-3 px-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-600/50 active:shadow-sm transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
        >
          Write a review
        </Link>



      </div>

      {/* Withdrawal Limits */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase mb-4 font-semibold tracking-wider">WITHDRAWAL LIMITS</h3>
        
        <div className="flex justify-between">
          <div className="text-center flex-1">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily</div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_day || "€0"}
            </div>
          </div>
          
          <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
          
          <div className="text-center flex-1">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Weekly</div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_week || "€0"}
            </div>
          </div>
          
          <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
          
          <div className="text-center flex-1">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Monthly</div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_month || "€0"}
            </div>
          </div>
        </div>
      </div>

      {/* Casino Info Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Owner */}
          <div className="group">
            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
              OWNER
            </div>
             <Link
              href={casino.owner_company_url || "#"} 
              target="_blank"
              >
            <div className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {casino.owner || "Versus Odds B.V."}
            </div>
            </Link>
          </div>

          {/* Established */}
          <div className="group">
            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
              ESTABLISHED
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {casino.year_established ? 
                (typeof casino.year_established === 'string' ? 
                  new Date(casino.year_established).getFullYear() : 
                  new Date(casino.year_established).getFullYear()) : 
                "2024"}
            </div>
          </div>
        </div>
      </div>

      {/* Licensing Authorities */}
      <div className="p-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-wider font-semibold">
          LICENSING AUTHORITIES
        </div>
        {casino.authorities && casino.authorities[0]?.all_authorities ? (
          <div className="flex flex-wrap gap-1.5">
            {casino.authorities[0].all_authorities.split(',').map((authority, index) => (
              <div 
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800/30 
                          rounded text-xs text-gray-600 dark:text-gray-400 
                          hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {authority.trim()}
              </div>
            ))}
          </div>
        ) : (
          <div className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800/30 
                        rounded text-xs text-gray-600 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            N/A
          </div>
        )}
      </div>

       {/* Browse Recommended Casinos */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/casino"
          className="block w-full py-4 text-center text-gray-700 dark:text-gray-400 border-2 border-gray-700 dark:border-gray-400 rounded-md text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-900/20 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300"
        >
          Browse recommended casinos
        </Link>
      </div>

    </div>
  );
} 