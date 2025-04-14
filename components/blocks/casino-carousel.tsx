"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Template } from "tinacms";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import client from "../../tina/__generated__/client";
import { Button } from "../ui/button";
import { ThemedCard } from "../ui/themed-card";
import { Skeleton } from "../ui/skeleton";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/shadcn-carousel";
import { MdStars } from "react-icons/md";
import { GrLinkNext } from "react-icons/gr";
import { TiStar } from "react-icons/ti";
import { BiStar } from "react-icons/bi";

// Helper functions for safety index
const getSafetyLevel = (rating: number | null | undefined) => {
  if (!rating) return "UNKNOWN";
  if (rating >= 8) return "HIGH";
  if (rating >= 6) return "MEDIUM";
  return "LOW";
};

const getSafetyColor = (rating: number | null | undefined) => {
  if (!rating) return "text-gray-500";
  if (rating >= 8) return "text-green-500";
  if (rating >= 6) return "text-yellow-500";
  if (rating >= 4) return "text-orange-500";
  return "text-red-500";
};

// Define our custom interface for Casino Carousel block
interface CasinoCarouselBlock {
  title?: string;
  subtitle?: string;
  limit?: number;
  viewAllLink?: boolean;
  viewAllText?: string;
  width?: "small" | "medium" | "large";
  color?: "default" | "tint" | "primary" | "green" | "white" | "purple" | "orange" | "yellow" | "red" | "pink" | "teal" | "blue";
  autoPlay?: boolean;
  interval?: number;
  showFeaturedOnly?: boolean;
}

// Function to fetch latest casinos
async function fetchLatestCasinos(limit: number = 3, featured: boolean = false) {
  try {
    const casinosResponse = await client.queries.casinoConnection({
      first: limit,
      sort: "casino_review_count",
      filter: {
        featured: {
          eq: featured
        }
      }
    });
    return casinosResponse;
  } catch (error) {
    console.error("Error fetching casinos:", error);
    return { data: { casinoConnection: { edges: [] } } };
  }
}

