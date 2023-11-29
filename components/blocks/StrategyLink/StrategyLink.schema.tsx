import { Template } from "tinacms";

export const strategyLinkComponentSchema: Template = {
  name: "StrategyLink",
  label: "Strategy Link",
  ui: {
    previewSrc: "/blocks/StrategyLink/strategy-link.jpg",
    defaultItem: {
      title:
        "Ознайомитися зі Стратегією сталого розвитку Широківської громади на період 2021-2028 років можна за ",
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
      label: "Title link",
      name: "url",
    },
    {
      type: "string",
      label: "Title link text",
      name: "urlText",
    },
    {
      type: "string",
      label: "Title link text Eng",
      name: "urlTextEng",
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
  ],
};
