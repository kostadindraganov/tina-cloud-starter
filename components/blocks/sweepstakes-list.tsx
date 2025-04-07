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
      <div className="py-16">
        <Container size={data.width || "large"}>
          <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
            <div>
              {data.title && (
                <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6" data-testid="sweepstakes-list-title">
                  {data.title}
                </h2>
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
            <div className="space-y-6" data-testid="sweepstakes-list-loading">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Logo skeleton */}
                  <div className="p-3 w-full md:w-1/4 bg-green-50">
                    <div className="relative w-full aspect-square">
                      <Skeleton className="h-full w-full rounded-xl bg-gradient-to-br from-green-100 to-green-200" data-testid="sweepstakes-list-skeleton" />
                    </div>
                  </div>
                  
                  {/* Middle content skeleton */}
                  <div className="w-full md:w-2/4 py-4 px-6 border-t md:border-t-0 md:border-l md:border-r border-gray-200">
                    <Skeleton className="h-8 w-3/4 mb-4 bg-gray-200" data-testid="sweepstakes-list-skeleton" />
                    
                    {/* Rating skeleton */}
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-5 w-32 bg-yellow-100 rounded-md" data-testid="sweepstakes-list-skeleton" />
                      <Skeleton className="h-5 w-12 ml-3 bg-yellow-100 rounded-md" data-testid="sweepstakes-list-skeleton" />
                    </div>
                    
                    {/* Bonus skeleton */}
                    <Skeleton className="h-16 w-full mb-5 bg-gray-100 rounded-lg" data-testid="sweepstakes-list-skeleton" />
                    
                    {/* Buttons skeleton */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <Skeleton className="h-10 w-36 bg-green-100 rounded-md" data-testid="sweepstakes-list-skeleton" />
                      <Skeleton className="h-10 w-36 bg-green-200 rounded-md" data-testid="sweepstakes-list-skeleton" />
                    </div>
                  </div>
                  
                  {/* Right info skeleton - hidden on mobile */}
                  <div className="hidden md:block w-full md:w-1/4 p-6 bg-gray-50 border-l border-gray-200">
                    <Skeleton className="h-6 w-32 mb-4 bg-gray-200" data-testid="sweepstakes-list-skeleton" />
                    <div className="space-y-3">
                      {Array(5).fill(0).map((_, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-20 bg-gray-100" data-testid="sweepstakes-list-skeleton" />
                          <Skeleton className="h-4 w-10 bg-gray-100" data-testid="sweepstakes-list-skeleton" />
                        </div>
                      ))}
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
                    className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                    data-testid="sweepstakes-list-item"
                  >
      
                    
                  {/* Logo section */}
                    <div className="p-3 w-full md:w-1/4 flex items-center justify-center relative rounded-sm overflow-hidden group bg-green-600">
                      <div className="relative w-full aspect-square sm:aspect-video md:aspect-square">
                        <Link href={sweepstakeUrl} className="relative w-full h-full block">
                          {sweepstake.logo ? (
                            <Image
                              src={sweepstake.logo}
                              alt={sweepstake.title || "Sweepstake logo"}
                              fill
                              className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                              priority={index < 3}
                              quality={90}
                              data-testid="sweepstakes-list-logo"
                            />
                          ) : (
                            <div className="h-full w-full bg-green-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110" data-testid="sweepstakes-list-logo-fallback">
                              <span className="text-xl font-bold text-gray-500">{sweepstake.title}</span>
                            </div>
                          )}
                        </Link>
                      </div>
                    </div>
                    
                    {/* Middle section with details */}
                    <div className="w-full md:w-2/4 py-4 px-6 border-t md:border-t-0 md:border-l md:border-r border-gray-200">
                      <Link href={sweepstakeUrl} className="hover:text-green-600">
                        <h3 className="text-2xl hover:text-green-600  font-bold text-gray-800 mb-3" data-testid="sweepstakes-list-title">
                          {sweepstake.title}
                        </h3>
                      </Link>
                      
                      {/* Rating stars */}
                      <div className="flex items-center mb-4">
                        <div className="mr-3">
                          <StarRating
                            totalStars={5}
                            defaultValue={convertToStarRating(sweepstake.sweepstakes_review_count)}
                            disabled={true}
                            size="md"
                            className={getStarRatingColorClass(sweepstake.sweepstakes_review_count)}
                          />
                        </div>
                        <span className={`text-xl font-bold ${getRatingTextColorClass(sweepstake.sweepstakes_review_count)}`}>
                          {sweepstake.sweepstakes_review_count?.toFixed(1) || 'No rating'}
                        </span>
                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-sm ${getRatingBadgeClasses(sweepstake.sweepstakes_review_count)}`}>
                          {getRatingText(sweepstake.sweepstakes_review_count)}
                        </span>
                      </div>
                      
                      {/* Bonus information */}
                      <div className="mb-5 group transform transition-transform duration-300 hover:translate-y-[-2px]">
                    
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 group-hover:border-green-600 group-hover:shadow-md">
                          <p className="text-lg font-bold text-gray-800 flex items-center line-clamp-2">
                            <Gift className="mr-2 size-12 text-green-600" /> {sweepstake.bonuses?.[0]?.bonus_title || "No bonus available"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Positives column */}
                      {/* <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-700 mb-2">Pros</h4>
                          <ul className="space-y-2">
                            {sweepstake.positives_negatives?.filter(item => 
                              item.__typename === 'SweepstakesPositives_negativesPositives'
                            ).slice(0, 3).map((positive, idx) => (
                              <li key={`pos-${idx}`} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700">{(positive as any).pros}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-700 mb-2">Cons</h4>
                          <ul className="space-y-2">
                            {sweepstake.positives_negatives?.filter(item => 
                              item.__typename === 'SweepstakesPositives_negativesNegatives'
                            ).slice(0, 3).map((negative, idx) => (
                              <li key={`neg-${idx}`} className="flex items-start">
                                <span className="text-red-500 mr-2">✗</span>
                                <span className="text-gray-700">{(negative as any).cons}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div> */}
                      
                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Link
                          href={sweepstakeUrl}
                          className="inline-flex items-center justify-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors"
                        >
                          Read Review <ArrowRight className="ml-2 size-4" />
                        </Link>
                        
                        {sweepstake.sweepstakes_url && (
                          <a 
                            href={sweepstake.sweepstakes_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white hover:text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                           <Gift className="mr-2 size-4" />  Get Bonus 
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Right section with additional info */}
                    <div className="hidden md:block w-full md:w-1/4 p-6 bg-gray-50 border-l border-gray-200">
                      <div className="flex items-center mb-5 pb-2 border-b border-gray-200">
                        <Info className="size-4 text-green-600 mr-2" />
                        <h4 className="text-sm text-gray-700 uppercase tracking-wider">Casino Details</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-500">
                            <Gamepad2 className="mr-2 size-3.5 text-gray-400" />
                            Games
                          </span>
                          <span className="text-sm font-medium">{sweepstake.game_categories?.[0]?.all_games_count || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-500">
                            <Layers className="mr-2 size-3.5 text-gray-400" />
                            Providers
                          </span>
                          <span className="text-sm font-medium">{sweepstake.software_providers?.[0]?.count || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-500">
                            <CreditCard className="mr-2 size-3.5 text-gray-400" />
                            Deposit
                          </span>
                          <span className="text-sm font-medium">{sweepstake.deposit_methods?.[0]?.count || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-500">
                            <CreditCard className="mr-2 size-3.5 text-gray-400" />
                            Withdraw
                          </span>
                          <span className="text-sm font-medium">{sweepstake.withdrawal_methods?.[0]?.count || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-500">
                            <Gift className="mr-2 size-3.5 text-gray-400" />
                            Bonuses
                          </span>
                          <span className="text-sm font-medium">{sweepstake.bonuses?.length || 0}</span>
                        </div>
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
    previewSrc: "/blocks/sweepstakes-list",
    defaultItem: {
      title: "Highest-Rated Sweepstakes Casinos",
      subtitle: "Find the best sweepstakes casinos with the highest ratings",
      limit: 5,
      showFeatured: false,
      minRating: 0,
      viewAllLink: true,
      viewAllText: "View all sweepstakes",
      width: "large",
      color: "default"
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
          if (value > 10) return "Cannot display more than 10 sweepstakes";
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
      ],
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
}; 