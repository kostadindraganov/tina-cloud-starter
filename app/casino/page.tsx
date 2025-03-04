import Layout from "@/components/layout/layout";
import client from "@/tina/__generated__/client";
import CasinoClientPage from "./client-page";

export default async function CasinoPage() {
  let posts = await client.queries.casinoConnection({
    sort: "date",
  });
  const allPosts = posts;

  while (posts.data?.casinoConnection.pageInfo.hasNextPage) {
    posts = await client.queries.casinoConnection({
      sort: "date",
      after: posts.data.casinoConnection.pageInfo.endCursor,
    });
    allPosts.data.casinoConnection.edges.push(...posts.data.casinoConnection.edges);
  }

  allPosts.data.casinoConnection.edges.reverse();

  return (
    <Layout rawPageData={allPosts.data}>
      <CasinoClientPage {...allPosts} />
    </Layout>
  );
}
