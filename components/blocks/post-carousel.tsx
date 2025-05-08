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
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/shadcn-carousel";
import { AnimatedTitle } from "../ui/animated-title";

// Define our custom interface for Post Carousel block
interface PostCarouselBlock {
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

// Function to fetch latest posts
async function fetchLatestPosts(limit: number = 20) {
  try {
    // Fetch more posts initially to account for filtering
    const postsResponse = await client.queries.postConnection({
      first: limit * 2, // Fetch double the amount to ensure we have enough after filtering
    });
    return postsResponse;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { data: { postConnection: { edges: [] } } };
  }
}

export const PostCarousel = ({ data }: { data: PostCarouselBlock }) => {
  const [postsData, setPostsData] = React.useState<any>(null);
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

  // Fetch posts on component mount
  React.useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await fetchLatestPosts(data.limit || 20);
        setPostsData(response);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load posts'));
        setIsLoading(false);
      }
    }
    
    loadPosts();
  }, [data.limit]);

  // Sort posts by date in descending order and limit to requested amount
  const sortedPosts = useMemo(() => {
    if (!postsData?.data?.postConnection?.edges) return [];
    
    const currentDate = new Date();
    
    return [...postsData.data.postConnection.edges]
      .filter(edge => edge?.node)
      .filter(edge => {
        // Filter out posts with future dates
        const postDate = edge?.node?.date ? new Date(edge.node.date) : new Date(0);
        return postDate <= currentDate;
      })
      .sort((a, b) => {
        const dateA = a?.node?.date ? new Date(a.node.date) : new Date(0);
        const dateB = b?.node?.date ? new Date(b.node.date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, data.limit || 20); // Limit to exactly the number requested
  }, [postsData, data.limit]);

  return (
    <Section color={data.color}>
      <div className="py-8">
        <Container size="large">
          <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
            <div>
              {data.title && (
                <AnimatedTitle 
                  className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6"
                  animated={data.animatedTitle}
                >
                  {data.title}
                </AnimatedTitle>
              )}
              
              {data.subtitle && (
                <p className="text-lg text-muted-foreground">
                  {data.subtitle}
                </p>
              )}
              
              {data.viewAllLink && (
                <Link
                  href="/posts"
                  className="group mt-3 inline-flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-md md:text-base lg:text-lg"
                >
                  {data.viewAllText || "View all posts"}
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
              >
                <ArrowLeft className="size-5" />
              </Button>
              
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                className="disabled:pointer-events-auto"
              >
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[3/2] w-full rounded-xl" />
                  <Skeleton className="h-8 w-3/4 mt-4" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-5/6 mt-1" />
                  <Skeleton className="h-4 w-1/4 mt-6" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-red-500">Failed to load posts. Please try again later.</p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* No posts state */}
          {!isLoading && sortedPosts.length === 0 && (
            <div className="text-center py-12">
              <ThemedCard variant="outline">
                <div className="p-6">
                  <p className="text-gray-500">No posts found.</p>
                </div>
              </ThemedCard>
            </div>
          )}

          {/* Carousel */}
          {!isLoading && sortedPosts.length > 0 && (
            <div className="w-full">
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
                  {sortedPosts.map((postData) => {
                    if (!postData?.node) return null;
                    
                    const post = postData.node;
                    const formattedDate = post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : '';
                    const postUrl = `/posts/${post._sys.breadcrumbs.join("/")}`;

                    return (
                      <CarouselItem key={post._sys.filename} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="flex flex-col h-full bg-white rounded-xl">
                          <Link href={postUrl} className="group">
                            <div className="flex aspect-[3/2] overflow-clip rounded-xl">
                              <div className="flex-1">
                                <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                                  {post.heroImg ? (
                                    <Image
                                      src={post.heroImg}
                                      alt={post.title || "Post image"}
                                      fill
                                      className="object-cover object-center"
                                      priority={true}
                                      sizes="(max-width: 360px) 100vw, 100vw"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gradient-to-r from-blue-400 to-purple-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          <div className="p-4">
                            {formattedDate && (
                              <div className="text-sm text-gray-600 text-muted-foreground mb-2">
                                {formattedDate}
                              </div>
                            )}
                          
                            <Link href={postUrl} className="hover:underline">
                              <div className="mb-2 font-bold text-gray-600 text-muted-foreground line-clamp-2 break-words pt-1 text-lg md:mb-3 md:text-xl">
                                {post.title}
                              </div>
                            </Link>
                          
                            {post.excerpt && (
                              <div className="mb-6 line-clamp-2 text-sm text-muted-foreground md:mb-8 text-gray-400">
                                {typeof post.excerpt === 'string' ? (
                                  post.excerpt
                                ) : (
                                  <TinaMarkdown content={post.excerpt} />
                                )}
                              </div>
                            )}
                          
                            <div className="flex items-center justify-center">
                              <Link href={postUrl} className="inline-flex items-center text-sm text-green-500 mt-auto bg-white border-2 border-green-500 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-md transition-all duration-300 hover:shadow-md">
                                Read more <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1.5 group-hover:scale-110" />
                              </Link>
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

export const postCarouselSchema: Template = {
  name: "postCarousel",
  label: "Post Carousel",
  ui: {
    previewSrc: "/blocks/blog-carousel.png",
    defaultItem: {
      title: "Featured Posts",
      subtitle: "Check out our featured articles",
      limit: 5,
      viewAllLink: true,
      viewAllText: "View all posts",
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
      label: "Number of Posts to Display",
      name: "limit",
      ui: {
        validate: (value) => {
          if (value < 1) return "Must display at least 1 post";
          if (value > 20) return "Cannot display more than 20 posts";
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