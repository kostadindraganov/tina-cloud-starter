import React from "react";
import { notFound } from 'next/navigation';
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import BonusesClientPage from "./client-page";
import type { Metadata } from "next";
import { generateContentMetadata, generateFallbackMetadata } from "@/lib/metadata";

/**
 * Generate metadata for bonuses pages
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { urlSegments: string[] } 
}): Promise<Metadata> {
  try {
    const { data } = await client.queries.bonusesItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });
    
    const bonus = data.bonuses;
    const path = `/bonuses/${params.urlSegments.join("/")}`;
    
    return generateContentMetadata({
      data: bonus,
      type: 'bonuses',
      path,
    });
  } catch (error) {
    console.error("[generateMetadata] Error generating bonus metadata:", error);
    return generateFallbackMetadata('bonuses');
  }
}

/**
 * Bonuses page component
 */
export default async function BonusesPage({
  params,
}: {
  params: { urlSegments: string[] };
}): Promise<React.ReactElement> {
  try {
    const bonusesData = await client.queries.bonusesItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });

    return (
      <Layout rawPageData={bonusesData}>
        <BonusesClientPage 
          data={bonusesData}
        />
      </Layout>
    );
  } catch (error) {
    console.error("[BonusesPage] Failed to fetch bonus data:", error);
    notFound();
  }
}

/**
 * Generate static paths for all bonuses pages
 */
export async function generateStaticParams(): Promise<{ urlSegments: string[] }[]> {
  try {
    let bonusesConnection = await client.queries.bonusesConnection();
    const allBonuses = bonusesConnection;

    while (bonusesConnection.data?.bonusesConnection.pageInfo.hasNextPage) {
      bonusesConnection = await client.queries.bonusesConnection({
        after: bonusesConnection.data.bonusesConnection.pageInfo.endCursor,
      });
      
      if (allBonuses.data?.bonusesConnection?.edges && bonusesConnection.data?.bonusesConnection?.edges) {
        allBonuses.data.bonusesConnection.edges.push(
          ...bonusesConnection.data.bonusesConnection.edges
        );
      }
    }

    // Map to the expected params format
    const params = allBonuses.data?.bonusesConnection?.edges?.map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    })) || [];
    
    return params;
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate bonuses paths:", error);
    return [];
  }
}

