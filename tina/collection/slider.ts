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
    },
    {
      label: 'Actions',
      name: 'actions',
      type: 'object',
      list: true,
      ui: {
        defaultItem: {
          label: 'Action Label',
          type: 'button',
          icon: true,
          link: '/',
        },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          type: 'string',
        },
        {
          label: 'Type',
          name: 'type',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          label: 'Icon',
          name: 'icon',
          type: 'boolean',
        },
        {
          label: 'Link',
          name: 'link',
          type: 'string',
        },
      ],
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





