import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import SweepstakesClientPage from "./client-page";

export default async function SweepstakesPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const data = await client.queries.sweepstakesItemQuery({
    relativePath: `${params.filename.join("/")}.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <SweepstakesClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  let posts = await client.queries.sweepstakesConnection();
  const allPosts = posts;

  while (posts.data?.sweepstakesConnection.pageInfo.hasNextPage) {
    posts = await client.queries.postConnection({
      after: posts.data.sweepstakesConnection.pageInfo.endCursor,
    });
    allPosts.data.sweepstakesConnection.edges.push(...posts.data.sweepstakesConnection.edges);
  }

  const params =
    allPosts.data?.sweepstakesConnection.edges.map((edge) => ({
      filename: edge.node._sys.breadcrumbs,
    })) || [];

  return params;
}
