import styles from "./StrategyLink.module.scss";
import { tinaField } from "tinacms/dist/react";
import { PageComponentsStrategyLink } from "@/tina/__generated__/types";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";

export const StrategyLink = ({
                               data,
                             }: {
  data: PageComponentsStrategyLink;
}) => {
  const {
    title,
    titleEng,
    urlTextEng,
    url,
    urlText,
    firstText,
    firstTextEng,
    secondTextEng,
    secondText,
  } = data;
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.link}>
      <div className="container">
        <div className={styles.link__inner}>
          <h2 data-tina-field={tinaField(data, "title")}>
            {lang === "ua" ? title : titleEng}{" "}
            {url && (
              <a
                href={url}
                target="_blank"
                data-tina-field={tinaField(data, "url")}
              >
                {lang === "ua" ? urlText : urlTextEng}
              </a>
            )}
          </h2>
          <div className={styles.link__inner_desc}>
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
                        data-tina-field={tinaField(data, "secondText")}
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
                          data-tina-field={tinaField(data, "secondText")}
                        >
                          {text.text}
                        </p>
                      ));
                    return null;
                  }
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
