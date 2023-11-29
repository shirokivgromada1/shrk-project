import styles from "./EnterprisesTablet.module.scss";
import { PageComponentsEnterprisesTablet } from "@/tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Link from "next/link";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const EnterprisesTablet = ({
                                    data,
                                  }: {
  data: PageComponentsEnterprisesTablet;
}) => {
  const { title, titleEng, enterprises: enterprises } = data;
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.enterprises}>
      <div className="container">
        <h1 data-tina-field={tinaField(data, "title")}>
          {lang === "ua" ? title : titleEng}
        </h1>
        <div className={styles.enterprises__inner}>
          {enterprises &&
            enterprises.map(
              (e, index) =>
                e &&
                !e?.isHidden &&
                e?.link && (
                  <Link
                    href={e.link}
                    data-tina-field={tinaField(e, "link")}
                    key={index}
                  >
                    <div className={styles.enterprises__inner_enterprise}>
                      {e?.name && e?.nameEng && (
                        <h3 data-tina-field={tinaField(e, "name")}>
                          {lang === "ua" ? e?.name : e?.nameEng}
                        </h3>
                      )}
                    </div>
                  </Link>
                )
            )}
        </div>
      </div>
    </main>
  );
};
