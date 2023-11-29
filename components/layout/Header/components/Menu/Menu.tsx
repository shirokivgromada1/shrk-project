import styles from "./Menu.module.scss";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import ArrowDown from "./../../../../../assets/arrow-down.svg";
import { useMediaQuery } from "usehooks-ts";
import { Dispatch, useContext, useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import Link from "next/link";
import { tinaField } from "tinacms/dist/react";
import { GlobalHeader, Maybe } from "@/tina/__generated__/types";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";

const Menu = ({ data }: { data: Maybe<GlobalHeader> | undefined }) => {
  const matches = useMediaQuery("(min-width: 1120px) or (max-width: 450px)");
  const [id, setId] = useState<number | null>(null);
  const removeContainer = useMediaQuery("(max-width: 1120px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    if (!matches) setId(null);
  }, [matches]);
  const { lang } = useContext(LangContext);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.menu}
    >
      <div className={`${removeContainer ? "" : "container"}`}>
        {data?.nav?.map(
          (nav, index) =>
            nav && (
              <div key={"section" + index} className={styles.menu__section}>
                <div
                  className={styles.menu__section_mobile}
                  onClick={() => {
                    setId(id === index ? null : index);
                  }}
                  data-tina-field={tinaField(nav, "label")}
                >
                  <h1>{lang === "ua" ? nav.label : nav.labelEng}</h1>
                  <div
                    hidden={matches}
                    className={
                      id === index ? styles.menu__section_mobile_active : ""
                    }
                  >
                    <ArrowDown />
                  </div>
                </div>


                {matches && (
                  <ul className={styles.menu__section_items}>
                    {nav?.links?.map(
                      (link, idx) =>
                        link &&
                        link.href &&
                        link.label &&
                        link.labelEng && (
                          <li key={"item" + idx}>
                            <Link
                              href={
                                link.href && link.href1
                                  ? isTablet
                                    ? link.href1
                                    : link.href
                                  : link.href
                              }
                            >
                              <a>
                                {lang === "ua" ? link.label : link.labelEng}
                              </a>
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                )}

                {!matches && (
                  <AnimateHeight
                    duration={500}
                    height={id === index ? "auto" : 0}
                  >
                    <ul className={styles.menu__section_items}>
                      {nav?.links?.map(
                        (link, idx) =>
                          link &&
                          link.href &&
                          link.label && (
                            <li key={"item" + idx}>
                              <Link
                                href={
                                  link.href && link.href1
                                    ? isTablet
                                      ? link.href1
                                      : link.href
                                    : link.href
                                }
                              >
                                <a>
                                  {lang === "ua" ? link.label : link.labelEng}
                                </a>
                              </Link>
                            </li>
                          )
                      )}
                    </ul>
                  </AnimateHeight>
                )}
              </div>
            )
        )}
      </div>
    </motion.div>
  );
};

export default Menu;
