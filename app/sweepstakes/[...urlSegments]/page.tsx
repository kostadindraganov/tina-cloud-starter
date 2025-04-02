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
    const sweepstakesData = await client.queries.sweepstakesItemQuery({
      relativePath: `${params.urlSegments.join("/")}.mdx`,
    });

    return (
      <Layout rawPageData={sweepstakesData}>
        <SweepstakesClientPage 
          data={sweepstakesData}
        />
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching sweepstakes page:", error);
    notFound();
  }
}

