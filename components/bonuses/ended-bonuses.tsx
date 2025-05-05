"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useTina } from "tinacms/dist/react";
import { BsCalendar } from "react-icons/bs";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import client from "@/tina/__generated__/client";
import {
  BonusesConnectionQuery as GeneratedBonusesConnectionQuery,
  BonusesConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { useLayout } from "@/components/layout/layout-context";
import MermaidElement from "@/components/mermaid-renderer";
import { IoCheckmark, IoCopy, IoGift, IoStarOutline } from "react-icons/io5";
import { FaCoins } from "react-icons/fa6";
import { FaCalendarTimes } from "react-icons/fa";

export default function EndedBonuses() {
  const [bonusesData, setBonusesData] = useState<{
    data: GeneratedBonusesConnectionQuery;
    variables: BonusesConnectionQueryVariables;
    query: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(4);
  const [expandedExcerpts, setExpandedExcerpts] = useState<{ [key: string]: boolean }>({});
  const [copiedCodes, setCopiedCodes] = useState<{ [key: string]: boolean }>({});
  const { theme } = useLayout();
  
  useEffect(() => {
    async function fetchBonuses() {
      try {
        setLoading(true);
            let posts = await client.queries.bonusesConnection({
          sort: "end_date",
          // Using descending order by fetching more recent dates first
        });
        const allPosts = posts;

        while (posts.data?.bonusesConnection.pageInfo.hasNextPage) {
          posts = await client.queries.bonusesConnection({
            sort: "end_date",
            after: posts.data.bonusesConnection.pageInfo.endCursor,
          });
          
          if (posts.data.bonusesConnection.edges && allPosts.data.bonusesConnection.edges) {
            allPosts.data.bonusesConnection.edges.push(...posts.data.bonusesConnection.edges);
          }
        }
        
        // Sort the entries by end_date in descending order (most recent first)
        if (allPosts.data?.bonusesConnection?.edges) {
          allPosts.data.bonusesConnection.edges.sort((a, b) => {
            if (!a?.node?.end_date || !b?.node?.end_date) return 0;
            return new Date(b.node.end_date).getTime() - new Date(a.node.end_date).getTime();
          });
        }
        
        setBonusesData(allPosts);
      } catch (error) {
        console.error("Error fetching bonuses:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBonuses();
  }, []);
  
  // Use the fetched data or fallback to empty object
  const tinaData = useTina(bonusesData || { 
    data: {} as GeneratedBonusesConnectionQuery, 
    variables: {} as BonusesConnectionQueryVariables,
    query: ""
  });
  const data = tinaData.data;
  
  // Get current date
  const currentDate = new Date();

    // Add reset copied status after 2 seconds
    useEffect(() => {
      const timeouts: { [key: string]: NodeJS.Timeout } = {};
      
      Object.keys(copiedCodes).forEach((id) => {
        if (copiedCodes[id]) {
          timeouts[id] = setTimeout(() => {
            setCopiedCodes(prev => ({ ...prev, [id]: false }));
          }, 2000);
        }
      });
  
      return () => {
        Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
      };
    }, [copiedCodes]);
  
    const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
      e.preventDefault(); // Prevent link navigation
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCodes(prev => ({ ...prev, [id]: true }));
      });
    };

  const handleLoadMore = () => {
    setVisibleItems(prevCount => prevCount + 16);
  };
  
  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-white mb-6">Ended Bonuses</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading Bonuses...
        </p>
      </div>
    );
  }
  
  // Filter Bonuses to only include ended ones
  const endedBonuses = data?.bonusesConnection?.edges?.filter((postData) => {
    if (!postData || !postData.node) return false;
    const post = postData.node;
    
    // Parse end date
    const endDate = post.end_date ? new Date(post.end_date) : null;
    
    // Check if current date is after the end date
    const isEnded = endDate ? currentDate > endDate : false;
    
    return isEnded;
  });
  
  // If no ended Bonuses, show a message
  if (!endedBonuses || endedBonuses.length === 0) {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-white mb-6">Ended Bonuses</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          There are currently no ended bonuses in our records.
        </p>
      </div>
    );
  }

  // Get the visible Bonuses based on the current visible count
  const visibleBonuses = endedBonuses.slice(0, visibleItems);
  const hasMoreItems = endedBonuses.length > visibleItems;

  return (
    <div className="w-full">
      <h1 className="text-4xl font-semibold text-gray-700 dark:text-white mb-6">Ended Bonuses</h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
      Down below, you can have a look at the recently ended Bonuses. You can check out the prize pool, who were the winners, how many tickets they bought and the total number of tickets sold.      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleBonuses.map((postData) => {
          if (!postData || !postData.node) return null;
          const post = postData.node;
          
          const endDate = new Date(post.end_date || "");
          let formattedEndDate = "";
          if (!isNaN(endDate.getTime())) {
            formattedEndDate = format(endDate, "MMM dd, yyyy");
          }
          

          
        return (
          <div 
          className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 group"
          key={post.id}
        >
          {post.logo && (
               <div className="relative w-full h-48 overflow-hidden">
               <div className="absolute bottom-0 right-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
                 <span className="text-md text-white font-bold px-4 py-2 bg-purple-600 bg-opacity-85">
                   ENDED
                 </span>
               </div>
              <Image
                fill
                priority
                sizes="(max-width: 360px) 100vw, 100vw"
                src={post.logo}
                alt={post.title || "Bonuses"}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA..."
                className="object-cover w-full h-full filter grayscale transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {post.bonus_amount && (
              <div className="absolute top-0 left-0 bg-yellow-400 text-gray-900 px-3 py-1.5 0 text-md font-bold shadow-lg flex items-center gap-2">
                <FaCoins className="w-4 h-4" />
                <span>BONUS:</span>
                <span>{post.bonus_amount || "0"}</span>
              </div>
              )}
     
            </div>
          )}
          
          <div className="p-3 pt-5 flex-grow">
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
              <FaCalendarTimes   className="w-4 h-4 mr-2" />
              <span className="text-sm text-grey-500 dark:text-red-400">Ended on {formattedEndDate || "Dec 31, 2024"}</span>
              </div>
            
            <h3 className="text-gray-800 dark:text-white text-xl font-bold my-2 line-clamp-3">
              {post.title} 
            </h3>
            {post.bonus_title && (
            <h4 className="text-purple-400 dark:text-white text-lg font-bold my-2 line-clamp-3 flex items-center gap-2">
            <IoGift className="w-8 h-8 mr-" />
            <span >{post.bonus_title} </span>
            </h4>
            )}
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-2 mb-4 p-2">{post.bonus_type}</span>

            {post.bonus_code && (
                <div className=" bg-yellow-400  border-2 border-yellow-500  my-4 text-gray-600 py-4 rounded-md text-lg font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer"  onClick={(e) => handleCopyCode(e, post.bonus_code || "", post.id)}>
                  <span className="text-white mr-4">Bonus code:</span>
                  <span className="font-bold text-purple-600">{post.bonus_code}</span>
                  <button
                    onClick={(e) => handleCopyCode(e, post.bonus_code || "", post.id)}
                    className="ml-1 p-1 hover:bg-yellow-500 rounded transition-colors text-white"
                    title="Copy bonus code"
                  >
                    {copiedCodes[post.id] ? (
                      <IoCheckmark className="w-6 h-6 text-purple-600" />
                    ) : (
                      <IoCopy className="w-6 h-6 " />
                    )}
                  </button>
                </div>
              )}
            
            {post.excerpt && (
              <div className="text-gray-400 dark:text-gray-300 mb-5 relative">
                <div className={`${!expandedExcerpts[post.id] ? 'h-0 overflow-hidden' : ''}`}>
                  <TinaMarkdown 
                    content={post.excerpt}
                    components={{
                      mermaid({ value }: { value: string }) {
                        return <MermaidElement value={value} />;
                      }
                    }}
                  />
                </div>
                {post.excerpt && (
                  <div className="flex items-center justify-center">

                 
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setExpandedExcerpts(prev => ({
                        ...prev,
                        [post.id]: !prev[post.id]
                      }));
                    }}
                    className="text-grey-600 dark:text-green-400 text-sm font-medium hover:text-green-700 dark:hover:text-green-300 mt-2 flex items-center gap-1"
                  >
                    {expandedExcerpts[post.id] ? (
                      <>
                        <span>Show Less</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>More info</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                   </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col text-lg border-t border-gray-100 dark:border-gray-800 mt-auto">
            <div className="flex w-full gap-1 p-0">
              <Link 
                href={post.affiliate_url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-4 transition-colors duration-300 flex items-center justify-center">
                  <IoGift className="w-4 h-4 mr-2" />
                  Claim
                </button>
              </Link>
              <Link 
                href={post.areview_url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full bg-purple-600 hover:bg-purple-800 text-white font-bold py-6 px-4  transition-colors duration-300 flex items-center justify-center">
                  <IoStarOutline className="w-4 h-4 mr-2" />
                  Review
                </button>
              </Link>
            </div>
          </div>
        </div>
          );
        })}
      </div>

      {hasMoreItems && (
        <div className="flex justify-center mt-20 mb-10">
          <button
            onClick={handleLoadMore}
            className="bg-transparent border border-green-500 text-green-600 dark:text-green-400 font-medium py-3 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 hover:-translate-y-1 hover:border-green-600 dark:hover:border-green-400"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 