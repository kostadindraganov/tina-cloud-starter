"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { Template } from "tinacms";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import client from "../../tina/__generated__/client";
import { 
  ThemedCard, 
  ThemedCardContent, 
  ThemedCardFooter, 
  ThemedCardHeader, 
  ThemedCardTitle 
} from "../ui/themed-card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { AnimatedTitle } from "../ui/animated-title";

// Define our custom interface for Latest Posts block
interface LatestPostsBlock {
  title?: string;
  subtitle?: string;
  limit?: number;
  viewAllLink?: boolean;
  viewAllText?: string;
  width?: "small" | "medium" | "large";
  color?: "default" | "tint" | "primary";
  animatedTitle?: boolean;
}

// Function to fetch latest posts
async function fetchLatestPosts(limit: number = 3) {
  try {
    const postsResponse = await client.queries.postConnection({
      first: limit,
    });
    return postsResponse;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { data: { postConnection: { edges: [] } } };
  }
}

export const LatestPosts = ({ data }: { data: LatestPostsBlock }) => {
  const [postsData, setPostsData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Fetch posts on component mount
  React.useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await fetchLatestPosts(data.limit || 3);
        setPostsData(response);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load posts'));
        setIsLoading(false);
      }
    }
    
    loadPosts();
  }, [data.limit]);

  // Sort posts by date in descending order
  const sortedPosts = useMemo(() => {
    if (!postsData?.data?.postConnection?.edges) return [];
    
    return [...postsData.data.postConnection.edges]
      .filter(edge => edge?.node)
      .sort((a, b) => {
        const dateA = a?.node?.date ? new Date(a.node.date) : new Date(0);
        const dateB = b?.node?.date ? new Date(b.node.date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  }, [postsData]);

  return (
    <Section color={data.color}>
      <Container
        className="transition-colors duration-300"
        size="large"
      >
        {/* Section title */}
        {data.title && (
          <div className="mb-8">
            <AnimatedTitle 
              className="text-3xl font-bold"
              animated={data.animatedTitle}
            >
              {data.title}
            </AnimatedTitle>
            {data.subtitle && (
              <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">{data.subtitle}</p>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: data.limit || 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <ThemedCard variant="outline">
              <ThemedCardContent>
                <p className="text-red-500">Failed to load latest posts. Please try again later.</p>
              </ThemedCardContent>
            </ThemedCard>
          </div>
        )}

        {/* No posts state */}
        {!isLoading && sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <ThemedCard variant="outline">
              <ThemedCardContent>
                <p className="text-gray-500">No posts found.</p>
              </ThemedCardContent>
            </ThemedCard>
          </div>
        )}

        {/* Posts grid */}
        {!isLoading && sortedPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.slice(0, data.limit || 3).map((postData, index) => {
              if (!postData?.node) return null;
              const post = postData.node;
              const formattedDate = post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : '';
              const postUrl = `/posts/${post._sys.breadcrumbs.join("/")}`;

              return (
                <ThemedCard 
                  key={index} 
                  className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Featured image */}
                  {post.heroImg && (
                    <Link href={postUrl} className="block w-full h-64 relative overflow-hidden -mt-6 -mx-6 mb-4">
                      <Image
                        src={post.heroImg}
                        alt={post.title || "Post featured image"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  )}

                  {/* Content */}
                  <ThemedCardHeader className="gap-2 p-0">
                    {/* Date */}
                    {formattedDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formattedDate}
                      </p>
                    )}
                    
                    {/* Title */}
                    <Link href={postUrl}>
                      <ThemedCardTitle className="line-clamp-2 transition-colors hover:text-[hsl(var(--primary))]">
                        {post.title}
                      </ThemedCardTitle>
                    </Link>
                  </ThemedCardHeader>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <ThemedCardFooter className="flex-wrap gap-2 pt-4">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <Link 
                          key={idx} 
                          href={`/posts/tag/${tag}`}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </ThemedCardFooter>
                  )}
                </ThemedCard>
              );
            })}
          </div>
        )}

        {/* "View all" link */}
        {data.viewAllLink && (
          <div className="mt-10 text-center">
            <Button 
              asChild
              variant="green"
              size="lg"
              className="gap-2"
            >
              <Link href="/posts">
                {data.viewAllText || "View all posts"}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
};

export const latestPostsSchema: Template = {
  name: "posts",
  label: "Latest Posts",
  ui: {
    previewSrc: "/blocks/latest-posts.png",
    defaultItem: {
      title: "Latest Posts",
      subtitle: "Check out our most recent articles",
      limit: 3,
      viewAllLink: true,
      viewAllText: "View all posts",
      width: "large",
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
