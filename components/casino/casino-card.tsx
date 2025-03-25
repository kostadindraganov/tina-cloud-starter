"use client"

import Link from "next/link"
import { Casino } from "@/store"
import { BsArrowRight, BsStar, BsInfoCircle, BsCheck, BsChevronDown } from "react-icons/bs"
import { FaGlobe, FaComments, FaHeadset } from "react-icons/fa"
import { IoMdAdd } from "react-icons/io"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import MermaidElement from "@/components/mermaid-renderer"

interface CasinoCardProps {
  casino: Casino
}

export function CasinoCard({ casino }: CasinoCardProps) {
  if (!casino) return null

  // Define safety index color based on rating
  const getSafetyColor = (rating: number | undefined) => {
    if (!rating) return "text-gray-500"
    if (rating >= 8) return "text-green-500"
    if (rating >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  // Define safety level text
  const getSafetyLevel = (rating: number | undefined) => {
    if (!rating) return "UNKNOWN"
    if (rating >= 8) return "HIGH"
    if (rating >= 6) return "MEDIUM"
    return "LOW"
  }

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border-2 border-green-600 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 dark:hover:shadow-purple-600/20 hover:translate-y-[-4px] hover:scale-[1.01]">
      {/* Left side - Casino logo */}
      <div className="w-full md:w-[500px] bg-green-600 flex items-center justify-center p-6 transition-all duration-300">
        {casino.logo ? (
          <img 
            src={casino.logo} 
            alt={`${casino.title} logo`}
            className="max-w-full w-full max-h-[500px] object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-gray-300 text-center">
            No logo available
          </div>
        )}
      </div>

      {/* Middle section - Casino details */}
      <div className="w-full md:w-2/4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Casino name */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {casino.title}
        </h2>

        {/* Safety index */}
        <div className="flex items-center mb-4">
          <BsStar className="text-gray-700 dark:text-white mr-2" size={20} />
          <span className="font-bold text-gray-700 dark:text-white">SAFETY INDEX:</span>
          <span className={`ml-2 font-bold ${getSafetyColor(casino.casino_review_count)}`}>
            {casino.casino_review_count ? (casino.casino_review_count % 1 === 0 ? Math.floor(casino.casino_review_count) : casino.casino_review_count.toFixed(1)) : '-'}
          </span>
          <span className={`ml-2 font-bold ${getSafetyColor(casino.casino_review_count)}`}>
            {getSafetyLevel(casino.casino_review_count)}
          </span>
        </div>

        {/* Info points */}
        <div className="space-y-3">
          {/* Live chat support */}
          <div className="flex items-start">
            <BsInfoCircle className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              Live chat support uses the auto-translate feature for some languages
            </p>
          </div>

          {/* Withdrawal limits - collapsible */}
          <div className="flex items-start">
            <BsInfoCircle className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-gray-700 dark:text-gray-300">
                  Maximum withdrawal limits on a deposit or deposit bonus are calculated based on the...
                </p>
                <BsChevronDown className="text-gray-500 ml-2 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Crypto payments */}
          <div className="flex items-start">
            <IoMdAdd className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              Deposits and withdrawals via cryptocurrencies
            </p>
          </div>

          {/* Promotions */}
          <div className="flex items-start">
            <IoMdAdd className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              The casino offers interesting promotions and tournaments
            </p>
          </div>
        </div>

        {/* Bonus info */}
        <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="text-2xl text-green-500 mr-3">🎁</div>
            <div>
              <div className="font-bold text-gray-800 dark:text-white">
                BONUS: 100% up to €400 and 100 extra spins (€0.2/spin)
              </div>
              <div className="text-blue-500 text-sm mt-1">*T&Cs apply</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Link 
            href={casino.casino_url || '#'} 
            className="group flex items-center justify-center py-3 px-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-green-600/50 active:shadow-sm transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            <BsArrowRight className="mr-2 transition-transform group-hover:translate-x-1" /> Visit Casino
          </Link>
          <Link 
            href={`/casino/${casino._sys.breadcrumbs.join("/")}`}
            className="group flex items-center justify-center py-3 px-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-600/50 active:shadow-sm transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            Read Review
          </Link>
        </div>
      </div>

      {/* Right side - Language options & Games */}
      <div className="w-full md:w-1/4 p-4 md:p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        {/* Language options */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">LANGUAGE OPTIONS</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <FaGlobe className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Website:</span>
              <span className="ml-2 text-blue-500">7 languages</span>
            </div>
            
            <div className="flex items-center">
              <FaComments className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Live chat:</span>
              <span className="ml-2 text-blue-500">7 languages</span>
            </div>
            
            <div className="flex items-center">
              <FaHeadset className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Customer support:</span>
              <span className="ml-2 text-blue-500">8 languages</span>
            </div>

            <div className="flex items-center">
              <FaHeadset className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Customer support:</span>
              <span className="ml-2 text-blue-500">8 languages</span>
            </div>
          </div>
        </div>
        

        
        {/* Payment methods */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">PAYMENTS</h3>
          <div className="flex items-center">
            <span className="mr-2">💳</span>
            <span className="text-blue-500">18 payment methods</span>
          </div>
        </div>
      </div>
    </div>
  )
} 