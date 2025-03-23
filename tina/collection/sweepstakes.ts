import type { Collection } from "tinacms";
import { videoBlockSchema } from "@/components/blocks/video";

const Sweepstakes: Collection = {
  label: "Sweepstakes",
  name: "sweepstakes",
  path: "content/sweepstakes",
  format: "mdx",

  defaultItem: () => {
    return {
      title: 'New Sweepstakes',
      date: new Date().toISOString(),
 
    }
  },
  ui: {
    router: ({ document }) => {                  
      return `/sweepstakes/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Sweepstakes Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      name: "logo",
      label: "LOGO Image",
    },
    {
      type: "image",
      name: "heroImg",
      label: "Hero Image",
    },
    {
      type: "string",
      label: "Affiliate Program URL",
      name: "affiliate_url",
    },
    {
      type: "datetime",
      label: "Start Date",
      name: "start_date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: "datetime",
      label: "End Date",
      name: "end_date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: "string",
      label: "Coins / FREE",
      name: "costs",
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
    },
    {
      type: "rich-text",
      label: "Additional Info:",
      name: "_body",
      templates: [
        {
          name: "BlockQuote",
          label: "Block Quote",
          fields: [
            {
              name: "children",
              label: "Quote",
              type: "rich-text",
            },
            {
              name: "authorName",
              label: "Author",
              type: "string",
            },
          ],
        },
        {
          name: "DateTime",
          label: "Date & Time",
          inline: true,
          fields: [
            {
              name: "format",
              label: "Format",
              type: "string",
              options: ["utc", "iso", "local"],
            },
          ],
        },
        {
          name: "NewsletterSignup",
          label: "Newsletter Sign Up",
          fields: [
            {
              name: "children",
              label: "CTA",
              type: "rich-text",
            },
            {
              name: "placeholder",
              label: "Placeholder",
              type: "string",
            },
            {
              name: "buttonText",
              label: "Button Text",
              type: "string",
            },
            {
              name: "disclaimer",
              label: "Disclaimer",
              type: "rich-text",
            },
          ],
          ui: {
            defaultItem: {
              placeholder: "Enter your email",
              buttonText: "Notify Me",
            },
          },
        },
        videoBlockSchema,
      ],
      isBody: true,
    },
    {
      type: 'string',
      name: 'tags',
      label: 'Tags',
      list: true,
      searchable: true,
      ui: {
        component: 'tags',
      },
    },
    {
      type: "string",
      label: "Prize Pool",
      name: "prize_pool",
    },
      {
        type: "string",
        label: "Prizes",
        name: "prizes",
      },
      {
        type: "string",
        label: "Eligibility",
        name: "eligibility",
      },
      {
        type: "string",
        label: "Entry Frequency",
        name: "entry_frequency",
      },
      {
        type: "string",
        label: "Entry Limit",
        name: "entry_limit",
      },
      
      
      
  ]
}
    
 

export default Sweepstakes;





