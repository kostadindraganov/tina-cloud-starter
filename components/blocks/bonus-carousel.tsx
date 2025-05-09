"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { Template } from "tinacms";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import client from "../../tina/__generated__/client";
import { Button } from "../ui/button";
import { ThemedCard } from "../ui/themed-card";
import { Skeleton } from "../ui/skeleton";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/shadcn-carousel";
import { AnimatedTitle } from "../ui/animated-title";
import { Disclosure, DisclosureTrigger, DisclosureContent } from "../ui/disclosure";
import { ChevronDown } from "lucide-react";

// Define our custom interface for Bonus Carousel block
interface BonusCarouselBlock {
  title?: string;
  subtitle?: string;
  limit?: number;
  viewAllLink?: boolean;
  viewAllText?: string;
  width?: "small" | "medium" | "large";
  color?: "default" | "tint" | "primary";
  autoPlay?: boolean;
  interval?: number;
  animatedTitle?: boolean;
}

// Function to fetch latest bonuses
async function fetchLatestBonuses(limit: number = 3) {
  try {
    const currentDate = new Date().toISOString();
    const bonusesResponse = await client.queries.bonusesConnection({
      first: limit,
      filter: {
        start_date: { before: currentDate },
        end_date: { after: currentDate }
      }
    });
    return bonusesResponse;
  } catch (error) {
    console.error("Error fetching bonuses:", error);
    return { data: { bonusesConnection: { edges: [] } } };
  }
}

