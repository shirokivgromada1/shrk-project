import { Template } from "tinacms";

export const aboutDescComponentSchema: Template = {
  name: "AboutDesc",
  label: "About Desc",
  ui: {
    previewSrc: "/blocks/AboutDesc/about-desc.jpg",
    defaultItem: {
      title: "Про громаду",
    },
  },
  fields: [
    {
      type: "image",
      label: "Image",
      name: "image",
    },
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Title Eng",
      name: "titleEng",
    },
    {
      type: "string",
      label: "Number of people",
      name: "people",
    },
    {
      type: "string",
      label: "Number of people year",
      name: "year",
    },
    {
      type: "string",
      label: "Number of people year Eng",
      name: "yearEng",
    },
    {
      type: "string",
      label: "Number of towns",
      name: "towns",
    },
    {
      type: "string",
      label: "Number of towns title",
      name: "townsTitle",
    },
    {
      type: "string",
      label: "Number of towns Eng",
      name: "townsTitleEng",
    },
    {
      type: "string",
      label: "Square of community",
      name: "square",
    },
    {
      type: "string",
      label: "Square of community title",
      name: "squareTitle",
    },
    {
      type: "string",
      label: "Square of community title Eng",
      name: "squareTitleEng",
    },
  ],
};
