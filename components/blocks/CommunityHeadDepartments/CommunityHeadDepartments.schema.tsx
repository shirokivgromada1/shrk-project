import { Template } from "tinacms";

export const communityHeadDepartmentsComponentSchema: Template = {
  name: "CommunityHeadDepartments",
  label: "Community Head Departments",
  ui: {
    previewSrc:
      "/blocks/CommunityHeadDepartments/community-head-departments.jpg",
    defaultItem: {
      title: "ВІДДІЛИ СІЛЬСЬКОЇ РАДИ",
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
      type: "object",
      label: "Departments",
      name: "departments",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.name };
        },
      },
      fields: [
        {
          type: "image",
          label: "Department icon",
          name: "image",
        },
        {
          type: "string",
          label: "Departments title",
          name: "name",
        },
        {
          type: "string",
          label: "Departments title Eng",
          name: "nameEng",
        },
        {
          type: "string",
          label: "Departments own page",
          name: "link",
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
