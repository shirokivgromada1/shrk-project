import styles from "./CouncilSecretaryDesc.module.scss";
import { PageComponentsCouncilSecretaryDesc } from "@/tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Inst from "../../../assets/instagram.svg";
import Telegram from "../../../assets/telegram.svg";
import Facebook from "../../../assets/facebook.svg";
import Phone from "../../../assets/phone-icon.svg";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const CouncilSecretaryDesc = ({
                                       data,
                                     }: {
  data: PageComponentsCouncilSecretaryDesc;
}) => {
  const {
    title,
    titleEng,
    fullnameEng,
    image,
    fullname,
    schedule,
    contacts,
    employment: employments,
  } = data;
  const isTablet = useBetterMediaQuery("(max-width: 1115px)");
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.secretary}>
      <div className="container">
        <h1 data-tina-field={tinaField(data, "title")}>
          {lang === "ua" ? title : titleEng}
        </h1>
        <div className={styles.secretary__inner}>
          <div className={styles.secretary__inner_photo}>
            {image && (
              <Image
                src={image}
                width={isTablet ? 400 : 451}
                height={isTablet ? 400 : 553}
                data-tina-field={tinaField(data, "image")}
              />
            )}
          </div>
          <div className={styles.secretary__inner_info}>
            {fullname && fullnameEng && (
              <h3 data-tina-field={tinaField(data, "fullname")}>
                {lang === "ua" ? fullname : fullnameEng}
              </h3>
            )}
            <ul>
              {employments && employments?.titleEng && (
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
            <div className={styles.secretary__inner_details}>
              <div className={styles.secretary__inner_details_schedule}>
                {schedule && (
                  <h5 data-tina-field={tinaField(schedule, "title")}>
                    {lang === "ua" ? schedule?.title : schedule?.titleEng}
                  </h5>
                )}
                {schedule && (
                  <p data-tina-field={tinaField(schedule, "time")}>
                    {lang === "ua" ? schedule?.time : schedule?.timeEng}
                  </p>
                )}
              </div>
              {!!isTablet && contacts?.title && contacts?.titleEng && (
                <h5 data-tina-field={tinaField(contacts, "title")}>
                  {lang === "ua" ? contacts?.title : contacts?.titleEng}
                </h5>
              )}
              <div className={styles.secretary__inner_details_contacts}>
                <div>
                  {!isTablet && contacts?.title && contacts?.titleEng && (
                    <h5 data-tina-field={tinaField(contacts, "title")}>
                      {lang === "ua" ? contacts?.title : contacts?.titleEng}
                    </h5>
                  )}
                  <div>
                    <div>
                      {contacts?.phone1 && contacts?.phone1Eng && (
                        <span data-tina-field={tinaField(contacts, "phone1")}>
                          <Phone />
                          {lang === "ua"
                            ? contacts?.phone1
                            : contacts?.phone1Eng}
                        </span>
                      )}
                      {contacts?.phone2 && contacts?.phone2Eng && (
                        <span data-tina-field={tinaField(contacts, "phone2")}>
                          <Phone />
                          {lang === "ua"
                            ? contacts?.phone2
                            : contacts?.phone2Eng}
                        </span>
                      )}
                    </div>
                    <div>
                      {contacts?.place && contacts?.placeEng && (
                        <p data-tina-field={tinaField(contacts, "place")}>
                          {lang === "ua" ? contacts?.place : contacts?.placeEng}
                        </p>
                      )}
                      {contacts?.email && contacts?.emailEng && (
                        <p data-tina-field={tinaField(contacts, "email")}>
                          {lang === "ua" ? contacts?.email : contacts?.emailEng}
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
