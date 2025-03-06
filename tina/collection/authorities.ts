import type { Collection } from "tinacms";

const Authorities: Collection = {
  label: "Authorities",
  name: "authorities",
  path: "content/authorities",
  format: "md",
  fields: [
    {
      type: "string",
      label: "Country Name",
      name: "country",
      isTitle: true,
      required: true,
    },
    {
      type: "image",
      label: "Country logo",
      name: "country_logo",
      required: true,
    },
    {
      type: "string",
      label: "Link",
      name: "link",
      required: false,
    },
  ],
};
export default Authorities;
