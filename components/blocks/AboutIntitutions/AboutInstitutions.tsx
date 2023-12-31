import styles from "./AboutInstitutions.module.scss";
import { tinaField } from "tinacms/dist/react";
import { PageComponentsAboutInstitutions } from "@/tina/__generated__/types";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Image from "next/image";
import { useContext, useState } from "react";
import ArrowUp from "../../../assets/arrow-down-thin.svg";
import ArrowDown from "../../../assets/arrow-down-thin.svg";
import { motion } from "framer-motion";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const AboutInstitutions = ({
                                    data,
                                  }: {
  data: PageComponentsAboutInstitutions;
}) => {
  const {
    image,
    culturals: culturals,
    educationals: educationals,
    pharmacies: pharmacies,
    cultTitle,
    cultTitleEng,
    educTitleEng,
    pharTitle,
    educTitle,
    pharTitleEng,
  } = data;
  const isMobile = useBetterMediaQuery("(max-width: 450px)");
  const isWideScreen = useBetterMediaQuery("(min-width: 768px)");
  const [showCult, setShowCult] = useState(false);
  const [showEduc, setShowEduc] = useState(false);
  const [showPhar, setShowPhar] = useState(false);

  const accordionVariants = {
    open: { opacity: 1, display: "flex" },
    closed: { opacity: 0, display: "none" },
  };
  const displayedCulturals = showCult
    ? culturals
    : culturals?.filter((item) => !item?.hidden).slice(0, 4);
  const displayedEducationals = showEduc
    ? educationals
    : educationals?.filter((item) => !item?.hidden).slice(0, 4);
  const displayedPharmacies = showPhar
    ? pharmacies
    : pharmacies?.filter((item) => !item?.hidden).slice(0, 4);
  const handleShowMoreClick = (list: string) => {
    switch (list) {
      case "cult":
        setShowCult((prev) => !prev);
        break;
      case "educ":
        setShowEduc((prev) => !prev);
        break;
      case "phar":
        setShowPhar((prev) => !prev);
        break;
      default:
        break;
    }
  };
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.institutions}>
      <div className="container">
        <div className={styles.institutions__inner}>
          <div className={styles.institutions__inner_banner2}>
            {image && (
              <Image
                src={image}
                width={1300}
                height={400}
                data-tina-field={tinaField(data, "image")}
              />
            )}
          </div>
          <div className={styles.institutions__list}>
            <div className={styles.institutions__list_list1}>
              {isWideScreen ? (
                <>
                  <h2 data-tina-field={tinaField(data, "cultTitle")}>
                    {lang === "ua" ? cultTitle : cultTitleEng}:
                  </h2>
                  <motion.ul
                    initial="closed"
                    animate={"open"}
                    variants={accordionVariants}
                    transition={{ duration: 1 }}
                  >
                    {displayedCulturals &&
                      displayedCulturals.map(
                        (c, index) =>
                          c &&
                          !c?.hidden && (
                            <li
                              key={index}
                              data-tina-field={tinaField(c, "name")}
                            >
                              {" "}
                              {lang === "ua" ? c?.name : c?.nameEng}
                            </li>
                          )
                      )}
                    {culturals &&
                      culturals.filter((item) => !item?.hidden).length > 4 && (
                        <button onClick={() => handleShowMoreClick("cult")}>
                          {showCult
                            ? lang === "ua"
                              ? "Більше"
                              : "Collapse"
                            : lang === "ua"
                              ? "Більше"
                              : "More"}{" "}
                          <ArrowDown
                            className={` ${showCult && styles.transform}`}
                          />
                        </button>
                      )}
                  </motion.ul>
                </>
              ) : (
                <>
                  <button onClick={() => handleShowMoreClick("cult")}>
                    <h2 data-tina-field={tinaField(data, "cultTitle")}>
                      {lang === "ua" ? cultTitle : cultTitleEng}
                    </h2>
                    <div>
                      <ArrowDown
                        className={` ${showCult && styles.transform}`}
                      />
                    </div>
                  </button>
                  <motion.div
                    className={` ${showCult ? styles.show : styles.hidden}`}
                    initial="closed"
                    animate={showCult ? "open" : "closed"}
                    variants={accordionVariants}
                    transition={{ duration: 1 }}
                  >
                    <ul>
                      {culturals &&
                        culturals.map(
                          (c, index) =>
                            c &&
                            !c?.hidden && (
                              <li
                                key={index}
                                data-tina-field={tinaField(c, "name")}
                              >
                                {" "}
                                {lang === "ua" ? c?.name : c?.nameEng}
                              </li>
                            )
                        )}
                    </ul>
                  </motion.div>
                </>
              )}
            </div>

            <div className={styles.institutions__list_list2}>
              {isWideScreen ? (
                <>
                  <h2 data-tina-field={tinaField(data, "educTitle")}>
                    {lang === "ua" ? educTitle : educTitleEng}:
                  </h2>
                  <motion.ul
                    initial="closed"
                    animate={"open"}
                    variants={accordionVariants}
                    transition={{ duration: 1 }}
                  >
                    {displayedEducationals &&
                      displayedEducationals.map(
                        (e, index) =>
                          e &&
                          !e?.hidden && (
                            <li
                              key={index}
                              data-tina-field={tinaField(e, "name")}
                            >
                              {" "}
                              {lang === "ua" ? e?.name : e?.nameEng}
                            </li>
                          )
                      )}
                    {educationals &&
                      educationals.filter((item) => !item?.hidden).length >
                      4 && (
                        <button onClick={() => handleShowMoreClick("educ")}>
                          {showEduc
                            ? lang === "ua"
                              ? "Згорнути"
                              : "Collapse"
                            : lang === "ua"
                              ? "Більше"
                              : "More"}{" "}
                          <ArrowDown
                            className={` ${showEduc && styles.transform}`}
                          />
                        </button>
                      )}
                  </motion.ul>
                </>
              ) : (
                <>
                  <button onClick={() => handleShowMoreClick("educ")}>
                    <h2 data-tina-field={tinaField(data, "educTitle")}>
                      {lang === "ua" ? educTitle : educTitleEng}
                    </h2>
                    <div>
                      <ArrowDown
                        className={` ${showEduc && styles.transform}`}
                      />
                    </div>
                  </button>
                  <motion.div
                    className={` ${showEduc ? styles.show : styles.hidden}`}
                    initial="closed"
                    animate={showEduc ? "open" : "closed"}
                    variants={accordionVariants}
                    transition={{ duration: 1 }}
                  >
                    <ul>
                      {educationals &&
                        educationals.map(
                          (e, index) =>
                            e &&
                            !e?.hidden && (
                              <li
                                key={index}
                                data-tina-field={tinaField(e, "name")}
                              >
                                {lang === "ua" ? e?.name : e?.nameEng}
                              </li>
                            )
                        )}
                    </ul>
                  </motion.div>
                </>
              )}
            </div>
            <div className={styles.institutions__list_list3}>
              {isWideScreen ? (
                <>
                  <h2 data-tina-field={tinaField(data, "pharTitle")}>
                    {lang === "ua" ? pharTitle : pharTitleEng}:
                  </h2>
                  <motion.ul
                    initial="closed"
                    animate={"open"}
                    variants={accordionVariants}
                    transition={{ duration: 1 }}
                  >
                    {displayedPharmacies &&
                      displayedPharmacies.map(
                        (p, index) =>
                          p &&
                          !p?.hidden && (
                            <li
                              key={index}
                              data-tina-field={tinaField(p, "name")}
                            >
                              {" "}
                              {lang === "ua" ? p?.name : p?.nameEng}
                            </li>
                          )
                      )}
                    {pharmacies &&
                      pharmacies.filter((item) => !item?.hidden).length > 4 && (
                        <button onClick={() => handleShowMoreClick("phar")}>
                          {showPhar
                            ? lang === "ua"
                              ? "Згорнути"
                              : "Collapse"
                            : lang === "ua"
                              ? "Більше"
                              : "More"}{" "}
                          <ArrowDown
                            className={` ${showPhar && styles.transform}`}
                          />
                        </button>
                      )}
                  </motion.ul>
                </>
              ) : (
                <>
                  <button onClick={() => handleShowMoreClick("phar")}>
                    <h2 data-tina-field={tinaField(data, "pharTitle")}>
                      {lang === "ua" ? pharTitle : pharTitleEng}
                    </h2>
                    <div>
                      <ArrowDown
                        className={` ${showPhar && styles.transform}`}
                      />
                    </div>
                  </button>
                  <motion.div
                    className={` ${showPhar ? styles.show : styles.hidden}`}
                    initial="closed"
                    animate={showPhar ? "open" : "closed"}
                    variants={accordionVariants}
                    transition={{ duration: 1 }}
                  >
                    <ul>
                      {pharmacies &&
                        pharmacies.map(
                          (p, index) =>
                            p &&
                            !p?.hidden && (
                              <li
                                key={index}
                                data-tina-field={tinaField(p, "name")}
                              >
                                {" "}
                                {lang === "ua" ? p?.name : p?.nameEng}
                              </li>
                            )
                        )}
                    </ul>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
