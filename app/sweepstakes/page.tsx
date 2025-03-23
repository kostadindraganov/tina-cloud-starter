import Layout from "@/components/layout/layout";
import client from "@/tina/__generated__/client";
import SweepstakesPageClientPage from "./client-page";

export default async function SweepstakesPage() {
  let posts = await client.queries.sweepstakesConnection({
    sort: "start_date",
  });
  const allPosts = posts;

  while (posts.data?.sweepstakesConnection.pageInfo.hasNextPage) {
    posts = await client.queries.postConnection({
      sort: "date",
      after: posts.data.sweepstakesConnection.pageInfo.endCursor,
    });
    allPosts.data.sweepstakesConnection.edges.push(...posts.data.sweepstakesConnection.edges);
  }

  allPosts.data.sweepstakesConnection.edges.reverse();

  return (
    <Layout rawPageData={allPosts.data}>
      <SweepstakesPageClientPage {...allPosts} />
    </Layout>
  );
}
