import type { Collection } from "tinacms";

const Sliders: Collection = {
  label: "Feature Slider",
  name: "sliders",
  path: "content/sliders",
  format: "mdx",

  defaultItem: () => {
    return {
      title: 'New Slider name',
      date: new Date().toISOString(),
 
    }
  },
  ui: {
    router: ({ document }) => {                  
      return `/sliders/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Slider Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      name: "slider_image",
      label: "Slider Image",
    },
    {
      type: "string",
      label: "Affiliate link URL",
      name: "affiliate_url",
      searchable: false,
    },
    {
      type: "string",
      label: "Internal link URL",
      name: "internal_url",
      searchable: false,
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
      searchable: false,
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
      
  ]
}
    

export default Sliders;





