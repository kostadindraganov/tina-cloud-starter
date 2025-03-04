import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import CasinoClientPage from "./client-page";

export default async function CasinoPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const data = await client.queries.casinoItemQuery({
    relativePath: `${params.filename.join("/")}.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <CasinoClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  let posts = await client.queries.casinoConnection();
  const allPosts = posts;

  while (posts.data?.casinoConnection.pageInfo.hasNextPage) {
    posts = await client.queries.casinoConnection({
      after: posts.data.casinoConnection.pageInfo.endCursor,
    });
    if (allPosts.data?.casinoConnection?.edges && posts.data?.casinoConnection?.edges) {
      allPosts.data.casinoConnection.edges.push(...posts.data.casinoConnection.edges);
    }
  }

  if (allPosts.data?.casinoConnection?.edges) {
    allPosts.data.casinoConnection.edges.reverse();
  }

  const params =
    allPosts.data?.casinoConnection?.edges?.map((edge) => ({
      filename: edge?.node?._sys.breadcrumbs,
    })) || [];

  return params;
}
