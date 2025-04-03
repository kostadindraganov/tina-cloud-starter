"use client"

import Link from "next/link"
import { Sweepstakes } from "@/store"
import { BsArrowRight, BsStar, BsInfoCircle, BsTelephoneForwardFill, BsChevronDown } from "react-icons/bs"
import { FaGlobe, FaComments, FaPlusCircle, FaMinusCircle, FaEnvelope } from "react-icons/fa"
import { FcMoneyTransfer } from "react-icons/fc";
import { ImUserTie } from "react-icons/im";
import { StarRating } from "@/components/ui/star-rating"
import { MdStars } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { SweepstakesGamesMini } from "./sweepstakes-games-mini"
import { SweepstakesProvidersMini } from "./sweepstakes-providers-mini"

interface SweepstakesCardProps {
  sweepstakes: Sweepstakes
}

export function SweepstakesCard({ sweepstakes }: SweepstakesCardProps) {
  if (!sweepstakes) return null
  // Define safety index color based on rating
  const getSafetyColor = (rating: number | undefined) => {
    if (!rating) return "gray"
    if (rating >= 8) return "green"
    if (rating >= 6) return "yellow"
    return "red"
  }

  // Define safety level text
  const getSafetyLevel = (rating: number | undefined) => {
    if (!rating) return "UNKNOWN"
    if (rating >= 8) return "HIGH"
    if (rating >= 6) return "MEDIUM"
    return "LOW"
  }

  // Convert 0-10 rating scale to 0-5 stars
  const convertToStarRating = (rating: number | undefined): number => {
    if (!rating) return 0
    // Convert 0-10 scale to 0-5 scale
    return rating / 2
  }

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border-2 border-purple-600 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-600/20 hover:translate-y-[-4px] hover:scale-[1.01]">
      <div className="w-full md:w-[300px] bg-purple-600 flex items-center justify-center p-6 transition-all duration-300">
        {sweepstakes.logo ? (
          <img 
            src={sweepstakes.logo} 
            alt={`${sweepstakes.title} logo`}
            className="max-w-full w-full max-h-[300px] object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-gray-300 text-center">
            No logo available
          </div>
        )}
      </div>

      {/* Middle section - Sweepstakes details */}
      <div className="w-full md:w-2/4 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Sweepstakes name */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {sweepstakes.title}
        </h2>

        {/* Safety index */}
        <div className={`flex items-center mb-4 border-2 rounded-lg p-2 border-grey-700`}>
          <MdStars className="text-gray-700 dark:text-white mr-2" size={40} color="purple" />
          <span className="font-bold text-gray-700 dark:text-white">SAFETY INDEX:</span>
          <span className={`ml-2 font-bold text-2xl text-${getSafetyColor(sweepstakes.sweepstakes_review_count)}-500`}>
            {sweepstakes.sweepstakes_review_count ? (sweepstakes.sweepstakes_review_count % 1 === 0 ? Math.floor(sweepstakes.sweepstakes_review_count) : sweepstakes.sweepstakes_review_count.toFixed(1)) : '-'}
          </span>
          <span className={`ml-2 font-bold text-${getSafetyColor(sweepstakes.sweepstakes_review_count)}-500`}>
            {getSafetyLevel(sweepstakes.sweepstakes_review_count)}
          </span>
        </div>

        {/* User Rating with Star Rating Component */}
        <div className="flex items-center mb-4 border-2 border-solid border-gray-700 rounded-lg p-2 w-2/3 ">
            <ImUserTie className="text-gray-700 dark:text-white mr-2" size={20} />
            <span className="font-bold text-gray-700 dark:text-white mr-2">User Rating: </span>

            <StarRating 
              totalStars={5}
              defaultValue={convertToStarRating(sweepstakes.player_review_count)} 
              disabled={true}
              size="sm"
              className="mr-2"
            />
        </div>

        {/* Info points */}
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="text-gray-700 dark:text-gray-300">
              {sweepstakes.positives_negatives?.filter(item => 
                item.__typename === 'SweepstakesPositives_negativesPositives'
              ).slice(0, 2).map((positive, index) => (
                <div key={index} className="flex items-center mb-1">
                  <FaPlusCircle className="text-green-500 mr-2 flex-shrink-0" />
                  <p>{(positive as any).pros.length > 65 ? `${(positive as any).pros.substring(0, 65)}...` : (positive as any).pros}</p>

                </div>
              ))}
              {!sweepstakes.positives_negatives?.some(item => item.__typename === 'SweepstakesPositives_negativesPositives') && (
                <p>No sweepstakes advantages listed</p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="text-gray-700 dark:text-gray-300">
              {sweepstakes.positives_negatives?.filter(item => 
                item.__typename === 'SweepstakesPositives_negativesNegatives'
              ).slice(0, 2).map((negative, index) => (
                <div key={index} className="flex items-center mb-1">
                  <FaMinusCircle className="text-red-500 mr-2 flex-shrink-0" />
                  <p>{(negative as any).cons.length > 65 ? `${(negative as any).cons.substring(0, 65)}...` : (negative as any).cons}</p>
                </div>
              ))}
              {!sweepstakes.positives_negatives?.some(item => item.__typename === 'SweepstakesPositives_negativesNegatives') && (
                <p>No sweepstakes disadvantages listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Bonus info */}
        <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="text-2xl text-purple-500 mr-3">🎁</div>
            <div>
              <div className="font-bold text-xl text-gray-800 dark:text-white uppercase">
                {sweepstakes.bonuses?.[0]?.bonus_title || "No Bonus Available"}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4 mb-8">
          <Link 
            href={sweepstakes.sweepstakes_url || '#'} 
            className="group flex items-center justify-center py-3 px-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-600/50 active:shadow-sm transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            <BsArrowRight className="mr-2 transition-transform group-hover:translate-x-1" /> Visit Sweepstakes
          </Link>
          <Link 
            href={`/sweepstakes/${sweepstakes._sys.breadcrumbs.join("/")}`}
            className="group flex items-center justify-center py-3 px-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-green-600/50 active:shadow-sm transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0"
          >
            Read Review
          </Link>
        </div>
      </div>

      {/* Right side - Language options & Games */}
      <div className="w-full md:w-1/4 p-4 md:p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        {/* Language options */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">LANGUAGES</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <FaGlobe className="text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Website:</span>
              <span className="ml-2 text-purple-600">{ sweepstakes.language && sweepstakes.language[0]?.count || '0'} languages</span>
            </div>
          </div>
        </div>
        
        {/* Support options */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">Support methods</h3>
          
          <div className="space-y-3 flex items-center justify-start flex-wrap gap-2 text-xl">
            {sweepstakes.customer_support_methods?.map((method, index) => {
              switch(method.__typename) {
                case 'SweepstakesCustomer_support_methodsLive_chat':
                  return (
                    <div key={index} className="flex items-center">
                      <FaComments className="text-purple-600 dark:text-purple-400 mr-2" />
                    </div>
                  );
                case 'SweepstakesCustomer_support_methodsEmail':
                  return (
                    <div key={index} className="flex items-center">
                      <FaEnvelope className="text-purple-600 dark:text-purple-400 mr-2" />
                    </div>
                  );
                case 'SweepstakesCustomer_support_methodsPhone':
                  return (
                    <div key={index} className="flex items-center">
                      <BsTelephoneForwardFill className="text-purple-600 dark:text-purple-400 mr-2" />
                    </div>
                  );
                default:
                  return null;
              }
            })}
            {(!sweepstakes.customer_support_methods || sweepstakes.customer_support_methods.length === 0) && (
              <div className="text-gray-500 text-sm">No support methods available</div>
            )}
          </div>
        </div>
        
        {/* Payment methods */}
        {(sweepstakes.withdrawal_methods && sweepstakes.deposit_methods) && (
        
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">PAYMENTS</h3>
          {(sweepstakes.deposit_methods?.[0]?.count !== 0) && (
          <div className="flex items-center">
          <FcMoneyTransfer className="text-gray-600 dark:text-gray-400 mr-2"/>
          <span className="text-purple-600">{sweepstakes.deposit_methods?.[0]?.count || 0} deposit methods</span>
          </div>
          )}
          {(sweepstakes.withdrawal_methods?.[0]?.count !== 0) && (
          <div className="flex items-center mt-2">
          <FcMoneyTransfer className="text-gray-600 dark:text-gray-400 mr-2"/>
          <span className="text-purple-600">{sweepstakes.withdrawal_methods?.[0]?.count || 0} withdrawal methods</span>
          </div>
          )}
        </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">GAMES</h3>
          <SweepstakesGamesMini gameCategories={sweepstakes.game_categories} maxDisplay={3} />
        </div>

        <div className="mt-6">
          <SweepstakesProvidersMini softwareProviders={sweepstakes.software_providers} maxDisplay={1} />
        </div>
      </div>
    </div>
  )
} 