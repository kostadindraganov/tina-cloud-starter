import React from "react";
import { Metadata } from "next";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import PostClientPage from "./client-page";

type Props = {
  params: { filename: string[] };
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await client.queries.post({
    relativePath: `${params.filename.join("/")}.mdx`,
  });
  
  const post = data.data.post;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const url = `${baseUrl}/posts/${params.filename.join('/')}`;
  
  return {
    title: post.title,
    description: post.excerpt || `${post.title} | TinaApp`,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || `${post.title} | TinaApp`,
      url,
      siteName: 'TinaApp',
      images: post.heroImg ? [{ url: post.heroImg }] : undefined,
      type: 'article',
      publishedTime: post.date ? post.date : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `${post.title} | TinaApp`,
      images: post.heroImg ? [post.heroImg] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PostPage({
  params,
}: Props) {
  const data = await client.queries.post({
    relativePath: `${params.filename.join("/")}.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <PostClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  let postsQuery = await client.queries.postConnection();
  let allPostEdges: Array<any> = [];
  
  if (postsQuery.data?.postConnection.edges) {
    allPostEdges = [...postsQuery.data.postConnection.edges];
  }

  while (postsQuery.data?.postConnection.pageInfo.hasNextPage) {
    postsQuery = await client.queries.postConnection({
      after: postsQuery.data.postConnection.pageInfo.endCursor,
    });
    
    if (postsQuery.data?.postConnection.edges) {
      allPostEdges.push(...postsQuery.data.postConnection.edges);
    }
  }

  const params = allPostEdges
    .filter(edge => edge && edge.node && edge.node._sys)
    .map(edge => ({
      filename: edge.node._sys.breadcrumbs,
    }));

  return params;
}
