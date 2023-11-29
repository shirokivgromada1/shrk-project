import styles from "./DeputyHeadTablet.module.scss";
import { PageComponentsDeputyHeadTablet } from "@/tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import Image from "next/image";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import Link from "next/link";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
export const DeputyHeadTablet = ({
                                   data,
                                 }: {
  data: PageComponentsDeputyHeadTablet;
}) => {
  const { title, titleEng, deputy: deputies } = data;
  const isMobile = useBetterMediaQuery("(max-width: 531px)");
  const isTablet = useBetterMediaQuery("(max-width: 768px)");
  const { lang } = useContext(LangContext);
  return (
    <main className={styles.deputies}>
      <div className="container">
        <h1 data-tina-field={tinaField(data, "title")}>
          {lang === "ua" ? title : titleEng}
        </h1>
        <div className={styles.deputies__inner}>
          {deputies &&
            deputies.map(
              (d, index) =>
                d &&
                !d?.isHidden &&
                d?.link && (
                  <Link
                    href={d?.link}
                    data-tina-field={tinaField(d, "link")}
                    key={index}
                  >
                    <div className={styles.deputies__inner_deputy}>
                      <div className={styles.deputies__inner_deputy_photo}>
                        {d?.image && (
                          <Image
                            src={d?.image}
                            width={isTablet ? 329 : 329}
                            height={isTablet ? 320 : 320}
                            data-tina-field={tinaField(d, "image")}
                          />
                        )}
                      </div>
                      <div className={styles.deputies__inner_deputy_desc}>
                        {d?.position && d?.positionEng && (
                          <h3 data-tina-field={tinaField(d, "position")}>
                            {lang === "ua" ? d?.position : d?.positionEng}
                          </h3>
                        )}
                        {d?.fullname && d?.fullnameEng && (
                          <p data-tina-field={tinaField(d, "fullname")}>
                            {lang === "ua" ? d?.fullname : d?.fullnameEng}
                          </p>
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