export const BonusCarousel = ({ data }: { data: BonusCarouselBlock }) => {
  const [bonusesData, setBonusesData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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

  // Fetch bonuses on component mount
  React.useEffect(() => {
    async function loadBonuses() {
      try {
        setIsLoading(true);
        const response = await fetchLatestBonuses(data.limit || 3);
        setBonusesData(response);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load bonuses'));
        setIsLoading(false);
      }
    }
    
    loadBonuses();
  }, [data.limit]);

  // Sort bonuses by date in descending order
  const sortedBonuses = useMemo(() => {
    if (!bonusesData?.data?.bonusesConnection?.edges) return [];
    
    return [...bonusesData.data.bonusesConnection.edges]
      .filter(edge => edge?.node)
      .sort((a, b) => {
        const dateA = a?.node?.start_date ? new Date(a.node.start_date) : new Date(0);
        const dateB = b?.node?.start_date ? new Date(b.node.start_date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  }, [bonusesData]);

  return (
    <Section color={data.color} data-testid="bonus-carousel-section">
      <div className="py-8">
        <Container size="large">
          <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
            <div>
              {data.title && (
                <AnimatedTitle 
                  className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6" 
                  data-testid="bonus-carousel-title"
                  animated={data.animatedTitle}
                >
                  {data.title}
                </AnimatedTitle>
              )}
              
              {data.subtitle && (
                <p className="text-lg text-muted-foreground" data-testid="bonus-carousel-subtitle">
                  {data.subtitle}
                </p>
              )}
              
              {data.viewAllLink && (
                <Link
                  href="/bonuses"
                  className="group mt-3 inline-flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-md md:text-base lg:text-lg"
                  data-testid="bonus-carousel-view-all"
                >
                  {data.viewAllText || "View all bonuses"}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:rotate-45" />
                </Link>
              )}
            </div>
            
            <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="disabled:pointer-events-auto"
                data-testid="bonus-carousel-prev"
              >
                <ArrowLeft className="size-5" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                className="disabled:pointer-events-auto"
                data-testid="bonus-carousel-next"
              >
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="bonus-carousel-loading">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[3/2] w-full rounded-xl" data-testid="bonus-carousel-skeleton" />
                  <Skeleton className="h-8 w-3/4 mt-4" data-testid="bonus-carousel-skeleton" />
                  <Skeleton className="h-4 w-full mt-2" data-testid="bonus-carousel-skeleton" />
                  <Skeleton className="h-4 w-5/6 mt-1" data-testid="bonus-carousel-skeleton" />
                  <Skeleton className="h-4 w-1/4 mt-6" data-testid="bonus-carousel-skeleton" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12" data-testid="bonus-carousel-error">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-red-500">Failed to load bonuses. Please try again later.</p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* No bonuses state */}
          {!isLoading && sortedBonuses.length === 0 && (
            <div className="text-center py-12" data-testid="bonus-carousel-empty">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-gray-500">No bonuses found.</p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* Carousel */}
          {!isLoading && sortedBonuses.length > 0 && (
            <div className="w-full" data-testid="bonus-carousel-content">
              <Carousel
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
                  {sortedBonuses.map((bonusData) => {
                    if (!bonusData?.node) return null;
                    
                    const bonus = bonusData.node;
                    const start_date = bonus.start_date ? format(new Date(bonus.start_date), 'MMMM dd, yyyy') : '';
                    const end_date = bonus.end_date ? format(new Date(bonus.end_date), 'MMMM dd, yyyy') : '';
                    const bonusUrl = bonus.areview_url || '';

                    return (
                      <CarouselItem key={bonus._sys.filename} className="pl-4 md:basis-1/2 lg:basis-1/3" data-testid="bonus-carousel-item">
                        <div className="flex flex-col  h-full bg-white rounded-xl shadow-md">
                          <Link href={bonusUrl || '#'} className="group">
                            <div className="flex aspect-[3/2] overflow-clip rounded-t-xl bg-green-500">
                              <div className="flex-1 flex items-center justify-center">
                                <div className="relative h-full w-full origin-center transition duration-300 group-hover:scale-105 flex items-center justify-center">
                                  {bonus.logo ? (
                                    <Image
                                      src={bonus.logo}
                                      alt={bonus.title || "Bonus logo"}
                                      fill
                                      className="object-contain"
                                      priority={true}
                                      sizes="(max-width: 360px) 100vw, 100vw"
                                      data-testid="bonus-carousel-logo"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center" data-testid="bonus-carousel-logo-fallback">
                                      <span className="text-xl font-bold text-white">{bonus.title}</span>
                                    </div>
                                  )}
                                  
                                  {bonus.bonus_amount && (
                                    <div className="absolute top-0  right-0 bg-yellow-400 rounded-bl-xl text-black px-3 py-2 text-center" data-testid="bonus-carousel-amount">
                                      <span className="text-xl font-bold">{bonus.bonus_amount}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          <div className="p-4 flex-1 flex flex-col">
                            <Link href={bonusUrl || '#'} className="hover:underline">
                              <div className="mb-2 font-bold text-green-600 line-clamp-2  py-2 text-lg md:mb-3 md:text-xl" data-testid="bonus-carousel-title">
                                {bonus.bonus_title || bonus.title}
                              </div>
                            </Link>

                         
                            
                            {bonus.bonus_code && (
                              <div className="mb-3 p-2 bg-yellow-400 rounded-md text-center" data-testid="bonus-carousel-code">
                                <span className="text-sm text-gray-500">CODE:</span> 
                                <span className="text-base font-medium ml-1 text-black">{bonus.bonus_code}</span>
                              </div>
                            )}
                            
                            <div className="flex flex-1"></div>


                            {(start_date || end_date) && (
                              <div className="text-xs text-gray-500 mb-4" data-testid="bonus-carousel-dates">
                                {start_date && <span>From: {start_date}</span>}
                                {start_date && end_date && <span className="mx-1">-</span>}
                                {end_date && <span>Until: {end_date}</span>}
                              </div>
                            )}

                            
                            {bonus.excerpt && (
                              <Disclosure>
                                <DisclosureTrigger>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="w-full mb-2 flex items-center justify-center gap-2 text-green-500 bg-white border-2 border-green-500 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-md transition-all duration-300 hover:shadow-md"
                                  >
                                    <span>More Info</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DisclosureTrigger>
                                <DisclosureContent>
                                  <div className="mb-4 text-sm text-gray-600 bg-green-50 p-3 rounded-md" data-testid="bonus-carousel-excerpt">
                                    {typeof bonus.excerpt === 'string' ? (
                                      bonus.excerpt
                                    ) : (
                                      <TinaMarkdown content={bonus.excerpt} />
                                    )}
                                  </div>
                                </DisclosureContent>
                              </Disclosure>
                            )}
                            
                     
                            {(bonusUrl || bonus.affiliate_url) && (
                            <div className="flex items-center justify-between gap-3  mb-2 mt-4">
                             
                            {bonusUrl && (
                              <Link href={bonusUrl} className="flex-1 inline-flex items-center justify-center text-sm text-white hover:text-white bg-purple-500 border-2 border-purple-500 hover:bg-purple-600 px-3 py-1.5 rounded-md transition-all duration-300 hover:shadow-md" data-testid="bonus-carousel-details-link">
                                Details <ArrowRight className="ml-2 size-4" />
                              </Link>
                            )}  

                              
                              {bonus.affiliate_url && (
                                <a 
                                  href={bonus.affiliate_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex-1 inline-flex items-center justify-center text-sm text-white hover:text-white bg-green-500 border-2 border-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md transition-all duration-300 hover:shadow-md"
                                  data-testid="bonus-carousel-affiliate-link"
                                >
                                  Claim <ExternalLink className="ml-2 size-4" />
                                </a>
                              )}
                            </div>
                            )}
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

export const bonusCarouselSchema: Template = {
  name: "bonusCarousel",
  label: "Bonus Carousel",
  ui: {
    previewSrc: "/blocks/bonus-carousel.png",
    defaultItem: {
      title: "Featured Bonuses",
      subtitle: "Check out our latest promotions",
      limit: 5,
      viewAllLink: true,
      viewAllText: "View all bonuses",
      width: "large",
      autoPlay: true,
      interval: 5000,
      animatedTitle: false
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
      label: "Number of Bonuses to Display",
      name: "limit",
      ui: {
        validate: (value) => {
          if (value < 1) return "Must display at least 1 bonus";
          if (value > 20) return "Cannot display more than 20 bonuses";
        },
      },
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
        { label: "Custom", value: "custom" },
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
    {
      type: "boolean",
      label: "Animated Title",
      name: "animatedTitle",
      description: "Enable gradient animation effect on title"
    },
  ],
}; 