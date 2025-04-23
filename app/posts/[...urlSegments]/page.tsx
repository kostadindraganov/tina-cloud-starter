import React from 'react';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';
import type { Metadata } from "next";
import { generateContentMetadata, generateFallbackMetadata } from "@/lib/metadata";
import { postService } from '@/lib/api/services/postService';
import client from '@/tina/__generated__/client';
import { notFound } from 'next/navigation';

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


export default async function PostPage({
  params,
}: {
  params: { urlSegments: string[] };
}): Promise<React.ReactElement> {
  try {
    const resolvedParams = await params;
    const filepath = resolvedParams.urlSegments.join('/');
    const data = await client.queries.post({
      relativePath: `${filepath}.mdx`,
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






export async function generateStaticParams() {
  try {

    let posts = await client.queries.postConnection();
    const allPosts = posts;
  
    if (!allPosts.data.postConnection.edges) {
      return [];
    }
  
    while (posts.data?.postConnection.pageInfo.hasNextPage) {
      posts = await client.queries.postConnection({
        after: posts.data.postConnection.pageInfo.endCursor,
      });
  
      if (!posts.data.postConnection.edges) {
        break;
      }
  
      allPosts.data.postConnection.edges.push(...posts.data.postConnection.edges);
    }
  
    const params =
      allPosts.data?.postConnection.edges.map((edge) => ({
        urlSegments: edge?.node?._sys.breadcrumbs,
      })) || [];
  
    return params;
   
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate post paths:", error);
    return [];
  }
}