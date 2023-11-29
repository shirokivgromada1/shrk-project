import { Template } from "tinacms";

export const councilSecretaryDescComponentSchema: Template = {
  name: "CouncilSecretaryDesc",
  label: "Council Secretary Description",
  ui: {
    previewSrc: "/blocks/CouncilSecretaryDesc/council-secretary-desc.jpg",
    defaultItem: {
      title: "Секретар ради",
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
      type: "image",
      label: "Person photo",
      name: "image",
    },
    {
      type: "string",
      label: "Person fullname",
      name: "fullname",
    },
    {
      type: "string",
      label: "Person fullname Eng",
      name: "fullnameEng",
    },
    {
      type: "object",
      label: "Employment",
      name: "employment",
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
          label: "Employment item",
          name: "item",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.desc };
            },
          },
          fields: [
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
          ],
        },
      ],
    },
    {
      type: "object",
      label: "Schedule",
      name: "schedule",
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
          label: "Time",
          name: "time",
        },
        {
          type: "string",
          label: "Time Eng",
          name: "timeEng",
        },
      ],
    },
    {
      type: "object",
      label: "Contacts",
      name: "contacts",
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
          label: "Phone 1",
          name: "phone1",
        },
        {
          type: "string",
          label: "Phone 1 Eng",
          name: "phone1Eng",
        },
        {
          type: "string",
          label: "Phone 2",
          name: "phone2",
        },
        {
          type: "string",
          label: "Phone 2 Eng",
          name: "phone2Eng",
        },
        {
          type: "string",
          label: "Place",
          name: "place",
        },
        {
          type: "string",
          label: "Place Eng",
          name: "placeEng",
        },
        {
          type: "string",
          label: "Email",
          name: "email",
        },
        {
          type: "string",
          label: "Email Eng",
          name: "emailEng",
        },
        {
          type: "string",
          label: "Facebook",
          name: "facebook",
        },
        {
          type: "string",
          label: "Instagram",
          name: "inst",
        },
        {
          type: "string",
          label: "Telegram",
          name: "telegram",
        },
      ],
    },
  ],
};
