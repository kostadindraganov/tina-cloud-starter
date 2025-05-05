import type { Collection } from "tinacms";

const Banners: Collection = {
  label: "Banners",
  name: "banners",
  path: "content/banners",
  format: "mdx",

  defaultItem: () => {
    return {
      title: 'New Banner name',
      date: new Date().toISOString(),
 
    }
  },
  ui: {
    router: ({ document }) => {                  
      return `/banners/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Banner Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      name: "banner_image",
      label: "Banner Image",
    },
    {
      type: 'string',
      name: 'position',
      label: 'Position',
      list: true,
        options: [
          {
            value: "top",
            label: "TOP"
          }, {
            value: "center",
            label: "CENTER"
          }, {
            value: "bottom",
            label: "BOTTOM"
          }, {
            value: "sidebar",
            label: "SIDEBAR"
          },
        ]
    },
    {
      type: "string",
      label: "Affiliate link URL",
      name: "affiliate_url",
    },
    {
      type: "datetime",
      label: "Start Date",
      name: "start_date",
      required: true,
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: "datetime",
      label: "End Date",
      name: "end_date",
      required: true,
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
      
  ]
}
    

export default Banners;





