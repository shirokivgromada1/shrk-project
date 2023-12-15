import styles from "./Investment.module.scss";
import { tinaField } from "tinacms/dist/react";
import { PageComponentsInvestment } from "@/tina/__generated__/types";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Image from "next/image";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";

export const Investment = ({ data }: { data: PageComponentsInvestment }) => {
  const {
    title,
    subtitle,
    titleEng,
    subtitleEng,
    firstTextEng,
    secondTextEng,
    firstText,
    secondText,
    investTitle,
    investTitleEng,
    image,
    button,
  } = data;
  const isMobile = useBetterMediaQuery("(max-width: 530px");
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.investment}>
      <div className="container">
        <div className={styles.investment__headline}>
          <h1 data-tina-field={tinaField(data, "title")}>
            {lang === "ua" ? title : titleEng}
          </h1>
          <h2 data-tina-field={tinaField(data, "subtitle")}>
            {lang === "ua" ? subtitle : subtitleEng}
          </h2>
        </div>
        <div className={styles.investment__wrapper}>
          {image && (
            <Image
              className={styles.investment__banner}
              src={image}
              alt="banner"
              width={904}
              height={isMobile ? 550 : 368}
              data-tina-field={tinaField(data, "image")}
            />
          )}
          <div className={styles.investment__info}>
            <div>
              {lang === "ua"
                ? firstText?.children.map((annItem: any, annIndex: number) => {
                  if (annItem.type.startsWith("h"))
                    return annItem.children.map((text: any) => (
                      <annItem.type
                        key={"announceHeadline" + annIndex}
                        style={{
                          fontWeight: text.bold && "bold",
                          fontStyle: text.italic && "italic",
                        }}
                        data-tina-field={tinaField(data, "firstText")}
                      >
                        {text.text}
                      </annItem.type>
                    ));
                  if (annItem.type.startsWith("p"))
                    return annItem.children.map((text: any) => (
                      <p
                        key={"announceParagraph" + annIndex}
                        style={{
                          fontWeight: text.bold && "bold",
                          fontStyle: text.italic && "italic",
                        }}
                        data-tina-field={tinaField(data, "firstText")}
                      >
                        {text.text}
                      </p>
                    ));
                  return null;
                })
                : firstTextEng?.children.map(
                  (annItem: any, annIndex: number) => {
                    if (annItem.type.startsWith("h"))
                      return annItem.children.map((text: any) => (
                        <annItem.type
                          key={"announceHeadline" + annIndex}
                          style={{
                            fontWeight: text.bold && "bold",
                            fontStyle: text.italic && "italic",
                          }}
                          data-tina-field={tinaField(data, "firstText")}
                        >
                          {text.text}
                        </annItem.type>
                      ));
                    if (annItem.type.startsWith("p"))
                      return annItem.children.map((text: any) => (
                        <p
                          key={"announceParagraph" + annIndex}
                          style={{
                            fontWeight: text.bold && "bold",
                            fontStyle: text.italic && "italic",
                          }}
                          data-tina-field={tinaField(data, "firstText")}
                        >
                          {text.text}
                        </p>
                      ));
                    return null;
                  }
                )}
            </div>
            <div>
              {lang === "ua"
                ? secondText?.children.map((annItem: any, annIndex: number) => {
                  if (annItem.type.startsWith("h"))
                    return annItem.children.map((text: any) => (
                      <annItem.type
                        key={"announceHeadline" + annIndex}
                        style={{
                          fontWeight: text.bold && "bold",
                          fontStyle: text.italic && "italic",
                        }}
                        data-tina-field={tinaField(data, "secondText")}
                      >
                        {text.text}
                      </annItem.type>
                    ));
                  if (annItem.type.startsWith("p"))
                    return annItem.children.map((text: any) => (
                      <p
                        key={"announceParagraph" + annIndex}
                        style={{
                          fontWeight: text.bold && "bold",
                          fontStyle: text.italic && "italic",
                        }}
                        data-tina-field={tinaField(data, "firstText")}
                      >
                        {text.text}
                      </p>
                    ));
                  return null;
                })
                : secondTextEng?.children.map(
                  (annItem: any, annIndex: number) => {
                    if (annItem.type.startsWith("h"))
                      return annItem.children.map((text: any) => (
                        <annItem.type
                          key={"announceHeadline" + annIndex}
                          style={{
                            fontWeight: text.bold && "bold",
                            fontStyle: text.italic && "italic",
                          }}
                          data-tina-field={tinaField(data, "secondText")}
                        >
                          {text.text}
                        </annItem.type>
                      ));
                    if (annItem.type.startsWith("p"))
                      return annItem.children.map((text: any) => (
                        <p
                          key={"announceParagraph" + annIndex}
                          style={{
                            fontWeight: text.bold && "bold",
                            fontStyle: text.italic && "italic",
                          }}
                          data-tina-field={tinaField(data, "firstText")}
                        >
                          {text.text}
                        </p>
                      ));
                    return null;
                  }
                )}
            </div>
          </div>
          <div className={styles.investment__link}>
            <h2 data-tina-field={tinaField(data, "investTitle")}>
              {lang === "ua" ? investTitle : investTitleEng}
            </h2>
            {button?.url && (
                <button data-tina-field={tinaField(data, "button")}>
                  <a href={button?.url} target="_blank" rel="noopener noreferrer">
                  {lang === "ua" ? button?.text : button?.textEng}
                  </a>
                </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
