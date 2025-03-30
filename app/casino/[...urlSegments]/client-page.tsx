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
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/components/ui/disclosure";
import { CasinoGamesOverview } from "@/components/casino/casino-games-overview";
import { CasinoLanguages } from "@/components/casino/casino-languages";
import { CasinoSupportMethods } from "@/components/casino/casino-support-methods";
import { CasinoBonuses } from "@/components/casino/casino-bonuses";
import { CasinoPaymentMethods } from "@/components/casino/casino-payment-methods";
import { CasinoGallery } from "@/components/casino/casino-gallery";

interface ClientCasinoProps {
  data: CasinoItemQueryQuery;
  variables: { relativePath: string };
  query: string;
}

export default function CasinoClientPage(props: ClientCasinoProps) {
  const { data } = useTina({ ...props });
  const casino = data.casino;
  const [activeTab, setActiveTab] = useState("overview");
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

  return (
    <div className="flex flex-col w-full bg-[#f1f3f7]">
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
        <div className="w-full md:w-full p-8">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className=" p-4 bg-white rounded-xl flex overflow-x-auto gap-3 no-scrollbar shadow-sm">
                <TabsTrigger 
                  value="overview" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "overview" 
                      ? "bg-green-500 text-white font-medium shadow-md" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-bold">Overview</span>
                  </div>
                  {activeTab === "overview" && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20"></div>
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="bonuses" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "bonuses" 
                      ? "bg-green-500 text-white font-medium shadow-md" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                    <span className="font-bold">Bonuses</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">{casino.bonuses?.length || 0}</span>
                  </div>
                  {activeTab === "bonuses" && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20"></div>
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </TabsTrigger>
   
                <TabsTrigger 
                  value="payment" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "payment" 
                      ? "bg-green-500 text-white font-medium shadow-md" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Payment</span>
            
                  </div>
                  {activeTab === "payment" && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20"></div>
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </TabsTrigger>

                <TabsTrigger 
                  value="gallery" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "gallery" 
                      ? "bg-green-500 text-white font-medium shadow-md" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  } transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Gallery</span>
                    {casino.gallery && casino.gallery.length > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">{casino.gallery.length}</span>
                    )}
                  </div>
                  {activeTab === "gallery" && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20"></div>
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="prose dark:prose-dark max-w-none mt-6">
              {/* Combined Languages and Support Component */}
              <div className="mb-8 w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Languages & Customer Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CasinoLanguages 
                      languages={casino.language}
                    />
                  </div>
                  <div>
                    <CasinoSupportMethods 
                      supportMethods={casino.customer_support_methods || []}
                    />
                  </div>
                </div>
              </div>
              
              {/* Games Overview Component - more minimal */}
              <div className="mb-8 w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Games & Software Providers</h3>
                <CasinoGamesOverview 
                  gameCategories={casino.game_categories} 
                  softwareProviders={casino.software_providers}
                />
              </div>
              
              {/* Learn More Disclosure Component */}
              <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                
                <div className="space-y-4">
                  <Disclosure className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    <DisclosureTrigger>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Additional Information about {casino.title}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </DisclosureTrigger>
                    <DisclosureContent>
                      <div className="p-4 bg-white dark:bg-gray-950">
                        <TinaMarkdown
                          content={casino._body}
                          components={{
                            mermaid({ value }: { value: string }) {
                              return <MermaidElement value={value} />;
                            }
                          }}
                        />                        
                      </div>
                    </DisclosureContent>
                  </Disclosure>
                  
                  <Disclosure className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    <DisclosureTrigger>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Responsible Gambling</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </DisclosureTrigger>
                    <DisclosureContent>
                      <div className="p-4 bg-white dark:bg-gray-950">
                        <p className="text-gray-700 dark:text-gray-300">
                          {"This casino promotes responsible gambling by providing tools such as deposit limits, time-out periods, and self-exclusion options. Players are encouraged to gamble responsibly and seek help if gambling becomes problematic."}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="text-sm font-medium text-green-600">Verified Responsible Gambling Tools</span>
                        </div>
                      </div>
                    </DisclosureContent>
                  </Disclosure>
                  
                  <Disclosure className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    <DisclosureTrigger>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Terms & Conditions</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </DisclosureTrigger>
                    <DisclosureContent>
                      <div className="p-4 bg-white dark:bg-gray-950">
                        <p className="text-gray-700 dark:text-gray-300">
                          {"Before playing at this casino, please review the complete terms and conditions on their official website. These terms cover important aspects such as bonus requirements, withdrawal policies, and account management rules."}
                        </p>
                        <div className="mt-4">
                          <a 
                            href={casino.casino_url || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                          >
                            Visit official website for full terms
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </DisclosureContent>
                  </Disclosure>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bonuses" className="mt-6">
              <CasinoBonuses bonuses={casino.bonuses} />
            </TabsContent>
            <TabsContent value="payment" className="mt-6">
              <CasinoPaymentMethods 
                withdrawal_methods={casino.withdrawal_methods}
                deposit_methods={casino.deposit_methods}
                currencies={casino.currencies}
              />
            </TabsContent>
            <TabsContent value="gallery" className="mt-6">
              <CasinoGallery gallery={casino.gallery} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
