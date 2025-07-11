import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import ClientPage from "./[...urlSegments]/client-page";
import { 
  WebsiteSchema, 
  OrganizationSchema, 
  BreadcrumbSchema 
} from '@/components/structured-data';

export const revalidate = 300;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';

export default async function Home() {
  const data = await client.queries.page({
    relativePath: `home.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      {/* Structured Data for Home Page */}
      <WebsiteSchema
        url={baseUrl}
        name="GambleMentor Network"
        description="Leading source for casino news, gambling guides, crypto casino reviews, and sweepstakes strategies."
        searchUrl={`${baseUrl}/search`}
      />
      
      <OrganizationSchema
        name="GambleMentor Networks"
        url={baseUrl}
        logo={`${baseUrl}/logo/logo.png`}
        description="Leading source for casino news, gambling guides, and crypto casino tips."
        socialMedia={[
          "https://twitter.com/gamblementor",
          "https://facebook.com/gamblementor"
        ]}
      />
      
      <BreadcrumbSchema
        breadcrumbs={[
          { name: "Home", url: baseUrl, position: 1 }
        ]}
      />
      
      <ClientPage {...data} />
    </Layout>
  );
}
