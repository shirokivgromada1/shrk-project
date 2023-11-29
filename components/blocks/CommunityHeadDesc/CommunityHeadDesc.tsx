import styles from "./CommunityHeadDesc.module.scss";
import { PageComponentsCommunityHeadDesc } from "@/tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Inst from "../../../assets/instagram.svg";
import Telegram from "../../../assets/telegram.svg";
import Facebook from "../../../assets/facebook.svg";
import Phone from "../../../assets/phone-icon.svg";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const CommunityHeadDesc = ({
                                    data,
                                  }: {
  data: PageComponentsCommunityHeadDesc;
}) => {
  const {
    title,
    titleEng,
    fullnameEng,
    image,
    fullname,
    contacts,
    employment: employments,
  } = data;
  const isTablet = useBetterMediaQuery("(max-width: 1150px)");
  const { lang } = useContext(LangContext);

  return (
    <main className={styles.head}>
      <div className="container">
        <h1 data-tina-field={tinaField(data, "title")}>
          {lang === "ua" ? title : titleEng}
        </h1>
        <div className={styles.head__inner}>
          <div className={styles.head__inner_photo}>
            {image && (
              <Image
                src={image}
                width={isTablet ? 400 : 451}
                height={isTablet ? 400 : 553}
                data-tina-field={tinaField(data, "image")}
              />
            )}
          </div>
          <div className={styles.head__inner_info}>
            {fullname && (
              <h3 data-tina-field={tinaField(data, "fullname")}>
                {lang === "ua" ? fullname : fullnameEng}
              </h3>
            )}
            <ul>
              {employments && (
                <p data-tina-field={tinaField(employments, "title")}>
                  {lang === "ua" ? employments?.title : employments?.titleEng}
                </p>
              )}
              {employments &&
                employments?.item?.map(
                  (e, index) =>
                    e && (
                      <li key={index} data-tina-field={tinaField(e, "desc")}>
                        {lang === "ua" ? e.desc : e.descEng}
                      </li>
                    )
                )}
            </ul>
            <div className={styles.head__inner_details}>
              {!!isTablet && contacts?.title && contacts?.titleEng && (
                <h5 data-tina-field={tinaField(contacts, "title")}>
                  {lang === "ua" ? contacts?.title : contacts?.titleEng}
                </h5>
              )}
              <div className={styles.head__inner_details_contacts}>
                <div>
                  {!isTablet && contacts?.title && contacts?.titleEng && (
                    <h5 data-tina-field={tinaField(contacts, "title")}>
                      {lang === "ua" ? contacts?.title : contacts?.titleEng}
                    </h5>
                  )}
                  <div>
                    <div>
                      {contacts?.phone1 && (
                        <span data-tina-field={tinaField(contacts, "phone1")}>
                          <Phone />
                          {contacts?.phone1}
                        </span>
                      )}
                      {contacts?.phone2 && (
                        <span data-tina-field={tinaField(contacts, "phone2")}>
                          <Phone />
                          {contacts?.phone2}
                        </span>
                      )}
                    </div>
                    <div>
                      {contacts?.place && contacts?.placeEng && (
                        <p data-tina-field={tinaField(contacts, "place")}>
                          {lang === "ua" ? contacts?.place : contacts?.placeEng}
                        </p>
                      )}
                      {contacts?.email && (
                        <p data-tina-field={tinaField(contacts, "email")}>
                          {contacts?.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {contacts?.facebook && (
                    <a
                      href={contacts.facebook}
                      target="_blank"
                      data-tina-field={tinaField(contacts, "facebook")}
                    >
                      <Facebook />
                    </a>
                  )}
                  {contacts?.inst && (
                    <a
                      href={contacts.inst}
                      target="_blank"
                      data-tina-field={tinaField(contacts, "inst")}
                    >
                      <Inst />
                    </a>
                  )}
                  {contacts?.telegram && (
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      data-tina-field={tinaField(contacts, "telegram")}
                    >
                      <Telegram />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
