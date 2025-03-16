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

interface SidebarBannersProps {
  maxBanners?: number;
  position?: string;
  className?: string;
}

export default function SidebarBanners({ 
  maxBanners = 2, 
  position = "sidebar", 
  className = "" 
}: SidebarBannersProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Fetch all banners from Tina CMS
        const response = await client.queries.bannersConnection();
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
      } catch (error) {
        console.error("Error fetching banners:", error);
        setIsLoading(false);
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

  // Generate placeholder banners when loading or if no banners were found
  const placeholderBanners = Array.from({ length: isLoading || banners.length === 0 ? maxBanners : 0 }).map((_, i) => ({
    _sys: { filename: `placeholder-${i}` },
    title: "",
    banner_image: "",
    position: [position],
    affiliate_url: "#",
    start_date: null,
    end_date: null
  }));

  // Combine real and placeholder banners
  const displayBanners = isLoading || banners.length === 0 ? placeholderBanners : banners;

  if (displayBanners.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        /* 3D Flip Card Animation */
        .flip-card-container {
          width: 300px;
          height: 300px;
          perspective: 1000px;
          margin: 0 auto;
        }
        
        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s;
          transform-style: preserve-3d;
          cursor: pointer;
        }
        
        .flip-card-container:hover .flip-card {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, 
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .dark .flip-card-front,
        .dark .flip-card-back {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .flip-card-front {
          background-color: #ffffff;
        }
        
        .flip-card-back {
          background: linear-gradient(135deg, #ff6b6b, #9e42f5);
          color: white;
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
        }
        
        .flip-card-back h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .flip-card-back p {
          font-size: 1rem;
          margin-bottom: 20px;
        }
        
        .flip-card-back .flip-button {
          padding: 10px 20px;
          background-color: white;
          color: #9e42f5;
          border-radius: 5px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .flip-card-back .flip-button:hover {
          background-color: #f0f0f0;
          transform: scale(1.05);
        }
        
        .shimmer-bg {
          animation: shimmer 2s ease-in-out infinite;
          background: linear-gradient(
            to right,
            rgba(240, 240, 240, 0.5) 8%,
            rgba(245, 245, 245, 0.8) 18%,
            rgba(240, 240, 240, 0.5) 33%
          );
          background-size: 1000px 100%;
        }
        
        .dark .shimmer-bg {
          background: linear-gradient(
            to right,
            rgba(60, 60, 60, 0.5) 8%,
            rgba(80, 80, 80, 0.8) 18%,
            rgba(60, 60, 60, 0.5) 33%
          );
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
      
      <AnimatePresence>
        <motion.div 
          className={`space-y-12 ${className}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {displayBanners.map((banner, index) => (
            <motion.div
              key={banner._sys.filename}
              variants={itemVariants}
            >
              <div className="flip-card-container">
                <div className="flip-card">
                  <div className="flip-card-front">
                    {banner.banner_image ? (
                      <Image
                        src={banner.banner_image}
                        alt={banner.title || "Banner"}
                        fill
                        className="object-cover"
                        sizes="300px"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full shimmer-bg"></div>
                    )}
                  </div>
                  <div className="flip-card-back">
                    <h3>{banner.title || "Special Offer"}</h3>
                    <p>Check out this exclusive promotion just for you!</p>
                    <Link 
                      href={banner.affiliate_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flip-button"
                    >
                      Claim Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
} 