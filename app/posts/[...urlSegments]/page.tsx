import React from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';
import type { Metadata } from "next";
import { generateContentMetadata, generateFallbackMetadata } from "@/lib/metadata";
import { postService } from '@/lib/api/services/postService';

export const revalidate = 300;

/**
 * Generate metadata for blog post pages
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { urlSegments: string[] } 
}): Promise<Metadata> {
  try {
    const relativePath = `${params.urlSegments.join('/')}.mdx`;
    const post = await postService.getPost(relativePath);
    
    const path = `/posts/${params.urlSegments.join("/")}`;
    
    return generateContentMetadata({
      data: {
        ...post,
        heroImg: post.heroImg || undefined
      },
      type: 'post',
      path,
    });
  } catch (error) {
    console.error("[generateMetadata] Error generating post metadata:", error);
    return generateFallbackMetadata('post');
  }
}

/**
 * Blog post page component
 */
export default async function PostPage({
  params,
}: {
  params: { urlSegments: string[] };
}): Promise<React.ReactElement> {
  try {
    const relativePath = `${params.urlSegments.join('/')}.mdx`;
    const post = await postService.getPost(relativePath);
    
    // Create client props
    const clientProps = {
      data: { post },
      variables: { relativePath },
      query: '' // This is required by the component but will be replaced by useTina
    };
    
    return (
      <Layout rawPageData={{ data: { post } }}>
        <PostClientPage {...clientProps} />
      </Layout>
    );
  } catch (error) {
    console.error("[PostPage] Failed to fetch post data:", error);
    notFound();
  }
}

/**
 * Generate static paths for all blog post pages
 */
export async function generateStaticParams(): Promise<{ urlSegments: string[] }[]> {
  try {
    const allPosts = await postService.getPostConnection();

    if (!allPosts.edges) {
      return [];
    }

    let hasNextPage = allPosts.pageInfo.hasNextPage;
    let endCursor = allPosts.pageInfo.endCursor;
    const edges = [...allPosts.edges];

    // Fetch all pages
    while (hasNextPage) {
      const nextConnection = await postService.getPostConnection({
        after: endCursor,
      });

      if (!nextConnection.edges) {
        break;
      }

      edges.push(...nextConnection.edges);
      hasNextPage = nextConnection.pageInfo.hasNextPage;
      endCursor = nextConnection.pageInfo.endCursor;
    }

    const params = edges.map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    })) || [];

    return params;
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate post paths:", error);
    return [];
  }
}
