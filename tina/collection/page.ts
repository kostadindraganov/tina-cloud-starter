import type { Collection } from "tinacms";
import { heroBlockSchema } from "@/components/blocks/hero";
import { contentBlockSchema } from "@/components/blocks/content";
import { testimonialBlockSchema } from "@/components/blocks/testimonial";
import { featureBlockSchema } from "@/components/blocks/features";
import { videoBlockSchema } from "@/components/blocks/video";
import { carouselBlockSchema } from "@/components/blocks/carousel";
import { latestPostsSchema } from "@/components/blocks/latest-posts";
import { postCarouselSchema } from "@/components/blocks/post-carousel";
import { bonusCarouselSchema } from "@/components/blocks/bonus-carousel";
import { heroParallaxBlockSchema } from "@/components/blocks/hero-parallax";
import { sweepstakesListSchema } from "@/components/blocks/sweepstakes-list";
import { casinoCarouselSchema } from "@/components/blocks/casino-carousel";
import { tallyFormBlockSchema } from "@/components/blocks/tally-form";
import { contactCtaBlockSchema } from "@/components/blocks/contact-cta";
// import { logosSliderBlockSchema } from "@/components/blocks/logos-slider-block";

const Page: Collection = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join("/");
      if (filepath === "home") {
        return "/";
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      description:
        "The title of the page. This is used to display the title in the CMS",
      isTitle: true,
      required: true,
    },
    {
      type: "object",
      list: true,
      name: "blocks",
      label: "Sections",
      ui: {
        visualSelector: true,
      },
      templates: [
        heroBlockSchema,
        //@ts-ignore
        featureBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
        carouselBlockSchema,
        latestPostsSchema,
        postCarouselSchema,
        bonusCarouselSchema,
        heroParallaxBlockSchema,
        sweepstakesListSchema,
        casinoCarouselSchema,
        tallyFormBlockSchema,
        contactCtaBlockSchema,
      ],
    }
  ],
};

export default Page;
