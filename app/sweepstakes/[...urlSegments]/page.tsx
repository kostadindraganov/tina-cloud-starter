import React from "react";
import { notFound } from 'next/navigation';
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import SweepstakesClientPage from "./client-page";

export default async function SweepstakesPage({
  params,
}: {
  params: { urlSegments: string[] };
}) {
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
    console.error("Error fetching sweepstakes page:", error);
    notFound();
  }
}

export async function generateStaticParams() {
  let posts = await client.queries.sweepstakesConnection();
  const allPosts = posts;

  while (posts.data?.sweepstakesConnection.pageInfo.hasNextPage) {
    posts = await client.queries.sweepstakesConnection({
      after: posts.data.sweepstakesConnection.pageInfo.endCursor,
    });
    if (allPosts.data?.sweepstakesConnection?.edges && posts.data?.sweepstakesConnection?.edges) {
      allPosts.data.sweepstakesConnection.edges.push(...posts.data.sweepstakesConnection.edges);
    }
  }

  if (allPosts.data?.sweepstakesConnection?.edges) {
    allPosts.data.sweepstakesConnection.edges.reverse();
  }

  const params =
    allPosts.data?.sweepstakesConnection?.edges?.map((edge) => ({
      filename: edge?.node?._sys.breadcrumbs,
    })) || [];

  return params;
}
