import { WebsiteSchema, OrganizationSchema } from './index';

interface SiteSchemaWrapperProps {
  children: React.ReactNode;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamblementor.com';

export default function SiteSchemaWrapper({ children }: SiteSchemaWrapperProps) {
  return (
    <>
      {/* Global Website Schema */}
      <WebsiteSchema
        url={baseUrl}
        name="GambleMentor Network"
        description="Leading source for casino news, gambling guides, crypto casino reviews, and sweepstakes strategies."
        searchUrl={`${baseUrl}/search`}
      />
      
      {/* Global Organization Schema */}
      <OrganizationSchema
        name="GambleMentor Networks"
        url={baseUrl}
        logo={`${baseUrl}/logo/logo.png`}
        description="Leading source for casino news, gambling guides, and crypto casino tips."
        socialMedia={[
          "https://twitter.com/gamblementor",
          "https://facebook.com/gamblementor"
        ]}
        contactPoint={{
          contactType: "Customer Service",
          email: "support@gamblementor.com"
        }}
      />
      
      {children}
    </>
  );
} 