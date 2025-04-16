import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { Testimonial } from "./testimonial";
import { Video } from "./video";
import { Carousel } from "./carousel";
import { LatestPosts, latestPostsSchema } from "./latest-posts";
import { PostCarousel, postCarouselSchema } from "./post-carousel";
import { BonusCarousel, bonusCarouselSchema } from "./bonus-carousel";
import { HeroParallaxBlock, heroParallaxBlockSchema } from "./hero-parallax";
import { SweepstakesList, sweepstakesListSchema } from "./sweepstakes-list";
import { CasinoCarousel, casinoCarouselSchema } from "./casino-carousel";
import { TallyForm, tallyFormBlockSchema } from "./tally-form";
import { ContactCta, contactCtaBlockSchema } from "./contact-cta";
import { PositionBannerBlockComponent, positionBannerBlockSchema } from "./position-banner-block";

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  return (
    <>
      {props.blocks
        ? props.blocks.map(function (block, i) {
            return (
              <div key={i} data-tina-field={tinaField(block)}>
                <Block {...block} />
              </div>
            );
          })
        : null}
    </>
  );
};

// Extend PageBlocks to include our carousel types
type ExtendedPageBlocks = PageBlocks | 
  { __typename: "PageBlocksCarousel" } | 
  { __typename: "PageBlocksPostCarousel" } |
  { __typename: "PageBlocksBonusCarousel" } |
  { __typename: "PageBlocksHeroParallax" } |
  { __typename: "PageBlocksSweepstakesList" } |
  { __typename: "PageBlocksCasinoCarousel" } |
  { __typename: "PageBlocksTallyForm" } |
  { __typename: "PageBlocksContactCta" } |
  { __typename: "PageBlocksPositionBanner" };

const Block = (block: ExtendedPageBlocks) => {
  switch (block.__typename) {
    case "PageBlocksVideo":
      return <Video data={block} />;
    case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksContent":
      return <Content data={block} />;
    case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block} />;
    case "PageBlocksCarousel":
      return <Carousel data={block as any} />;
    case "PageBlocksPosts":
      return <LatestPosts data={block as any} />;
    case "PageBlocksPostCarousel":
      return <PostCarousel data={block as any} />;
    case "PageBlocksBonusCarousel":
      return <BonusCarousel data={block as any} />;
    case "PageBlocksHeroParallax":
      return <HeroParallaxBlock data={block as any} />;
    case "PageBlocksSweepstakesList":
      return <SweepstakesList data={block as any} />;
    case "PageBlocksCasinoCarousel":
      return <CasinoCarousel data={block as any} />;
    case "PageBlocksTallyForm":
      return <TallyForm data={block as any} />;
    case "PageBlocksContactCta":
      return <ContactCta data={block as any} />;
    case "PageBlocksPositionBanner":
      return <PositionBannerBlockComponent data={block as any} />;
    default:
      return null;
  }
};

// The template map which connects string values to components
const TEMPLATE_MAP = {
  posts: LatestPosts,
  postCarousel: PostCarousel,
  bonusCarousel: BonusCarousel,
  heroParallax: HeroParallaxBlock,
  sweepstakesList: SweepstakesList,
  casinoCarousel: CasinoCarousel,
  tallyForm: TallyForm,
  contactCta: ContactCta,
  positionBanner: PositionBannerBlockComponent,
};

export const SCHEMA_MAP = {
  posts: latestPostsSchema,
  postCarousel: postCarouselSchema,
  bonusCarousel: bonusCarouselSchema,
  heroParallax: heroParallaxBlockSchema,
  sweepstakesList: sweepstakesListSchema,
  casinoCarousel: casinoCarouselSchema,
  tallyForm: tallyFormBlockSchema,
  contactCta: contactCtaBlockSchema,
  positionBanner: positionBannerBlockSchema,
};

export { BonusCarousel, bonusCarouselSchema } from "./bonus-carousel";
export { SweepstakesList, sweepstakesListSchema } from "./sweepstakes-list";
export { CasinoCarousel, casinoCarouselSchema } from "./casino-carousel";
export { ContactCta, contactCtaBlockSchema } from "./contact-cta";
export { PositionBannerBlockComponent, positionBannerBlockSchema };
