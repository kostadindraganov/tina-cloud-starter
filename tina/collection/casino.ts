import { videoBlockSchema } from "@/components/blocks/video";
import type { Collection } from "tinacms";

const Casino: Collection = {
  label: "Casino item",
  name: "casino",
  path: "content/casino",
  format: "mdx",
  ui: {
    router: ({ document }) => {                  
      return `/casino/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Brand Name",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      label: "Year Established",
      name: "year_established",
      type: "datetime",
      ui: {
        dateFormat: 'YYYY',
        parse: (value: any) => {
          return value && typeof value.format === 'function' ? value.format('YYYY') : value;
        },
      },
    },
    {
      type: "string",
      label: "Owner Company",
      name: "owner",
    },
    {
      label: "Authorities",
      name: "authorities",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: `${item.authorities.split('/').pop().replace('.md', '')} ` }
        },
          defaultItem: {
            authorities: "Edit Authoritie",
        }
      },
      fields: [
        {
          label: 'Authorities',
          name: 'authorities',
          type: 'reference',
          collections: ['authorities'],
        },
      ]
    },
    {
      type: "image",
      name: "heroImg",
      label: "Hero Image",
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
    },
    {
      type: "datetime",
      label: "Posted Date",
      name: "date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: "rich-text",
      label: "Body",
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
  ],
};

export default Casino;
