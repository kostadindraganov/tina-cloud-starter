import React from "react";
import { notFound } from 'next/navigation';
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import BonusesClientPage from "./client-page";

export default async function BonusesPage({
  params,
}: {
  params: { urlSegments: string[] };
}) {
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
    console.error("Error fetching bonuses page:", error);
    notFound();
  }
}

