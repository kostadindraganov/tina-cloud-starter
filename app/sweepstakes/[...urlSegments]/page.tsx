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
  let sweepstakes = await client.queries.sweepstakesConnection();
  const allSweepstakes = sweepstakes;

  if (!allSweepstakes.data.sweepstakesConnection.edges) {
    return [];
  }

  while (sweepstakes.data?.sweepstakesConnection.pageInfo.hasNextPage) {
    sweepstakes = await client.queries.sweepstakesConnection({
      after: sweepstakes.data.sweepstakesConnection.pageInfo.endCursor,
    });

    if (!sweepstakes.data.sweepstakesConnection.edges) {
      break;
    }

    allSweepstakes.data.sweepstakesConnection.edges.push(
      ...sweepstakes.data.sweepstakesConnection.edges
    );
  }

  const params =
    allSweepstakes.data.sweepstakesConnection.edges?.map((edge) => {
      if (edge && edge.node) {
        return {
          urlSegments: edge.node._sys.breadcrumbs,
        };
      }
      return null;
    }).filter(Boolean) || [];

  return params;
}
