import React from 'react';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';
import type { Metadata } from "next";
import { generateContentMetadata, generateFallbackMetadata } from "@/lib/metadata";

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
    const { data } = await client.queries.post({
      relativePath: `${params.urlSegments.join('/')}.mdx`,
    });
    
    const post = data.post;
    const path = `/posts/${params.urlSegments.join("/")}`;
    
    return generateContentMetadata({
      data: post,
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
    const data = await client.queries.post({
      relativePath: `${params.urlSegments.join('/')}.mdx`,
    });

    return (
      <Layout rawPageData={data}>
        <PostClientPage {...data} />
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
    let postConnection = await client.queries.postConnection();
    const allPosts = postConnection;

    if (!allPosts.data.postConnection.edges) {
      return [];
    }

    while (postConnection.data?.postConnection.pageInfo.hasNextPage) {
      postConnection = await client.queries.postConnection({
        after: postConnection.data.postConnection.pageInfo.endCursor,
      });

      if (!postConnection.data.postConnection.edges) {
        break;
      }

      allPosts.data.postConnection.edges.push(...postConnection.data.postConnection.edges);
    }

    const params = allPosts.data?.postConnection.edges.map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    })) || [];

    return params;
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate post paths:", error);
    return [];
  }
}
