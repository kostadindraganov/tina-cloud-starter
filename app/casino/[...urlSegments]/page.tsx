import React from "react";
import { notFound } from 'next/navigation';
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";
import type { Metadata } from "next";
import { generateContentMetadata, generateFallbackMetadata } from "@/lib/metadata";

/**
 * Generate metadata for casino pages
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { urlSegments: string[] } 
}): Promise<Metadata> {
  try {
    const { data } = await client.queries.casinoItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });
    
    const casino = data.casino;
    const path = `/casino/${params.urlSegments.join("/")}`;
    
    return generateContentMetadata({
      data: casino,
      type: 'casino',
      path,
    });
  } catch (error) {
    console.error("[generateMetadata] Error generating casino metadata:", error);
    return generateFallbackMetadata('casino');
  }
}

/**
 * Casino page component
 */
export default async function CasinoPage({
  params,
}: {
  params: { urlSegments: string[] };
}): Promise<React.ReactElement> {
  try {
    const data = await client.queries.casinoItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });

    return (
      <Layout rawPageData={data}>
        <CasinoClientPage {...data} />
      </Layout>
    );
  } catch (error) {
    console.error("[CasinoPage] Failed to fetch casino data:", error);
    notFound();
  }
}

/**
 * Generate static paths for all casino pages
 */
export async function generateStaticParams(): Promise<{ urlSegments: string[] }[]> {
  try {
    let casinoConnection = await client.queries.casinoConnection();
    const allCasinos = casinoConnection;
    
    // Fetch all pages of results
    while (casinoConnection.data?.casinoConnection.pageInfo.hasNextPage) {
      casinoConnection = await client.queries.casinoConnection({
        after: casinoConnection.data.casinoConnection.pageInfo.endCursor,
      });
      
      if (allCasinos.data?.casinoConnection?.edges && casinoConnection.data?.casinoConnection?.edges) {
        allCasinos.data.casinoConnection.edges.push(...casinoConnection.data.casinoConnection.edges);
      }
    }
    
    // Reverse to show newest first if needed
    if (allCasinos.data?.casinoConnection?.edges) {
      allCasinos.data.casinoConnection.edges.reverse();
    }
    
    // Map to the expected params format
    const params = allCasinos.data?.casinoConnection?.edges?.map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    })) || [];
    
    return params;
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate casino static paths:", error);
    return [];
  }
}
