import styles from "./DepartmentsTablet.module.scss";
import { PageComponentsDepartmentsTablet } from "@/tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Link from "next/link";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const DepartmentsTablet = ({
                                    data,
                                  }: {
  data: PageComponentsDepartmentsTablet;
}) => {
  const { title, titleEng, departments: departments } = data;
  const isMobile = useBetterMediaQuery("(max-width: 531px)");
  const isTablet = useBetterMediaQuery("(max-width: 768px)");
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.departments}>
      <div className="container">
        <h1 data-tina-field={tinaField(data, "title")}>
          {lang === "ua" ? title : titleEng}
        </h1>
        <div className={styles.departments__inner}>
          {departments &&
            departments.map(
              (d, index) =>
                d &&
                !d?.isHidden &&
                d?.link && (
                  <Link
                    href={d?.link}
                    data-tina-field={tinaField(d, "link")}
                    key={index}
                  >
                    <div className={styles.departments__inner_department}>
                      <div className={styles.deputies__inner_department_photo}>
                        {d?.image && (
                          <Image
                            src={d?.image}
                            width={40}
                            height={40}
                            data-tina-field={tinaField(d, "image")}
                          />
                        )}
                      </div>
                      <div
                        className={styles.departments__inner_department_desc}
                      >
                        {d?.name && d?.nameEng && (
                          <h3 data-tina-field={tinaField(d, "name")}>
                            {lang === "ua" ? d?.name : d?.nameEng}
                          </h3>
                        )}
                      </div>
                    </div>
                  </Link>
                )
            )}
        </div>
      </div>
    </main>
  );
};
