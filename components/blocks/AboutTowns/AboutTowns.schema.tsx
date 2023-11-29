import { Template } from "tinacms";

export const aboutTownsComponentSchema: Template = {
  name: "AboutTowns",
  label: "About Districts",
  ui: {
    previewSrc: "/blocks/AboutDistricts/about-districts.jpg",
  },
  fields: [
    {
      type: "rich-text",
      label: "Description",
      name: "desc",
    },
    {
      type: "rich-text",
      label: "Description Eng",
      name: "descEng",
    },
    {
      type: "object",
      label: "Districts",
      name: "districts",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.name };
        },
      },
      fields: [
        {
          type: "string",
          label: "Name",
          name: "name",
        },
        {
          type: "string",
          label: "Name Eng",
          name: "nameEng",
        },
        {
          type: "string",
          label: "Villages",
          name: "towns",
        },
        {
          type: "string",
          label: "Villages Eng",
          name: "townsEng",
        },
        {
          type: "boolean",
          label: "Hidden",
          name: "hidden",
        },
      ],
    },
  ],
};
