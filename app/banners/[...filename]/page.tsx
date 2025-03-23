import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import { notFound } from "next/navigation";
import ClientBannerPage from "./client-page";

export default async function BannerPage({
  params,
}: {
  params: { filename: string[] };
}) {
  try {
    // Use the correct path to fetch the banner - directly from content/banners
    const data = await client.queries.banners({
      relativePath: `${params.filename.join("/")}.mdx`,
    });

    return (
      <Layout rawPageData={data}>
        <ClientBannerPage {...data} />
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching banner:", error);
    return notFound();
  }
}

export async function generateStaticParams() {
  try {
    let bannersResult = await client.queries.bannersConnection();
    const allEdges = [...(bannersResult.data.bannersConnection?.edges || [])];

    while (bannersResult.data.bannersConnection?.pageInfo.hasNextPage) {
      bannersResult = await client.queries.bannersConnection({
        after: bannersResult.data.bannersConnection?.pageInfo.endCursor,
      });
      
      if (bannersResult.data.bannersConnection?.edges) {
        allEdges.push(...bannersResult.data.bannersConnection.edges);
      }
    }

    const params = allEdges
      .filter(edge => edge && edge.node && edge.node._sys)
      .map((edge) => ({
        filename: edge!.node!._sys.breadcrumbs,
      }));

    return params;
  } catch (error) {
    console.error("Error generating static params for banners:", error);
    return [];
  }
} 