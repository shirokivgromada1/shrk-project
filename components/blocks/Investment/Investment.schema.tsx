import { Template } from "tinacms";

export const investmentComponentSchema: Template = {
  name: "Investment",
  label: "Investment",
  ui: {
    previewSrc: "/blocks/Investment/investment.jpg",
    defaultItem: {
      title: "ІНВЕСТИЦІЇ",
    },
  },
  fields: [
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
      label: "Subtitle",
      name: "subtitle",
    },
    {
      type: "string",
      label: "Subtitle Eng",
      name: "subtitleEng",
    },
    {
      type: "image",
      label: "Image",
      name: "image",
    },
    {
      type: "rich-text",
      label: "First text block",
      name: "firstText",
    },
    {
      type: "rich-text",
      label: "First text block Eng",
      name: "firstTextEng",
    },
    {
      type: "rich-text",
      label: "Second text block",
      name: "secondText",
    },
    {
      type: "rich-text",
      label: "Second text block Eng",
      name: "secondTextEng",
    },
    {
      type: "string",
      label: "Invest title",
      name: "investTitle",
    },
    {
      type: "string",
      label: "Invest title Eng",
      name: "investTitleEng",
    },
    {
      type: "object",
      label: "Invest button",
      name: "button",
      fields: [
        {
          type: "string",
          label: "Button text",
          name: "text",
        },
        {
          type: "string",
          label: "Button text Eng",
          name: "textEng",
        },
        {
          type: "string",
          label: "URL",
          name: "url",
        },
      ],
    },
  ],
};
