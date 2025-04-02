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
  SweepstakesConnectionQuery as GeneratedSweepstakesConnectionQuery,
  SweepstakesConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { useLayout } from "@/components/layout/layout-context";
import MermaidElement from "@/components/mermaid-renderer";
import { IoStarOutline } from "react-icons/io5";
import { FaCoins } from "react-icons/fa6";

export default function EndedSweepstakes() {
  const [sweepstakesData, setSweepstakesData] = useState<{
    data: GeneratedSweepstakesConnectionQuery;
    variables: SweepstakesConnectionQueryVariables;
    query: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(4);
  const { theme } = useLayout();
  
  useEffect(() => {
    async function fetchSweepstakes() {
      try {
        setLoading(true);
        let posts = await client.queries.sweepstakesConnection({
          sort: "end_date",
          // Using descending order by fetching more recent dates first
        });
        const allPosts = posts;

        while (posts.data?.sweepstakesConnection.pageInfo.hasNextPage) {
          posts = await client.queries.sweepstakesConnection({
            sort: "end_date",
            after: posts.data.sweepstakesConnection.pageInfo.endCursor,
          });
          
          if (posts.data.sweepstakesConnection.edges && allPosts.data.sweepstakesConnection.edges) {
            allPosts.data.sweepstakesConnection.edges.push(...posts.data.sweepstakesConnection.edges);
          }
        }
        
        // Sort the entries by end_date in descending order (most recent first)
        if (allPosts.data?.sweepstakesConnection?.edges) {
          allPosts.data.sweepstakesConnection.edges.sort((a, b) => {
            if (!a?.node?.end_date || !b?.node?.end_date) return 0;
            return new Date(b.node.end_date).getTime() - new Date(a.node.end_date).getTime();
          });
        }
        
        setSweepstakesData(allPosts);
      } catch (error) {
        console.error("Error fetching sweepstakes:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSweepstakes();
  }, []);
  
  // Use the fetched data or fallback to empty object
  const tinaData = useTina(sweepstakesData || { 
    data: {} as GeneratedSweepstakesConnectionQuery, 
    variables: {} as SweepstakesConnectionQueryVariables,
    query: ""
  });
  const data = tinaData.data;
  
  // Get current date
  const currentDate = new Date();

  const handleLoadMore = () => {
    setVisibleItems(prevCount => prevCount + 16);
  };
  
  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-white mb-6">Ended Sweepstakes</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading sweepstakes...
        </p>
      </div>
    );
  }
  
  // Filter sweepstakes to only include ended ones
  const endedSweepstakes = data?.sweepstakesConnection?.edges?.filter((postData) => {
    if (!postData || !postData.node) return false;
    const post = postData.node;
    
    // Parse end date
    const endDate = post.end_date ? new Date(post.end_date) : null;
    
    // Check if current date is after the end date
    const isEnded = endDate ? currentDate > endDate : false;
    
    return isEnded;
  });
  
  // If no ended sweepstakes, show a message
  if (!endedSweepstakes || endedSweepstakes.length === 0) {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-semibold text-gray-700 dark:text-white mb-6">Ended Sweepstakes</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          There are currently no ended sweepstakes in our records.
        </p>
      </div>
    );
  }

  // Get the visible sweepstakes based on the current visible count
  const visibleSweepstakes = endedSweepstakes.slice(0, visibleItems);
  const hasMoreItems = endedSweepstakes.length > visibleItems;

  return (
    <div className="w-full">
      <h1 className="text-4xl font-semibold text-gray-700 dark:text-white mb-6">Ended Sweepstakes</h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
      Down below, you can have a look at the recently ended sweepstakes. You can check out the prize pool, who were the winners, how many tickets they bought and the total number of tickets sold.      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleSweepstakes.map((postData) => {
          if (!postData || !postData.node) return null;
          const post = postData.node;
          
          const endDate = new Date(post.end_date || "");
          let formattedEndDate = "";
          if (!isNaN(endDate.getTime())) {
            formattedEndDate = format(endDate, "MMM dd, yyyy");
          }
          
         // Extract level requirement from eligibility or other fields
         const levelRequirement = post.eligibility || "all";
         // Extract cost value
         const costValue = post.costs || "Free";
          
          return (
            <Link 
              href={`/sweepstakes/` + post._sys.breadcrumbs.join("/")}
              className="block h-full"
              key={post.id}
            >
            <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 opacity-80 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 group">
              {post.heroImg && (
                <div className="relative w-full h-64 overflow-hidden">
                  <div className="absolute top-0 right-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
                    <span className="text-md text-white font-bold px-4 py-2 bg-purple-600 bg-opacity-85 rounded-md">
                      ENDED
                    </span>
                  </div>
                  <Image
                    fill
                    priority
                    sizes="(max-width: 360px) 100vw, 100vw"
                    src={post.heroImg}
                    alt={post.title || "Sweepstakes"}
                    className="object-cover w-full h-full filter grayscale transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}
              
              <div className="p-4 pt-5 pb-0 flex-grow">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <BsCalendar className="w-4 h-4 mr-2" />
                  <span className="text-sm text-red-600 dark:text-red-400">Ended on {formattedEndDate || "Dec 31, 2024"}</span>
                </div>
                
                <h3 className="text-gray-800 dark:text-white text-xl font-bold mb-2 line-clamp-3">
                  {post.title} 
                </h3>
                
                {post.excerpt && (
                  <div className="text-gray-600 dark:text-gray-300 mb-5 h-30 overflow-hidden line-clamp-4">
                    <TinaMarkdown 
                      content={post.excerpt}
                      components={{
                        mermaid({ value }: { value: string }) {
                          return <MermaidElement value={value} />;
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 pt-2 pb-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                <div className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-400 mr-2 flex items-center">
                    <FaCoins className="w-4 h-4 mr-2" />

                    {costValue === "Free" ? (
                      <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                        Free
                      </span>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{costValue}</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <IoStarOutline className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {
                      levelRequirement
                    }
                  </span>
                </div>
              </div>
              
            </div>
            </Link>
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