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
  { __typename: "PageBlocksPostCarousel" };

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
    default:
      return null;
  }
};

// The template map which connects string values to components
const TEMPLATE_MAP = {
  posts: LatestPosts,
  postCarousel: PostCarousel,
};

export const SCHEMA_MAP = {
  posts: latestPostsSchema,
  postCarousel: postCarouselSchema,
};
