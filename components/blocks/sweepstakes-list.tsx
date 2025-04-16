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
import { ArrowRight, ExternalLink, Gift, Gamepad2, CreditCard, Layers, Info, CircleCheck, Sparkles } from "lucide-react";
import { StarRating } from "../ui/star-rating";
import { HiGift } from "react-icons/hi";
import { AnimatedTitle } from "../ui/animated-title";

// Define our custom interface for Sweepstakes List block
interface SweepstakesListBlock {
  title?: string;
  subtitle?: string;
  limit?: number;
  showFeatured?: boolean;
  minRating?: number;
  viewAllLink?: boolean;
  viewAllText?: string;
  width?: "small" | "medium" | "large";
  color?: "default" | "tint" | "primary";
  animatedTitle?: boolean;
}

// Function to fetch sweepstakes
async function fetchSweepstakes(limit: number = 3, showFeatured: boolean = false, minRating: number = 0) {
  try {
    const sweepstakesResponse = await client.queries.sweepstakesConnection({
      first: limit,
    });
    
    return sweepstakesResponse;
  } catch (error) {
    console.error("Error fetching sweepstakes:", error);
    return { data: { sweepstakesConnection: { edges: [] } } };
  }
}

export const SweepstakesList = ({ data }: { data: SweepstakesListBlock }) => {
  const [sweepstakesData, setSweepstakesData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Fetch sweepstakes on component mount
  React.useEffect(() => {
    async function loadSweepstakes() {
      try {
        setIsLoading(true);
        const response = await fetchSweepstakes(
          data.limit || 3,
          data.showFeatured || false,
          data.minRating || 0
        );
        setSweepstakesData(response);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load sweepstakes'));
        setIsLoading(false);
      }
    }
    
    loadSweepstakes();
  }, [data.limit, data.showFeatured, data.minRating]);

  // Filter and sort sweepstakes based on criteria
  const filteredSweepstakes = useMemo(() => {
    if (!sweepstakesData?.data?.sweepstakesConnection?.edges) return [];
    
    return [...sweepstakesData.data.sweepstakesConnection.edges]
      .filter(edge => {
        if (!edge?.node) return false;
        
        // Filter by featured if needed
        if (data.showFeatured && !edge.node.featured) return false;
        
        // Filter by minimum rating if needed
        if (data.minRating && edge.node.sweepstakes_review_count) {
          if (edge.node.sweepstakes_review_count < data.minRating) return false;
        }
        
        return true;
      })
      // Sort by review count (highest first)
      .sort((a, b) => {
        const ratingA = a?.node?.sweepstakes_review_count || 0;
        const ratingB = b?.node?.sweepstakes_review_count || 0;
        return ratingB - ratingA;
      });
  }, [sweepstakesData, data.showFeatured, data.minRating]);

  // Helper function to convert 0-10 rating to 0-5 stars
  const convertToStarRating = (rating: number | undefined): number => {
    if (!rating) return 0;
    // Convert 0-10 scale to 0-5 scale
    return rating / 2;
  };

  // Define safety index color based on rating
  const getSafetyColor = (rating: number | undefined) => {
    if (!rating) return "gray";
    if (rating >= 8) return "green";
    if (rating >= 6) return "yellow";
    return "red";
  };

  // Get rating text color class based on rating value
  const getRatingTextColorClass = (rating: number | undefined): string => {
    if (!rating) return "text-gray-600";
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  // Get rating badge classes based on rating value
  const getRatingBadgeClasses = (rating: number | undefined): string => {
    if (!rating) return "bg-gray-100 text-gray-700";
    if (rating >= 8) return "bg-green-100 text-green-700";
    if (rating >= 6) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Get star rating color class
  const getStarRatingColorClass = (rating: number | undefined): string => {
    if (!rating) return "text-gray-500";
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  // Define rating text based on rating value
  const getRatingText = (rating: number | undefined) => {
    if (!rating) return "";
    if (rating >= 8) return "HIGH";
    if (rating >= 6) return "MEDIUM";
    return "LOW";
  };

  return (
    <Section color={data.color} data-testid="sweepstakes-list-section">
      <div className="py-8">
        <Container size={data.width || "large"}>
          <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
            <div>
              {data.title && (
                <AnimatedTitle 
                  className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6" 
                  data-testid="sweepstakes-list-title"
                  animated={data.animatedTitle}
                >
                  {data.title}
                </AnimatedTitle>
              )}
              
              {data.subtitle && (
                <p className="text-lg text-muted-foreground" data-testid="sweepstakes-list-subtitle">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4" data-testid="sweepstakes-list-loading">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-row bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 max-h-[200px]">
                  {/* Logo skeleton */}
                  <div className="px-4 p-2 w-[120px] bg-green-600">
                    <div className="relative w-full aspect-square">
                      <Skeleton className="h-full w-full rounded-lg bg-gradient-to-br from-green-500/50 to-green-700/50" />
                    </div>
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="flex-1 py-3 px-4">
                    {/* Title and rating */}
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-6 w-32 bg-gray-200" />
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                    </div>
                    
                    {/* Quick stats */}
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {Array(4).fill(0).map((_, idx) => (
                        <div key={idx} className="flex items-center">
                          <Skeleton className="h-3.5 w-3.5 mr-1 rounded-full bg-gray-200" />
                          <Skeleton className="h-3 w-6 bg-gray-200" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Bonus preview */}
                    <div className="mb-2">
                      <Skeleton className="h-6 w-3/4 bg-gray-200" />
                    </div>
                    
                    {/* Buttons skeleton */}
                    <div className="flex gap-2 my-1">
                      <Skeleton className="h-8 flex-1 bg-gray-200 rounded-md" />
                      <Skeleton className="h-8 flex-1 bg-green-200 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12" data-testid="sweepstakes-list-error">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-red-500">Failed to load sweepstakes. Please try again later.</p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* No sweepstakes state */}
          {!isLoading && filteredSweepstakes.length === 0 && (
            <div className="text-center py-12" data-testid="sweepstakes-list-empty">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-gray-500">No sweepstakes found.</p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* Sweepstakes List */}
          {!isLoading && filteredSweepstakes.length > 0 && (
            <div className="space-y-6" data-testid="sweepstakes-list-content">
              {filteredSweepstakes.map((sweepstakeData, index) => {
                if (!sweepstakeData?.node) return null;
                
                const sweepstake = sweepstakeData.node;
                const sweepstakeUrl = `/sweepstakes/${sweepstake._sys.breadcrumbs.join("/")}`;

                return (
                  <div 
                    key={sweepstake._sys.filename} 
                    className="flex flex-row bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-green-600 hover:shadow-md transition-all duration-300 max-h-[200px] hover:shadow-green-500/20"
                    data-testid="sweepstakes-list-item"
                  >
                    {/* Logo section */}
                    <div className="px-2 sm:px-4 p-2 w-[80px] sm:w-[120px] flex items-center justify-center relative bg-green-600 group overflow-hidden">
                      <div className="relative w-full aspect-square">
                        <Link href={sweepstakeUrl} className="relative w-full h-full block">
                          {sweepstake.logo ? (
                            <Image
                              src={sweepstake.logo}
                              alt={sweepstake.title || "Sweepstake logo"}
                              fill
                              className="object-contain transition-transform duration-300 group-hover:scale-110"
                              sizes="120px"
                              priority={index < 3}
                              quality={85}
                              data-testid="sweepstakes-list-logo"
                            />
                          ) : (
                            <div className="h-full w-full bg-green-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110" data-testid="sweepstakes-list-logo-fallback">
                              <span className="text-sm font-bold text-white">{sweepstake.title}</span>
                            </div>
                          )}
                        </Link>
                      </div>
                    </div>
                    
                    {/* Middle section with details */}
                    <div className="flex-1 py-3 px-3 sm:px-4">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={sweepstakeUrl} className="hover:text-green-600">
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-1" data-testid="sweepstakes-list-title">
                            {sweepstake.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1">
                          <div className="hidden md:block">
                            <StarRating
                              totalStars={5}
                              defaultValue={convertToStarRating(sweepstake.sweepstakes_review_count)}
                              disabled={true}
                              size="sm"
                              className={getStarRatingColorClass(sweepstake.sweepstakes_review_count) + ""}
                            />
                          </div>
                          <span className={`text-md font-bold ${getRatingTextColorClass(sweepstake.sweepstakes_review_count)}`}>
                            {sweepstake.sweepstakes_review_count?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quick stats */}
                      <div className="grid grid-cols-6 gap-2 mb-2 text-xs">
                        <div className="flex items-center text-gray-600">
                          <Gamepad2 className="size-3.5 mr-1 text-gray-400" />
                          <span>{sweepstake.game_categories?.[0]?.all_games_count || 0} </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <HiGift className="size-3.5 mr-1 text-yellow-400" />
                          <span>{sweepstake.bonuses?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CreditCard className="size-3.5 mr-1 text-green-600" />
                          <span>{sweepstake.deposit_methods?.[0]?.count || 0} </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CreditCard className="size-3.5 mr-1 text-red-500" />
                          <span>{sweepstake.withdrawal_methods?.[0]?.count || 0} </span>
                        </div>
                      </div>
                      
                      {/* Bonus preview */}
                      {sweepstake.bonuses?.[0]?.bonus_title && (
                        <div className="flex items-center text-lg text-green-600 mb-2 line-clamp-2">
                          <HiGift className="size-6 mr-1.5 text-yellow-400 hidden md:block" />
                          <span className="font-bold line-clamp-1">{sweepstake.bonuses[0].bonus_title}</span>
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="flex gap-2 my-1">
                        <Link
                          href={sweepstakeUrl}
                          className="flex-1 inline-flex items-center justify-center px-2 sm:px-3 py-1.5 text-sm border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors"
                        >
                          Review <ArrowRight className="ml-1.5 size-3.5 hidden md:block" />
                        </Link>
                        
                        {sweepstake.sweepstakes_url && (
                          <a 
                            href={sweepstake.sweepstakes_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center px-2 sm:px-3 py-1.5 text-sm bg-green-500 hover:text-white text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            Get Bonus <HiGift className="ml-1.5 size-3.5 hidden md:block" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* View All Link - moved to bottom */}
              {data.viewAllLink && (
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/sweepstakes"
                    className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white hover:text-white px-6 py-3 rounded-md text-base font-medium transition-all duration-300 hover:shadow-md md:text-lg"
                    data-testid="sweepstakes-list-view-all"
                  >
                    {data.viewAllText || "View all sweepstakes"}
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
    </Section>
  );
};

export const sweepstakesListSchema: Template = {
  name: "sweepstakesList",
  label: "Sweepstakes List",
  ui: {
    previewSrc: "/blocks/sweepstakes-list.png",
    defaultItem: {
      title: "Highest-Rated Sweepstakes Casinos",
      subtitle: "Find the best sweepstakes casinos with the highest ratings",
      limit: 5,
      showFeatured: false,
      minRating: 0,
      viewAllLink: true,
      viewAllText: "View all sweepstakes",
      width: "large",
      color: "default",
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
      label: "Number of Sweepstakes to Display",
      name: "limit",
      ui: {
        validate: (value) => {
          if (value < 1) return "Must display at least 1 sweepstake";
          if (value > 20) return "Cannot display more than 20 sweepstakes";
        },
      },
    },
    {
      type: "boolean",
      label: "Show Featured Only",
      name: "showFeatured",
      description: "When enabled, only sweepstakes marked as featured will be displayed",
    },
    {
      type: "number",
      label: "Minimum Rating (0-10)",
      name: "minRating",
      description: "Only show sweepstakes with this minimum rating or higher",
      ui: {
        validate: (value) => {
          if (value < 0) return "Rating cannot be less than 0";
          if (value > 10) return "Rating cannot be greater than 10";
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