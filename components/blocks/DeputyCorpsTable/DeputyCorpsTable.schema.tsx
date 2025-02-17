import { Template } from "tinacms";

export const deputyCorpsTableComponentSchema: Template = {
  name: "DeputyCorpsTable",
  label: "Deputy Corps Table",
  ui: {
    previewSrc: "/blocks/DeputyCorpsTable/corps-image.jpg",
    defaultItem: {
      title: "ДЕПУТАТСЬКИЙ КОРПУС",
      nameHeader: "ПІБ",
      positionHeader: "Посада",
      contactsHeader: "Контакти"
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
      label: "Subtitle",
      name: "subtitle",
    },
    {
      type: "string",
      label: "Name Column Header",
      name: "nameHeader",
    },
    {
      type: "string",
      label: "Position Column Header",
      name: "positionHeader",
    },
    {
      type: "string",
      label: "Contacts Column Header",
      name: "contactsHeader",
    },
    {
      type: "object",
      label: "Deputy",
      name: "deputy",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.fullname };
        },
      },
      fields: [
        {
          label: "Fullname",
          name: "fullname",
          type: "string",
        },
        {
          label: "Position",
          name: "position",
          type: "string",
        },
        {
          label: "Phone",
          name: "phone",
          type: "string",
        },
        {
          label: "Email",
          name: "email",
          type: "string",
        },
        {
          label: "Hidden",
          name: "hidden",
          type: "boolean",
        },
      ],
    },
  ],
};
