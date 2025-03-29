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
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { BsInfoCircle, BsCreditCard2Front } from "react-icons/bs";
import { FaApplePay, FaCcVisa, FaCcMastercard, FaCcPaypal, FaBitcoin, FaUniversity } from "react-icons/fa";
import { TbCashBanknote } from "react-icons/tb";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  // Prepare gallery items for lightbox
  const gallerySlides = casino.gallery?.filter(Boolean).map((item) => ({
    src: item?.image || '',
    alt: item?.title || '',
    title: item?.title || '',
    description: `Image ${item?.title || ''}`,
  })) || [];
  
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  
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

                <TabsTrigger 
                  value="gallery" 
                  className={`relative h-10 px-5 flex items-center justify-center rounded-lg ${
                    activeTab === "gallery" 
                      ? "bg-green-500 text-white font-medium shadow-sm" 
                      : "bg-transparent text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-emerald-500"></div>
                    </div>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="prose dark:prose-dark max-w-none mt-6">
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
              <h2 className="text-2xl font-bold mb-6">Casino Bonuses</h2>
              {/* Using real bonuses data if available */}
              {casino.bonuses && casino.bonuses.length > 0 ? (
                <div>
                  {casino.bonuses.map((bonus, index) => {
                    if (!bonus) return null;
                    return (
                      <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 mb-4">
                        <div className="flex flex-col">
                          {/* Bonus title */}
                          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{bonus.bonus_title || "DEPOSIT BONUS"}</span>
                          </div>
                          
                          {/* Bonus amount */}
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bonus.bonus_code || "100% up to €400"}</h3>
                            {bonus.bonus_description && <p className="text-gray-600 dark:text-gray-400 mt-1">{bonus.bonus_description}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left section - bonus details */}
                            <div className="md:col-span-2 space-y-2">
                              {/* Show standard sections as there are no detailed bonus properties */}
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
                                      {bonus.bonus_description || "This bonus is applied to your first deposit at the casino. The casino will match your initial deposit up to the specified amount."}
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Additional standard sections can be added here if needed */}
                            </div>

                            {/* Right section - How to get the bonus */}
                            <div className="md:col-span-1">
                              <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-md bg-white dark:bg-gray-800">
                                <h4 className="text-center text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                                  HOW TO GET BONUS?
                                </h4>
                                <p className="text-center mb-4 text-gray-600 dark:text-gray-400">
                                  Activate bonus in your casino account
                                </p>
                                <a 
                                  href={bonus.bonus_link || "#"} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center gap-2 mb-5 transition-colors duration-200"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                  </svg>
                                  Get Bonus
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
                <p className="text-gray-600 dark:text-gray-400">No bonuses available for this casino.</p>
              )}
            </TabsContent>
            <TabsContent value="payment" className="mt-6">
             
                    
              {/* Payment Methods */}
              <div className="p-6">
                <div className="flex justify-between gap-4 items-center mb-4">
                  <h3 className="text-lg font-bold text-red-800 dark:text-white uppercase">withdrawal methods</h3>

                </div>
                               {/* Withdrawal Limits */}
                               {(casino.withdrawal_methods?.[0]?.withdrawal_limit_per_day || 
                  casino.withdrawal_methods?.[0]?.withdrawal_limit_per_week || 
                  casino.withdrawal_methods?.[0]?.withdrawal_limit_per_month) && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_day && (
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Daily</span>
                          <span className="text-xl font-bold text-gray-800 dark:text-white">{casino.withdrawal_methods[0].withdrawal_limit_per_day}</span>
                        </div>
                      )}
                      
                      {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_week && (
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Weekly</span>
                          <span className="text-xl font-bold text-gray-800 dark:text-white">{casino.withdrawal_methods[0].withdrawal_limit_per_week}</span>
                        </div>
                      )}
                      
                      {casino.withdrawal_methods?.[0]?.withdrawal_limit_per_month && (
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Monthly</span>
                          <span className="text-xl font-bold text-gray-800 dark:text-white">{casino.withdrawal_methods[0].withdrawal_limit_per_month}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-6 border-y border-gray-200 dark:border-gray-700">
                <h4 className=" text-lg text-gray-600 dark:text-gray-300 uppercase">      
                    {casino.withdrawal_methods?.[0]?.all_withdrawal_methods} 
                </h4> 
                </div>
                
 
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="mt-6">
              <h2 className="text-2xl font-bold mb-6">Casino Gallery</h2>
              
              {casino.gallery && casino.gallery.length > 0 ? (
                <div className="gallery-grid">
                  {casino.gallery.map((item, index) => {
                    if (!item) return null;
                    return (
                      <div 
                        key={index} 
                        className="gallery-item"
                        onClick={() => openLightbox(index)}
                      >
                        <div className="relative w-full h-64">
                          <Image
                            src={item.image || ''}
                            alt={item.title || `Casino image ${index + 1}`}
                            fill
                            className="gallery-item-image"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="gallery-item-overlay">
                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full w-8 h-8 backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                                  <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                            {item.title && (
                              <div className="gallery-item-caption">
                                <h3 className="text-sm font-medium truncate">{item.title}</h3>
                                <p className="text-xs text-gray-300 mt-1">Click to enlarge</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No gallery images available for this casino.</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Check back later for visual updates.</p>
                </div>
              )}
              
              {/* Lightbox component */}
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={gallerySlides}
                plugins={[Zoom, Captions, Thumbnails]}
                zoom={{
                  maxZoomPixelRatio: 3,
                  zoomInMultiplier: 2,
                }}
                captions={{
                  showToggle: true,
                  descriptionTextAlign: "center",
                  descriptionMaxLines: 3,
                }}
                thumbnails={{
                  position: "bottom",
                  width: 120,
                  height: 80,
                  gap: 16,
                  padding: 4,
                  showToggle: true,
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
