"use client";
import React, { useState, useEffect } from "react";
import client from "@/tina/__generated__/client";
import {
  BonusesConnectionQuery as GeneratedBonusesConnectionQuery,
  BonusesConnectionQueryVariables,
} from "@/tina/__generated__/types";
import ActiveBonuses from "./active-bonuses";
import UpcomingBonuses from "./upcoming-bonuses";
import EndedBonuses from "./ended-bonuses";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarDay, FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import PositionBanner from '@/components/banners/PositionBanner';
import { FcMoneyTransfer } from "react-icons/fc";
import { PiMoneyWavy } from "react-icons/pi";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1,
      when: "beforeChildren" 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      when: "afterChildren"
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

type BonusesTab = "active" | "upcoming" | "ended";

export default function BonusesContainer() {
  const [activeTab, setActiveTab] = useState<BonusesTab>("active");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    active: 0,
    upcoming: 0,
    ended: 0
  });
  const [bonusesData, setBonusesData] = useState<{
    data: GeneratedBonusesConnectionQuery;
    variables: BonusesConnectionQueryVariables;
    query: string;
  } | null>(null);

  useEffect(() => {
    async function fetchBonuses() {
      try {
        setLoading(true);
        let posts = await client.queries.bonusesConnection({
          sort: "start_date",
        });
        const allPosts = posts;

        while (posts.data?.bonusesConnection.pageInfo.hasNextPage) {
          posts = await client.queries.bonusesConnection({
            sort: "start_date",
            after: posts.data.bonusesConnection.pageInfo.endCursor,
          });
          
          if (posts.data.bonusesConnection.edges && allPosts.data.bonusesConnection.edges) {
            allPosts.data.bonusesConnection.edges.push(...posts.data.bonusesConnection.edges);
          }
        }
        
        setBonusesData(allPosts);
        
        // Calculate counts
        const currentDate = new Date();
        let activeCount = 0;
        let upcomingCount = 0;
        let endedCount = 0;
        
        allPosts.data.bonusesConnection?.edges?.forEach((postData) => {
          if (!postData || !postData.node) return;
          const post = postData.node;
          
          const startDate = post.start_date ? new Date(post.start_date) : null;
          const endDate = post.end_date ? new Date(post.end_date) : null;
          
          if (startDate && currentDate < startDate) {
            upcomingCount++;
          } else if (endDate && currentDate > endDate) {
            endedCount++;
          } else if ((startDate ? currentDate >= startDate : true) && 
                     (endDate ? currentDate <= endDate : true)) {
            activeCount++;
          }
        });
        
        setCounts({
          active: activeCount,
          upcoming: upcomingCount,
          ended: endedCount
        });
      } catch (error) {
        console.error("Error fetching bonuses:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBonuses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <motion.p 
            variants={fadeInUp}
            className="mt-4 text-xl text-gray-600 dark:text-gray-300"
          >
            Loading bonuses...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-4 lg:px-0 pb-8 min-h-screen">
      <motion.div 
        className="relative overflow-hidden mb-10 max-w-7xl mx-auto sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-300 dark:bg-purple-900 opacity-20 blur-3xl"></div>
          <div className="absolute top-32 -left-24 w-72 h-72 rounded-full bg-blue-300 dark:bg-blue-800 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-pink-300 dark:bg-pink-900 opacity-20 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <motion.div 
              className="flex-1"
              variants={contentVariants}
            >
              <motion.div
                variants={itemVariants}
                className="mb-4"
              >
                <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                  Win Amazing Prizes
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight"
              >
                Discover Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Bonuses</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8"
              >
                Explore all our bonuses - from currently active ones you can join today,
                to upcoming events to look forward to, as well as past bonuses for reference.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex-1"
              variants={scaleIn}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-20 blur-xl transform -rotate-6"></div>
                <div className="relative p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-green-500 dark:text-gray-400">Featured Bonuses</div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-purple-500 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                          <FcMoneyTransfer className="text-white text-2xl"/>
                          </div>
                          <div className="flex-1">
                            <div className="h-2.5 bg-gray-200 dark:bg-gray-600 rounded-full w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                          </div>
                          <div className="h-6 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 rounded-md flex items-center">
                          <PiMoneyWavy className=" text-2xl"/>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons - Remove animation from container */}
      <div className="flex flex-wrap gap-4 mb-10">
        <motion.button
          onClick={() => setActiveTab("active")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-colors duration-200 font-medium shadow-md ${
            activeTab === "active"
              ? "bg-purple-600 text-white shadow-purple-300 dark:shadow-purple-900/40"
              : "bg-gray-100 text-gray-700 hover:bg-purple-500 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-600"
          }`}
        >
          <FaCalendarDay className="h-5 w-5" />
          Active
          {counts.active > 0 && (
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-purple-800 dark:bg-gray-200 dark:text-purple-700">
              {counts.active}
            </span>
          )}
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("upcoming")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-colors duration-200 font-medium shadow-md ${
            activeTab === "upcoming"
              ? "bg-purple-600 text-white shadow-purple-300 dark:shadow-purple-900/40"
              : "bg-gray-100 text-gray-700 hover:bg-purple-500 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-600"
          }`}
        >
          <FaCalendarAlt className="h-5 w-5" />
          Upcoming
          {counts.upcoming > 0 && (
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-purple-800 dark:bg-gray-200 dark:text-purple-700">
              {counts.upcoming}
            </span>
          )}
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("ended")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-colors duration-200 font-medium shadow-md ${
            activeTab === "ended"
              ? "bg-purple-600 text-white shadow-purple-300 dark:shadow-purple-900/40"
              : "bg-gray-100 text-gray-700 hover:bg-purple-500 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-600"
          }`}
        >
          <FaCalendarCheck className="h-5 w-5" />
          Ended
          {counts.ended > 0 && (
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-purple-800 dark:bg-gray-200 dark:text-purple-700">
              {counts.ended}
            </span>
          )}
        </motion.button>
      </div>

      {/* Content Tabs - Simplified animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-[600px]"
        >
          {activeTab === "active" && <ActiveBonuses />}
          {activeTab === "upcoming" && <UpcomingBonuses />}
          {activeTab === "ended" && <EndedBonuses />}
        </motion.div>
      </AnimatePresence>
      
      <motion.div 
        className="mt-20 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <PositionBanner position="bottom"/>
      </motion.div>
    </div>
  );
} 