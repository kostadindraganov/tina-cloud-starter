import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import { notFound } from "next/navigation";
import ClientSliderPage from "./client-page";

export default async function SliderPage({
  params,
}: {
  params: { filename: string[] };
}) {
  try {
    // Use the correct path to fetch the slider directly from content/sliders
    const data = await client.queries.sliders({
      relativePath: `${params.filename.join("/")}.mdx`,
    });

    return (
      <Layout rawPageData={data}>
        <ClientSliderPage {...data} />
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching slider:", error);
    return notFound();
  }
}

export async function generateStaticParams() {
  try {
    let slidersResult = await client.queries.slidersConnection();
    const allEdges = [...(slidersResult.data.slidersConnection?.edges || [])];

    while (slidersResult.data.slidersConnection?.pageInfo.hasNextPage) {
      slidersResult = await client.queries.slidersConnection({
        after: slidersResult.data.slidersConnection?.pageInfo.endCursor,
      });
      
      if (slidersResult.data.slidersConnection?.edges) {
        allEdges.push(...slidersResult.data.slidersConnection.edges);
      }
    }

    const params = allEdges
      .filter(edge => edge && edge.node && edge.node._sys)
      .map((edge) => ({
        filename: edge!.node!._sys.breadcrumbs,
      }));

    return params;
  } catch (error) {
    console.error("Error generating static params for sliders:", error);
    return [];
  }
} 