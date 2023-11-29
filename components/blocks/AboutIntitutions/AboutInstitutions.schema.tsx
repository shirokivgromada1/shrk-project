import { Template } from "tinacms";

export const aboutInstitutionsComponentSchema: Template = {
  name: "AboutInstitutions",
  label: "About Institutions",
  ui: {
    previewSrc: "/blocks/AboutInstitutions/about-institutions.jpg",
  },
  fields: [
    {
      type: "image",
      label: "Image",
      name: "image",
    },
    {
      type: "string",
      label: "Culturals title",
      name: "cultTitle",
    },
    {
      type: "string",
      label: "Culturals title Eng",
      name: "cultTitleEng",
    },
    {
      type: "object",
      label: "Culturals Insitutions",
      name: "culturals",
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
          type: "boolean",
          label: "Hidden",
          name: "hidden",
        },
      ],
    },
    {
      type: "string",
      label: "Educational title",
      name: "educTitle",
    },
    {
      type: "string",
      label: "Educational title Eng",
      name: "educTitleEng",
    },
    {
      type: "object",
      label: "Educational Insitutions",
      name: "educationals",
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
          type: "boolean",
          label: "Hidden",
          name: "hidden",
        },
      ],
    },
    {
      type: "string",
      label: "Pharmacies title",
      name: "pharTitle",
    },
    {
      type: "string",
      label: "Pharmacies title Eng",
      name: "pharTitleEng",
    },
    {
      type: "object",
      label: "Pharmacies",
      name: "pharmacies",
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
          type: "boolean",
          label: "Hidden",
          name: "hidden",
        },
      ],
    },
  ],
};