export const CasinoCarousel = ({ data }: { data: CasinoCarouselBlock }) => {
  const [casinosData, setCasinosData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(data.showFeaturedOnly || false);

  // Auto play functionality
  useEffect(() => {
    if (!data.autoPlay || isLoading || error || !carouselApi) return;
    
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, data.interval || 5000);
    
    return () => clearInterval(interval);
  }, [data.autoPlay, data.interval, isLoading, error, carouselApi]);

  // Setup carousel navigation states
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    
    updateSelection();
    carouselApi.on("select", updateSelection);
    
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  // Fetch casinos on component mount or when featured filter changes
  React.useEffect(() => {
    async function loadCasinos() {
      try {
        setIsLoading(true);
        const response = await fetchLatestCasinos(data.limit || 3, showFeaturedOnly);
        setCasinosData(response);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load casinos'));
        setIsLoading(false);
      }
    }
    
    loadCasinos();
  }, [data.limit, showFeaturedOnly]);

  // Update sort logic to remove featured filter since it's handled by the query
  const sortedCasinos = useMemo(() => {
    if (!casinosData?.data?.casinoConnection?.edges) return [];
    
    return [...casinosData.data.casinoConnection.edges]
      .sort((a, b) => {
        // Primary sort by review count
        const reviewCountA = a?.node?.casino_review_count || 0;
        const reviewCountB = b?.node?.casino_review_count || 0;
        if (reviewCountA !== reviewCountB) {
          return reviewCountB - reviewCountA; // Sort by review count DESC
        }
        
        // Secondary sort by date if review counts are equal
        const dateA = a?.node?.date ? new Date(a.node.date) : new Date(0);
        const dateB = b?.node?.date ? new Date(b.node.date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  }, [casinosData]);

  return (
    <Section color={data.color} data-testid="casino-carousel-section">
      <div className="py-8">
        <Container size={data.width || "large"}>
          <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
            <div>
              {data.title && (
                <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6" data-testid="casino-carousel-title">
                  {data.title}
                </h2>
              )}
              
              {data.subtitle && (
                <p className="text-lg text-muted-foreground" data-testid="casino-carousel-subtitle">
                  {data.subtitle}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {data.viewAllLink && (
                  <Link
                    href="/casino"
                    className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-md md:text-base lg:text-lg"
                    data-testid="casino-carousel-view-all"
                  >
                    {data.viewAllText || "View all casinos"}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:rotate-45" />
                  </Link>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="disabled:pointer-events-auto"
                data-testid="casino-carousel-prev"
              >
                <ArrowLeft className="size-5" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                className="disabled:pointer-events-auto"
                data-testid="casino-carousel-next"
              >
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
          
          {/* Loading state with context */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="casino-carousel-loading">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col bg-white rounded-xl p-3 shadow-md w-full basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="aspect-[3/2] w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-7 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full bg-green-200" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                        <Skeleton className="h-4 w-16 bg-green-200" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <Skeleton className="h-8 w-full rounded-md bg-green-100" />
                      <Skeleton className="h-8 w-full rounded-md bg-green-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state with context */}
          {error && (
            <div className="text-center py-12" data-testid="casino-carousel-error">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-red-500">
                    Failed to load casinos. Please try again later.
                  </p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* No casinos state with context */}
          {!isLoading && sortedCasinos.length === 0 && (
            <div className="text-center py-12" data-testid="casino-carousel-empty">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-gray-500">
                    No casinos found.
                  </p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* Carousel */}
          {!isLoading && sortedCasinos.length > 0 && (
            <div className="w-full" data-testid="casino-carousel-content">
              <Carousel
                key={showFeaturedOnly ? 'featured' : 'all'} // Force carousel reset on filter change
                setApi={setCarouselApi}
                opts={{
                loop: true, // Enable infinite loop
                  align: "start",
                  breakpoints: {
                    "(max-width: 768px)": {
                      dragFree: true,
                    },
                  },
                }}
                className="relative w-full"
              >
                <CarouselContent className="-ml-4">
                  {sortedCasinos.map((casinoData) => {
                    if (!casinoData?.node) return null;
                    
                    const casino = casinoData.node;
                    const casinoUrl = `/casino/${casino._sys.breadcrumbs.join("/")}`;

                    return (
                      <CarouselItem 
                        key={casino._sys.filename} 
                        className="pl-4 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 w-full" 
                        data-testid="casino-carousel-item"
                      >
                        <div className="flex flex-col h-full bg-white rounded-xl shadow-md w-full mx-auto">
                          <Link href={casinoUrl} className="group">
                            <div className="flex aspect-[3/2] overflow-clip rounded-t-xl bg-green-500">
                              <div className="flex-1 flex items-center justify-center">
                                <div className="relative h-full w-full origin-center transition duration-300 group-hover:scale-105 flex items-center justify-center">
                                  {casino.logo ? (
                                    <Image
                                      src={casino.logo}
                                      alt={casino.title || "Casino logo"}
                                      fill
                                      className="object-contain p-8"
                                      priority={true}
                                      sizes="(max-width: 360px) 100vw, 100vw"
                                      data-testid="casino-carousel-logo"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center" data-testid="casino-carousel-logo-fallback">
                                      <span className="text-xl font-bold text-white">{casino.title}</span>
                                    </div>
                                  )}
                                  
                                  {casino.casino_review_count > 0 && (
                                    <div className="absolute bottom-0 right-0 bg-gradient-to-r from-green-600/90 to-green-800/90 text-white px-3 py-1.5 text-sm rounded-tl-xl flex items-center gap-1.5 font-medium shadow-md backdrop-blur-sm">
                                      <TiStar className="text-yellow-300 size-5 animate-pulse" />
                                      <span>{casino.casino_review_count}</span>
                                      <span className="text-green-100/80">Rating</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          <div className="p-3 flex-1 flex flex-col items-center">
                            <Link href={casinoUrl} className="hover:underline">
                              <div className="mb-2 font-bold text-gray-700 line-clamp-2 break-words py-1 text-lg md:mb-2 md:text-lg" data-testid="casino-carousel-title">
                                {casino.title}
                              </div>
                            </Link>
                            

                            {/* Safety Index Section */}
                            <div className="flex flex-col items-center gap-1 mb-4">
                              <MdStars className="text-green-500 size-8"/>
                              <div>
                              <span className="text-sm uppercase font-medium text-gray-500 mr-2">SAFETY INDEX:</span>
                              <span className={`text-lg uppercase font-bold ${getSafetyColor(casino.casino_review_count)}`}>
                                {getSafetyLevel(casino.casino_review_count)}
                              </span>
                              </div>
                        
                            </div>

                            <div className="flex flex-col gap-3 mt-auto w-full mb-3">
                              <Link href={casinoUrl} className="w-full inline-flex items-center justify-center text-sm text-green-500 bg-white border-2 border-green-500 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-md transition-all duration-300 hover:shadow-md" data-testid="casino-carousel-details-link">
                                Review <BiStar className="ml-2 size-4" />
                              </Link>
                              
                              {casino.casino_url && (
                                <a 
                                  href={casino.casino_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-center text-sm text-white hover:text-white bg-green-500 border-2 border-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md transition-all duration-300 hover:shadow-md"
                                  data-testid="casino-carousel-visit-link"
                                >
                                  Visit now <GrLinkNext className="ml-2 size-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </Container>
      </div>
    </Section>
  );
};

export const casinoCarouselSchema: Template = {
  name: "casinoCarousel",
  label: "Casino Carousel",
  ui: {
    previewSrc: "/blocks/casino-carousel.png",
    defaultItem: {
      title: "Featured Casinos",
      subtitle: "Check out our top rated casinos",
      limit: 5,
      viewAllLink: true,
      viewAllText: "View all casinos",
      width: "large",
      autoPlay: true,
      interval: 5000,
      showFeaturedOnly: false
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Subtitle",
      name: "subtitle",
    },
    {
      type: "number",
      label: "Number of Casinos to Display",
      name: "limit",
      ui: {
        validate: (value) => {
          if (value < 1) return "Must display at least 1 casino";
          if (value > 20) return "Cannot display more than 20 casinos";
        },
      },
    },
    {
      type: "boolean",
      label: "Show Featured Casinos Only",
      name: "showFeaturedOnly",
      description: "When enabled, only featured casinos will be shown by default",
    },
    {
      type: "boolean",
      label: "Auto Play Slides",
      name: "autoPlay",
    },
    {
      type: "number",
      label: "Auto Play Interval (ms)",
      name: "interval",
      ui: {
        validate: (value) => {
          if (value < 2000) return "Interval must be at least 2000ms";
        },
      },
    },
    {
      type: "boolean",
      label: "Show View All Link",
      name: "viewAllLink",
    },
    {
      type: "string",
      label: "View All Text",
      name: "viewAllText",
      ui: {
        component: "text",
      },
    },
    {
      type: "string",
      label: "Width",
      name: "width",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ],
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
        { label: "Green", value: "green" },
        { label: "White", value: "white" },
        { label: "Purple", value: "purple" },
        { label: "Orange", value: "orange" },
        { label: "Tint", value: "tint" },
        { label: "Yellow", value: "yellow" },
        { label: "Red", value: "red" },
        { label: "Pink", value: "pink" },
        { label: "Teal", value: "teal" },
        { label: "Blue", value: "blue" },
      ],
    },
  ],
}; 