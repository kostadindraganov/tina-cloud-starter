"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/tina/__generated__/client";

// Define our own banner type for client-side use
interface Banner {
  _sys: {
    filename: string;
  };
  title: string;
  banner_image: string | null | undefined;
  position: string[] | null | undefined;
  affiliate_url: string | null | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;
}

interface PositionBannerProps {
  maxBanners?: number;
  position: "top" | "center" | "bottom";
  className?: string;
}

export default function PositionBanner({ 
  maxBanners = 1, 
  position, 
  className = "w-full my-3 sm:my-4 md:my-6" 
}: PositionBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Check if the client exists
        if (!client || !client.queries || !client.queries.bannersConnection) {
          throw new Error("Tina client not properly initialized");
        }
        
        // Fetch all banners from Tina CMS
        const response = await client.queries.bannersConnection();
        
        if (!response || !response.data) {
          throw new Error("No data returned from Tina CMS");
        }
        
        const edges = response.data.bannersConnection?.edges || [];
        
        // Extract and filter banners
        const processedBanners: Banner[] = [];
        
        for (const edge of edges) {
          const node = edge?.node;
          if (!node) continue;
          
          if (!Array.isArray(node.position) || !node.position.includes(position)) continue;
          
          // Map the node to our Banner type
          processedBanners.push({
            _sys: node._sys,
            title: node.title || "",
            banner_image: node.banner_image,
            position: node.position?.filter(Boolean) as string[] || [],
            affiliate_url: node.affiliate_url,
            start_date: node.start_date,
            end_date: node.end_date
          });
        }
        
        // Filter banners by date
        const now = new Date();
        const validBanners = processedBanners.filter(banner => {
          const startDate = banner.start_date ? new Date(banner.start_date) : new Date(0);
          const endDate = banner.end_date ? new Date(banner.end_date) : new Date(8640000000000000); // Max date
          
          return startDate <= now && now <= endDate;
        });
        
        // Randomly select maxBanners
        const shuffled = [...validBanners].sort(() => 0.5 - Math.random());
        const selectedBanners = shuffled.slice(0, maxBanners);
        
        setBanners(selectedBanners);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setIsLoading(false);
        setError(error instanceof Error ? error.message : "Unknown error fetching banners");
        
        // Even if there's an error, we'll show placeholders
        setBanners([]);
      }
    };

    fetchBanners();
  }, [maxBanners, position]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 15
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Don't show anything if loading is complete and no banners were found
  if (!isLoading && banners.length === 0) {
    return null;
  }
  
  // Only show placeholders when loading AND we expect to find banners
  const placeholderBanners = isLoading ? Array.from({ length: Math.max(1, maxBanners) }).map((_, i) => ({
    _sys: { filename: `placeholder-${i}` },
    title: error ? "Error loading banner" : "Placeholder Banner",
    banner_image: "",
    position: [position],
    affiliate_url: "#",
    start_date: null,
    end_date: null
  })) : [];

  // Combine real and placeholder banners
  const displayBanners = isLoading ? placeholderBanners : banners;

  if (displayBanners.length === 0) {
    return null;
  }

  // Card styles
  const bannerCardStyle = {
    width: "100%",
    position: "relative" as const,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.5s ease, box-shadow 0.5s ease",
  };

  const imageContainerStyle = {
    width: "100%",
    overflow: "hidden",
    position: "relative" as const,
  };

  const hoverClass = "hover:shadow-xl group my-2 sm:my-3 md:my-4";
  return (
    <AnimatePresence>
      <motion.div 
        className={`space-y-6 sm:space-y-8 md:space-y-12 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {displayBanners.map((banner, index) => (
            
          <motion.div
            key={banner._sys.filename}
            variants={itemVariants}
          >
            <div 
              style={bannerCardStyle} 
              className={`${hoverClass} h-[100px] sm:h-[150px] md:h-[200px]`}
            >
              <Link 
                href={banner.affiliate_url || '#'} 
                target="_self" 
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <div style={imageContainerStyle} className="h-full">
                  {banner.banner_image ? (
                    <Image
                      src={banner.banner_image}
                      alt={banner.title || "Banner"}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
                      priority={index === 0}
                    />
                  ) : (
                    <div 
                      className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse"
                    />
                  )}

                  {/* Hover overlay gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
} 