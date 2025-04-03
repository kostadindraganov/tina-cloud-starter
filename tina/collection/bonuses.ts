import type { Collection } from "tinacms";
import { videoBlockSchema } from "@/components/blocks/video";

export interface Bonus {
  title: string
  logo?: string
  affiliate_url?: string
  areview_url?: string
  start_date?: string
  end_date?: string
  excerpt?: string
  bonus_code?: string
  bonus_title?: string
  bonus_type?: string
  bonus_amount?: string
  _sys: {
    breadcrumbs: string[]
  }
}

const Bonuses: Collection = {
  label: "Bonuses",
  name: "bonuses",
  path: "content/bonuses",
  format: "mdx",

  defaultItem: () => {
    return {
      title: 'New Bonus',
      date: new Date().toISOString(),
 
    }
  },
  ui: {
    router: ({ document }) => {                  
      return `/bonuses/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Bonus Name",
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
      type: "string",
      label: "Affiliate Program URL",
      name: "affiliate_url",
    },
    {
      type: "string",
      label: "Review  URL",
      name: "areview_url",
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
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
    },
    {
      type: "string",
      label: "BONUS CODE",
      name: "bonus_code",
    },
    {
      type: "string",
      label: "BONUS Title",
      name: "bonus_title",
    },
    {
      type: "string",
      label: "BONUS Type",
      name: "bonus_type",
    },
    {
      type: "string",
      label: "BONUS Amount",
      name: "bonus_amount",
    }
  ]
}
    
 

export default Bonuses;





