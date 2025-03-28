import React from "react";
import { CasinoItemQueryQuery } from "@/tina/__generated__/types";
import Link from "next/link";
import { BsInfoCircle, BsCreditCard2Front } from "react-icons/bs";
import { FaApplePay, FaCcVisa, FaCcMastercard, FaCcPaypal, FaBitcoin, FaUniversity } from "react-icons/fa";
import { TbCashBanknote } from "react-icons/tb";

interface ASidePanelProps {
  casino: CasinoItemQueryQuery["casino"];
}

export default function ASidePanel({ casino }: ASidePanelProps) {
  if (!casino) return null;

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

  const ratingBars = getRatingBarPercentage(casino.casino_review_count);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Casino Title */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
      <div className="w-full md:w-[300px] flex items-center justify-center p-6 transition-all duration-300">
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
      <div className="relative">
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
          <div className="w-1/2 bg-white dark:bg-gray-800 p-4 flex flex-col justify-center">
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
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-gray-800 dark:text-white">USER FEEDBACK:</span>
          <span className="text-xl font-bold text-gray-800 dark:text-white">{getUserFeedback(casino.player_review_count || 6)}</span>
          <div className="relative">
            <BsInfoCircle className="text-gray-500 cursor-pointer" size={24} />
          </div>
        </div>
        
        {/* Rating Bars */}
        <div className="flex h-4 mb-2 overflow-hidden">
          <div className="bg-green-500" style={{ width: `${ratingBars.positive}%` }}></div>
          <div className="bg-yellow-500" style={{ width: `${ratingBars.neutral}%` }}></div>
          <div className="bg-red-500" style={{ width: `${ratingBars.negative}%` }}></div>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400">
          Rated by {casino.player_review_count ? Math.round(casino.player_review_count) : '72'} users
        </div>
      </div>

      {/* Visit Casino Button */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          href={casino.casino_url || "#"}
          className="flex items-center justify-center py-4 px-6 w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-md transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Visit Casino
        </Link>
      </div>

      {/* Browse Recommended Casinos */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/casino"
          className="block w-full py-4 text-center text-purple-700 dark:text-purple-400 border-2 border-purple-700 dark:border-purple-400 rounded-md text-lg font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300"
        >
          Browse recommended casinos
        </Link>
      </div>

      {/* Payment Methods */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white uppercase">PAYMENT METHODS</h3>
          <button className="text-blue-500 hover:text-blue-700">
            Show all (18)
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {/* Payment Icons as SVGs */}
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <BsCreditCard2Front className="w-12 h-8 text-purple-700" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <FaCcPaypal className="w-12 h-8 text-blue-600" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <TbCashBanknote className="w-12 h-8 text-green-600" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <FaCcMastercard className="w-12 h-8 text-orange-600" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <FaCcVisa className="w-12 h-8 text-blue-700" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <FaBitcoin className="w-12 h-8 text-yellow-500" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <FaUniversity className="w-12 h-8 text-gray-700" />
          </div>
          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
            <FaApplePay className="w-12 h-8 text-black dark:text-white" />
          </div>
        </div>
      </div>

      {/* Withdrawal Limits */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white uppercase mb-4">WITHDRAWAL LIMITS</h3>
        
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-400">per day</div>
          <div className="text-4xl font-bold text-gray-800 dark:text-white">
            {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_day || "€1,000"}
          </div>
        </div>
      </div>
    </div>
  );
} 