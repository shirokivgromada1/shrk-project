import { Template } from "tinacms";

export const starostinskDistrictsComponentSchema: Template = {
  name: "StarostinskDistricts",
  label: "Starostinsk Districts",
  ui: {
    previewSrc: "/blocks/StarostinskDistricts/starostinsk-districts.jpg",
    defaultItem: {
      title: "Старостинські округи",
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
      label: "Districts",
      name: "districts",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item.name };
        },
      },
      fields: [
        {
          label: "District id",
          name: "id",
          type: "number",
        },
        {
          label: "District name",
          name: "name",
          type: "string",
        },
        {
          label: "District name Eng",
          name: "nameEng",
          type: "string",
        },
        {
          label: "Captain name",
          name: "captain",
          type: "string",
        },
        {
          label: "Captain name Eng",
          name: "captainEng",
          type: "string",
        },
        {
          label: "Captain image",
          name: "image",
          type: "image",
        },
        {
          label: "Contacts title",
          name: "contactsTitle",
          type: "string",
        },
        {
          label: "Contacts title Eng",
          name: "contactsTitleEng",
          type: "string",
        },
        {
          label: "Contacts phone",
          name: "contactsPhone",
          type: "string",
        },
        {
          label: "Contacts phone Eng",
          name: "contactsPhoneEng",
          type: "string",
        },

        {
          label: "Contacts address",
          name: "contactsAddress",
          type: "string",
        },
        {
          label: "Contacts address Eng",
          name: "contactsAddressEng",
          type: "string",
        },
        {
          label: "Schedule title",
          name: "scheduleTitle",
          type: "string",
        },
        {
          label: "Schedule title Eng",
          name: "scheduleTitleEng",
          type: "string",
        },
        {
          label: "Schedule date",
          name: "scheduleDate",
          type: "string",
        },
        {
          label: "Schedule date Eng",
          name: "scheduleDateEng",
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
