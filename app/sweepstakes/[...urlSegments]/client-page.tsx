"use client";
import React, { useState, useEffect } from "react";
import { useTina } from "tinacms/dist/react";
import { SweepstakesItemQueryQuery } from "@/tina/__generated__/types";
import ASidePanel from "@/components/sweepstakes/ASidePanel";
import { StarRating } from "@/components/ui/star-rating";
import Link from "next/link";
import { SweepstakesBonuses } from "@/components/sweepstakes/sweepstakes-bonuses";
import { SweepstakesPaymentMethods } from "@/components/sweepstakes/sweepstakes-payment-methods";
import { SweepstakesGallery } from "@/components/sweepstakes/sweepstakes-gallery";
import { SweepstakesOverview } from "@/components/sweepstakes/sweepstakes-overview";

interface ClientSweepstakesProps {
  data: SweepstakesItemQueryQuery;
  variables: { relativePath: string };
  query: string;
}

export default function SweepstakesClientPage(props: ClientSweepstakesProps) {
  const { data } = useTina({ ...props });
  const sweepstakes = data.sweepstakes;
  const [activeTab, setActiveTab] = useState("overview");
  const [rating, setRating] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Run only on client after hydration
  useEffect(() => {
    setRating(convertToStarRating(sweepstakes.player_review_count ?? 0));
    setIsClient(true);
  }, [sweepstakes.player_review_count]);

  const convertToStarRating = (rating: number | undefined): number => {
    if (!rating) return 0
    // Convert 0-10 scale to 0-5 scale
    return rating / 2
  }

  return (
    <div className="flex flex-col w-full bg-[#f1f3f7]">
      {/* Hero Section с лого и креативен дизайн */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_10px,transparent_10px,transparent_20px)] bg-repeat opacity-20"></div>
        
        <div className="relative flex items-center justify-between px-6 py-6 md:py-8 max-w-7xl mx-auto">
          <div className="flex items-center">
            {/* Използване на реално лого на sweepstakes, ако е налично */}
      
            
            {/* Заглавие и рейтинг на sweepstakes */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{sweepstakes.title}</h2>
              <div className="flex items-center mt-1">
              <span className=" text-white dark:text-white mr-2">User Rating: </span>

                {isClient ? (
                  <StarRating 
                    totalStars={5}
                    defaultValue={rating}
                    disabled={true}
                    size="sm"
                    className="mr-2"
                  />
                ) : (
                  <div className="h-4 w-20 bg-gray-200 rounded"></div> // Placeholder
                )}
              </div>
            </div>
          </div>
          
          {/* Лицензионни значки */}
          <div className="hidden md:flex items-center space-x-3">
      
                <div className="flex flex-col items-center bg-gradient-to-b from-purple-500/70 to-purple-700/70 backdrop-filter backdrop-blur-sm p-3 pt-2 rounded-xl shadow-lg border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-bold text-white whitespace-nowrap">Licensed</span>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-b from-indigo-500/70 to-indigo-700/70 backdrop-filter backdrop-blur-sm p-3 pt-2 rounded-xl shadow-lg border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-bold text-white whitespace-nowrap">Secure</span>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-b from-violet-500/70 to-violet-700/70 backdrop-filter backdrop-blur-sm p-3 pt-2 rounded-xl shadow-lg border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold text-white whitespace-nowrap">Verified</span>
                </div>
            
          </div>
        </div>
        
        {/* Декоративни елементи */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-400"></div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex space-x-1">
            <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
            <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb Navigation - now between hero and content */}
      <div className="mx-auto w-full px-4 py-2 mb-4 ml-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-500 transition-colors">
            Home
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/sweepstakes" className="hover:text-purple-600 dark:hover:text-purple-500 transition-colors">
            Sweepstakes
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-gray-200">{sweepstakes.title}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full gap-6 px-8 md:px-4">
        {/* A-SIDE panel - 1/3 width */}
        <div className="w-full md:w-1/4">
          <ASidePanel sweepstakes={sweepstakes} />
        </div>
        
        {/* Main content - 2/3 width */}
        <div className="w-full md:w-full px-0 md:px-8 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`relative flex items-center justify-center p-4 rounded-xl shadow-sm transition-all duration-200 ${
                  activeTab === "overview" 
                    ? "bg-purple-500 text-white font-medium shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="font-bold">Overview</span>
                </div>
                {activeTab === "overview" && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-500/20"></div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
                  </div>
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab("bonuses")}
                className={`relative flex items-center justify-center p-4 rounded-xl shadow-sm transition-all duration-200 ${
                  activeTab === "bonuses" 
                    ? "bg-purple-500 text-white font-medium shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                  <span className="font-bold">Bonuses</span>
                  <span className="inline-flex items-center justify-center rounded-full bg-purple-100/80 dark:bg-purple-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-purple-800 dark:text-purple-300">{sweepstakes.bonuses?.length || 0}</span>
                </div>
                {activeTab === "bonuses" && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-500/20"></div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
                  </div>
                )}
              </button>

              <button 
                onClick={() => setActiveTab("payment")}
                className={`relative flex items-center justify-center p-4 rounded-xl shadow-sm transition-all duration-200 ${
                  activeTab === "payment" 
                    ? "bg-purple-500 text-white font-medium shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold">Payment</span>
                </div>
                {activeTab === "payment" && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-500/20"></div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
                  </div>
                )}
              </button>

              <button 
                onClick={() => setActiveTab("gallery")}
                className={`relative flex items-center justify-center p-4 rounded-xl shadow-sm transition-all duration-200 ${
                  activeTab === "gallery" 
                    ? "bg-purple-500 text-white font-medium shadow-md" 
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold">Gallery</span>
                  {sweepstakes.gallery && sweepstakes.gallery.length > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full bg-purple-100/80 dark:bg-purple-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-purple-800 dark:text-purple-300">{sweepstakes.gallery.length}</span>
                  )}
                </div>
                {activeTab === "gallery" && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-500/20"></div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
          
          {activeTab === "overview" && (
            <SweepstakesOverview sweepstakes={sweepstakes} />
          )}
          
          {activeTab === "bonuses" && (
            <div className="mt-6">
              <SweepstakesBonuses bonuses={sweepstakes.bonuses} />
            </div>
          )}
          
          {activeTab === "payment" && (
            <div className="mt-6">
              <SweepstakesPaymentMethods 
                withdrawal_methods={sweepstakes.withdrawal_methods}
                deposit_methods={sweepstakes.deposit_methods}
                currencies={sweepstakes.currencies}
              />
            </div>
          )}
          
          {activeTab === "gallery" && (
            <div className="mt-6">
              <SweepstakesGallery gallery={sweepstakes.gallery} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
