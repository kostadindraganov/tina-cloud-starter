"use client";
import React, { useState, useEffect } from "react";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { CasinoItemQueryQuery } from "@/tina/__generated__/types";
import MermaidElement from "@/components/mermaid-renderer";
import ASidePanel from "@/components/casino/ASidePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/ui/star-rating";
import Link from "next/link";

interface ClientCasinoProps {
  data: CasinoItemQueryQuery;
  variables: { relativePath: string };
  query: string;
}

export default function CasinoClientPage(props: ClientCasinoProps) {
  const { data } = useTina({ ...props });
  const casino = data.casino;
  const [activeTab, setActiveTab] = useState("overview");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    firstDeposit: false,
    minimumDeposit: false,
    wagering: false,
    process: false,
    freeSpins: false,
    freeSpinsConditions: false,
    terms: false
  });
  const [rating, setRating] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Run only on client after hydration
  useEffect(() => {
    setRating(convertToStarRating(casino.player_review_count ?? 0));
    setIsClient(true);
  }, [casino.player_review_count]);

  const convertToStarRating = (rating: number | undefined): number => {
    if (!rating) return 0
    // Convert 0-10 scale to 0-5 scale
    return rating / 2
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section с лого и креативен дизайн */}
      <div className="relative w-full mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_10px,transparent_10px,transparent_20px)] bg-repeat opacity-20"></div>
        
        <div className="relative flex items-center justify-between px-6 py-6 md:py-8 max-w-7xl mx-auto">
          <div className="flex items-center">
            {/* Използване на реално лого на казиното, ако е налично */}
      
            
            {/* Заглавие и рейтинг на казиното */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{casino.title}</h2>
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
      
                <div className="flex flex-col items-center bg-gradient-to-b from-green-500/70 to-green-700/70 backdrop-filter backdrop-blur-sm p-3 pt-2 rounded-xl shadow-lg border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-bold text-white whitespace-nowrap">Licensed</span>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-b from-blue-500/70 to-blue-700/70 backdrop-filter backdrop-blur-sm p-3 pt-2 rounded-xl shadow-lg border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-bold text-white whitespace-nowrap">Secure</span>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-b from-purple-500/70 to-purple-700/70 backdrop-filter backdrop-blur-sm p-3 pt-2 rounded-xl shadow-lg border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold text-white whitespace-nowrap">Verified</span>
                </div>
            
          </div>
        </div>
        
        {/* Декоративни елементи */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-blue-500 to-green-400"></div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex space-x-1">
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb Navigation - now between hero and content */}
      <div className="mx-auto w-full px-4 py-2 mb-4 ml-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-500 transition-colors">
            Home
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/casino" className="hover:text-green-600 dark:hover:text-green-500 transition-colors">
            Casinos
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-gray-200">{casino.title}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full gap-6 px-4">
        {/* A-SIDE panel - 1/3 width */}
        <div className="w-full md:w-1/4">
          <ASidePanel casino={casino} />
        </div>
        
        {/* Main content - 2/3 width */}
        <div className="w-full md:w-full p-8 mt-10">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="h-12 p-0 bg-transparent rounded-none flex overflow-x-auto gap-3 no-scrollbar">
                <TabsTrigger 
                  value="overview" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "overview" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-bold">Overview</span>
                  </div>
                  {activeTab === "overview" && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="bonuses" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "bonuses" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                    <span className="font-bold">Bonuses</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">5</span>
                  </div>
                  {activeTab === "bonuses" && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "reviews" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold">Reviews</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">72</span>
                  </div>
                  {activeTab === "reviews" && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="safety" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "safety" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Safety</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Info</span>
                  </div>
                  {activeTab === "safety" && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="discussion" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "discussion" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Discussion</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">144</span>
                  </div>
                  {activeTab === "discussion" && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "payment" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Payment</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">18</span>
                  </div>
                  {activeTab === "payment" && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="prose dark:prose-dark max-w-none mt-6">
              <TinaMarkdown
                content={casino._body}
                components={{
                  mermaid({ value }: { value: string }) {
                    return <MermaidElement value={value} />;
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="bonuses" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">Casino Bonuses</h2>
              {/* Използване на реални бонуси от данните, ако са налични */}
              {casino.bonuses && casino.bonuses.length > 0 ? (
                <div>
                  {casino.bonuses.map((bonus, index) => {
                    if (!bonus) return null;
                    return (
                      <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 mb-4">
                        <div className="flex flex-col">
                          {/* Бонус заглавие */}
                          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{bonus.title || "DEPOSIT BONUS"}</span>
                          </div>
                          
                          {/* Размер на бонуса */}
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bonus.bonus_amount || "100% up to €400"}</h3>
                            {bonus.extraInfo && <p className="text-gray-600 dark:text-gray-400 mt-1">{bonus.extraInfo}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Лява секция - детайли за бонуса */}
                            <div className="md:col-span-2 space-y-2">
                              {/* Показване на бонус детайли въз основа на наличната информация */}
                              {bonus.details && Array.isArray(bonus.details) && bonus.details.length > 0 ? (
                                bonus.details.map((detail, idx) => {
                                  if (!detail) return null;
                                  return (
                                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                                      <div 
                                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                                        onClick={() => toggleSection(`${index}_${idx}`)}
                                      >
                                        <div className="flex items-center gap-3">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d={detail.icon || "M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17z"} />
                                          </svg>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{detail.title}</span>
                                            {detail.subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{detail.subtitle}</p>}
                                          </div>
                                        </div>
                                        <svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openSections[`${index}_${idx}`] ? 'transform rotate-180' : ''}`} 
                                          viewBox="0 0 20 20" 
                                          fill="currentColor"
                                        >
                                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                      {openSections[`${index}_${idx}`] && detail.description && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                          <p className="text-sm text-gray-600 dark:text-gray-400">{detail.description}</p>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })
                              ) : (
                                // Ако няма детайли, показваме стандартните секции
                                <>
                                  {/* First deposit bonus */}
                                  <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                                    <div 
                                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                                      onClick={() => toggleSection('firstDeposit')}
                                    >
                                      <div className="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                        </svg>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">First deposit bonus</span>
                                      </div>
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openSections.firstDeposit ? 'transform rotate-180' : ''}`} 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                      >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    {openSections.firstDeposit && (
                                      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          This bonus is applied to your first deposit at the casino. The 100% match means the casino will double your initial deposit up to €400.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Тук продължаваме с останалите стандартни секции по същия начин */}
                                </>
                              )}
                            </div>

                            {/* Дясна секция - Как да получите бонуса */}
                            <div className="md:col-span-1">
                              <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-md bg-white dark:bg-gray-800">
                                <h4 className="text-center text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                                  {bonus.howToGetTitle || "HOW TO GET BONUS?"}
                                </h4>
                                <p className="text-center mb-4 text-gray-600 dark:text-gray-400">
                                  {bonus.howToGetDescription || "Activate bonus in your casino account"}
                                </p>
                                <a 
                                  href={bonus.bonusLink || "#"} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center gap-2 mb-5 transition-colors duration-200"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                  </svg>
                                  {bonus.bonusButtonText || "Get Bonus"}
                                </a>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                  <p className="text-center text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Has bonus worked for you?</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button className="flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 text-sm">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                      </svg>
                                      Yes
                                    </button>
                                    <button className="flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 text-sm">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                      </svg>
                                      No
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                // Ако няма реални бонуси, показваме стандартния бонус шаблон
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                  {/* Тук оставяме съществуващия код за бонус темплейта */}
                </div>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
              {/* Използване на реални отзиви */}
              {(casino.player_reviews || []).length > 0 ? (
                <div className="space-y-6">
                  {(casino.player_reviews || []).map((review, index) => {
                    if (!review) return null;
                    return (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            {review.avatar ? (
                              <img 
                                src={review.avatar} 
                                alt={review.username || "User"} 
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{review.username || "Anonymous User"}</h4>
                              <span className="text-sm text-gray-500">{review.date || "Recently"}</span>
                            </div>
                            <div className="flex items-center mt-1 mb-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg 
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className={`h-4 w-4 ${i < (review.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.content || "No review content available."}</p>
                            {review.pros && (
                              <div className="mt-3">
                                <h5 className="font-medium text-green-600 dark:text-green-500 text-sm">Pros:</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{review.pros}</p>
                              </div>
                            )}
                            {review.cons && (
                              <div className="mt-2">
                                <h5 className="font-medium text-red-600 dark:text-red-500 text-sm">Cons:</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{review.cons}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No reviews available for this casino yet.</p>
              )}
            </TabsContent>
            <TabsContent value="safety" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Safety Index Explained</h2>
              <p>Safety information will go here.</p>
            </TabsContent>
            <TabsContent value="discussion" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Discussion</h2>
              <p>Discussion content will go here.</p>
            </TabsContent>
            <TabsContent value="payment" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
              <p>Payment methods content will go here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
