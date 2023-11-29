import { Template } from "tinacms";

export const strategyDescComponentSchema: Template = {
  name: "StrategyDesc",
  label: "Strategy Desc",
  ui: {
    previewSrc: "/blocks/StrategyDesc/strategy-desc.jpg",
    defaultItem: {
      title: "Стратегія розвитку",
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
      type: "rich-text",
      label: "Text block",
      name: "text",
    },
    {
      type: "rich-text",
      label: "Text block Eng",
      name: "textEng",
    },
    {
      type: "object",
      list: true,
      label: "Goals list",
      name: "goals",
      ui: {
        itemProps: (item) => {
          return { label: item?.title };
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
          label: "Description",
          name: "desc",
        },
        {
          type: "string",
          label: "Description Eng",
          name: "descEng",
        },
        {
          type: "image",
          label: "Image",
          name: "image",
        },
        {
          type: "boolean",
          label: "Hidden",
          name: "isHidden",
        },
      ],
    },
  ],
};
