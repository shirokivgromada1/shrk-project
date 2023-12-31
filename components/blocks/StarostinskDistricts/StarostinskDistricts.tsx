import styles from "./StarostinskDistricts.module.scss";
import { tinaField } from "tinacms/dist/react";
import { PageComponentsStarostinskDistricts } from "@/tina/__generated__/types";
import Link from "next/link";
import { useContext, useState } from "react";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import ArrowDown from "../../../assets/arrow-down-small.svg";
import { motion } from "framer-motion";
import Image from "next/image";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";

export const StarostinskDistricts = ({
                                         data,
                                     }: {
    data: PageComponentsStarostinskDistricts;
}) => {
    const { title, titleEng, districts: districts } = data;
    const [activeIndicesOdd, setActiveIndicesOdd] = useState<any>({});
    const [activeIndicesEven, setActiveIndicesEven] = useState<any>({});
    const isTablet = useBetterMediaQuery(
      "(min-width: 451px) and (max-width: 768px)"
    );
    const isMobile = useBetterMediaQuery("(max-width: 450px");

    const toggleAccordionItem = (index: number, isOdd: boolean) => {
        if (isOdd) {
            setActiveIndicesOdd((prevState: any) => ({
                ...prevState,
                [index]: !prevState[index],
            }));
        } else {
            setActiveIndicesEven((prevState: any) => ({
                ...prevState,
                [index]: !prevState[index],
            }));
        }
    };

    const accordionVariants = {
        open: { opacity: 1, display: "flex" },
        closed: { opacity: 0, display: "none" },
    };
    const { lang } = useContext(LangContext);
    const renderDistricts = (districts: any, isOdd: boolean) => {
        return districts.map((d: any, index: number) =>
          !d?.hidden ? (
            <div
              data-tina-field={tinaField(d)}
              className={styles.districts__list_item}
              key={d.id as number}
            >
                <button onClick={() => toggleAccordionItem(d?.id as number, isOdd)}>
                    <div className={styles.districts__list_item_overall}>
                        <h3 data-tina-field={tinaField(d, "name")}>
                            {lang === "ua" ? d?.name : d?.nameEng}
                        </h3>
                        <ArrowDown />
                    </div>
                    {!isMobile && (
                      <p data-tina-field={tinaField(d, "captain")}>
                          {lang === "ua" ? d?.captain : d?.captainEng}
                      </p>
                    )}
                </button>
                <motion.div
                  className={`${styles.districts__list_item_info} ${
                    (isOdd ? activeIndicesOdd : activeIndicesEven)[d.id as number]
                      ? "show"
                      : "hidden"
                  }`}
                  initial="closed"
                  animate={
                      (isOdd ? activeIndicesOdd : activeIndicesEven)[d.id as number]
                        ? "open"
                        : "closed"
                  }
                  variants={accordionVariants}
                  transition={{ duration: 1 }}
                  layout
                >
                    {isMobile && (
                      <p data-tina-field={tinaField(d, "captain")}>
                          {lang === "ua" ? d?.captain : d?.captainEng}
                      </p>
                    )}
                    {d?.image && (
                      <Image
                        data-tina-field={tinaField(d, "image")}
                        src={d.image}
                        width={125}
                        height={125}
                        alt="headman"
                      />
                    )}
                    <div>
                        <div>
                            <h3 data-tina-field={tinaField(d, "contactsTitle")}>
                                {lang === "ua" ? d?.contactsTitle : d?.contactsTitleEng}
                            </h3>
                            <ul>
                                <li data-tina-field={tinaField(d, "contactsPhone")}>
                                    {" "}
                                    {lang === "ua" ? d?.contactsPhone : d?.contactsPhoneEng}
                                </li>
                                <li data-tina-field={tinaField(d, "contactsAddress")}>
                                    {" "}
                                    {lang === "ua" ? d?.contactsAddress : d?.contactsAddressEng}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 data-tina-field={tinaField(d, "scheduleTitle")}>
                                {lang === "ua" ? d?.scheduleTitle : d?.scheduleTitleEng}
                            </h3>
                            <p data-tina-field={tinaField(d, "scheduleDate")}>
                                {lang === "ua" ? d?.scheduleDate : d?.scheduleDateEng}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
          ) : null
        );
    };

    const oddDistricts = districts?.filter(
      (d, index) => !d?.hidden && index % 2 === 0
    );
    const evenDistricts = districts?.filter(
      (d, index) => !d?.hidden && index % 2 === 1
    );

    return (
      <main className={styles.districts}>
          <div className="container">
              <h1 data-tina-field={tinaField(data, "title")}>
                  {lang === "ua" ? title : titleEng}
              </h1>
              <div className={styles.districts__list}>
                  <div>{oddDistricts && renderDistricts(oddDistricts, true)}</div>
                  <div>{evenDistricts && renderDistricts(evenDistricts, false)}</div>
              </div>
          </div>
      </main>
    );
};
