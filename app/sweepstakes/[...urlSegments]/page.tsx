import React from "react";
import { notFound } from 'next/navigation';
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import SweepstakesClientPage from "./client-page";
import type { Metadata } from "next";
import { generateContentMetadata, generateFallbackMetadata } from "@/lib/metadata";

/**
 * Generate metadata for sweepstakes pages
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { urlSegments: string[] } 
}): Promise<Metadata> {
  try {
    const { data } = await client.queries.sweepstakesItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });
    
    const sweepstakes = data.sweepstakes;
    const path = `/sweepstakes/${params.urlSegments.join("/")}`;
    
    return generateContentMetadata({
      data: sweepstakes,
      type: 'sweepstakes',
      path,
    });
  } catch (error) {
    console.error("[generateMetadata] Error generating sweepstakes metadata:", error);
    return generateFallbackMetadata('sweepstakes');
  }
}

/**
 * Sweepstakes page component
 */
export default async function SweepstakesPage({
  params,
}: {
  params: { urlSegments: string[] };
}): Promise<React.ReactElement> {
  try {
    const data = await client.queries.sweepstakesItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });

    return (
      <Layout rawPageData={data}>
        <SweepstakesClientPage {...data} />
      </Layout>
    );
  } catch (error) {
    console.error("[SweepstakesPage] Failed to fetch sweepstakes data:", error);
    notFound();
  }
}

/**
 * Generate static paths for all sweepstakes pages
 */
export async function generateStaticParams(): Promise<{ urlSegments: string[] }[]> {
  try {
    let sweepstakesConnection = await client.queries.sweepstakesConnection();
    const allSweepstakes = sweepstakesConnection;

    while (sweepstakesConnection.data?.sweepstakesConnection.pageInfo.hasNextPage) {
      sweepstakesConnection = await client.queries.sweepstakesConnection({
        after: sweepstakesConnection.data.sweepstakesConnection.pageInfo.endCursor,
      });
      
      if (allSweepstakes.data?.sweepstakesConnection?.edges && 
          sweepstakesConnection.data?.sweepstakesConnection?.edges) {
        allSweepstakes.data.sweepstakesConnection.edges.push(
          ...sweepstakesConnection.data.sweepstakesConnection.edges
        );
      }
    }

    if (allSweepstakes.data?.sweepstakesConnection?.edges) {
      allSweepstakes.data.sweepstakesConnection.edges.reverse();
    }

    const params = allSweepstakes.data?.sweepstakesConnection?.edges?.map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    })) || [];

    return params;
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate sweepstakes paths:", error);
    return [];
  }
}
