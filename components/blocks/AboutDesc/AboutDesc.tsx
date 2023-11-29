import styles from "./AboutDesc.module.scss";
import { tinaField } from "tinacms/dist/react";
import { PageComponentsAboutDesc } from "@/tina/__generated__/types";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Image from "next/image";
import AboutPlace from "../../../assets/aboutIcons.png";
import Background from "../../../assets/svg-backgr.svg";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const AboutDesc = ({ data }: { data: PageComponentsAboutDesc }) => {
  const {
    title,
    titleEng,
    yearEng,
    townsTitleEng,
    year,
    image,
    people,
    towns,
    townsTitle,
    squareTitle,
    square,
    squareTitleEng,
  } = data;
  const isMobile = useBetterMediaQuery("(max-width: 450px)");
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.about}>
      <div className="container">
        <div className={styles.about__inner}>
          <div className={styles.about__inner_banner1}>
            {image && (
              <Image
                src={image}
                width={1300}
                height={400}
                data-tina-field={tinaField(data, "image")}
              />
            )}
          </div>
          <h1 data-tina-field={tinaField(data, "title")}>
            {lang === "ua" ? title : titleEng}
          </h1>
          <div>
            <div>
              <div>
                {people && (
                  <h4 data-tina-field={tinaField(data, "people")}>
                    {people}{" "}
                    <span>{lang === "ua" ? "тис. осіб" : "thousands"}</span>
                  </h4>
                )}
                <p data-tina-field={tinaField(data, "year")}>
                  {lang === "ua" ? year : yearEng}
                </p>
              </div>
              <div>
                <h4 data-tina-field={tinaField(data, "towns")}>{towns}</h4>
                <p data-tina-field={tinaField(data, "townsTitle")}>
                  {lang === "ua" ? townsTitle : townsTitleEng}
                </p>
              </div>
              <div>
                {square && (
                  <h4 data-tina-field={tinaField(data, "square")}>
                    {square}{" "}
                    <span>
                      {lang === "ua" ? "км" : "km"}
                      <sup>2</sup>
                    </span>
                  </h4>
                )}
                <p data-tina-field={tinaField(data, "squareTitle")}>
                  {lang === "ua" ? squareTitle : squareTitleEng}
                </p>
              </div>
            </div>
            <div className={styles.about__inner_ground}>
              <Image src={AboutPlace} width={1300} height={96} />
            </div>
            {isMobile ? (
              <div className={styles.about__inner_background}>
                <Background data-tina-field={tinaField(data, "image")} />
                <div>
                  <div>
                    {people && (
                      <h4 data-tina-field={tinaField(data, "people")}>
                        {people}{" "}
                        <span>{lang === "ua" ? "тис. осіб" : "thousands"}</span>
                      </h4>
                    )}
                    <p data-tina-field={tinaField(data, "year")}>{year}</p>
                  </div>
                  <div>
                    <h4 data-tina-field={tinaField(data, "towns")}>{towns}</h4>
                    <p data-tina-field={tinaField(data, "townsTitle")}>
                      {lang === "ua" ? townsTitle : townsTitleEng}
                    </p>
                  </div>
                  <div>
                    {square && (
                      <h4 data-tina-field={tinaField(data, "square")}>
                        {square}{" "}
                        <span>
                          {lang === "ua" ? "км" : "km"}
                          <sup>2</sup>
                        </span>
                      </h4>
                    )}
                    <p data-tina-field={tinaField(data, "squareTitle")}>
                      {lang === "ua" ? squareTitle : squareTitleEng}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};
