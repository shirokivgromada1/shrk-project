import styles from "./Footer.module.scss";
import Image from "next/image";
import { GlobalFooter, Maybe } from "@/tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Link from "next/link";
import Facebook from "./../../../assets/facebook.svg";
import Instagram from "./../../../assets/instagram.svg";
import Telegram from "./../../../assets/telegram.svg";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";

const Footer = ({ data }: { data: Maybe<GlobalFooter> | undefined }) => {
  if (data) {
    const {
      logo,
      headline,
      nav,
      location,
      googleUrl,
      workTime,
      phone,
      social,
      locationEng,
      workTimeEng,
      headlineEng,
      link,
    } = data;
    const { lang } = useContext(LangContext);
    return (
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footer__site}>
            {logo && (
              <Image
                src={logo}
                alt="logo"
                height={88}
                width={165}
                data-tina-field={tinaField(data, "logo")}
              />
            )}

            <h5 data-tina-field={tinaField(data, "headline")}>
              {lang === "ua" ? headline : headlineEng}
            </h5>
            <div>
              <button type="button" className={styles.footer__site_button}>
                {link &&  <a href={link} data-tina-field={tinaField(data, "link")} target="_blank"
                             rel="noreferrer">{lang === "ua"
                  ? "Наш інвестиційний сайт"
                  : "Our investment site"}</a>}
              </button>
            </div>
          </div>
          <nav className={styles.footer__nav}>
            <h1>{lang === "ua" ? "Навігація" : "Navigation"}</h1>
            <ul>
              {nav?.map(
                (link, index) =>
                  link &&
                  link.href &&
                  link?.labelEng &&
                  link?.label && (
                    <a
                      href={link.href}
                      key={link.label + index}
                      data-tina-field={tinaField(link)}
                    >
                      <li>{lang === "ua" ? link.label : link.labelEng}</li>
                    </a>
                  )
              )}
            </ul>
          </nav>
          <div className={styles.footer__contacts}>
            <h1>{lang === "ua" ? "Контакти" : "Contacts"}</h1>
            <h5 data-tina-field={tinaField(data, "location")}>
              {lang === "ua" ? location : locationEng}
            </h5>
            {googleUrl && (
              <div className={styles.footer__contacts_showOnMap}>
                <Link href={googleUrl}>
                  <a>
                    {lang === "ua" ? "Показати на мапі" : "Show on the map"}
                  </a>
                </Link>
              </div>
            )}
            <h4 data-tina-field={tinaField(data, "workTime")}>
              &quot;{lang === "ua" ? "ГАРЯЧА ЛІНІЯ" : "HOTLINE"}
              &quot;: <br /> <br className={styles.mobile} />{" "}
              {lang === "ua" ? workTime : workTimeEng} <br />
              <a
                href={`tel:+38${phone}`}
                data-tina-field={tinaField(data, "phone")}
              >
                {phone}
              </a>
            </h4>
            <div className={styles.footer__socials}>
              {social?.facebook && (
                <a
                  href={social?.facebook}
                  data-tina-field={tinaField(social, "facebook")}
                >
                  <Facebook />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social?.instagram}
                  data-tina-field={tinaField(social, "instagram")}
                >
                  <Instagram />
                </a>
              )}
              {social?.telegram && (
                <a
                  href={social?.telegram}
                  data-tina-field={tinaField(social, "telegram")}
                >
                  <Telegram />
                </a>
              )}
            </div>
            <div className={styles.mobile__block}>
              <button type="button" className={styles.footer__site_button}>
                {link &&  <a href={link} data-tina-field={tinaField(data, "link")} target="_blank"
                             rel="noreferrer">{lang === "ua"
                  ? "Наш інвестиційний сайт"
                  : "Our investment site"}</a>}
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
  }
};

export default Footer;
