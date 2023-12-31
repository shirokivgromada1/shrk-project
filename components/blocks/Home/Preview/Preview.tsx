import { Swiper, SwiperSlide } from "swiper/react";
import SearchIcon from "./../../../../assets/search.svg";
import { useState, useEffect, useContext } from "react";
import SanitizeHTML from "./../../../util/SanitizeHTML";
import Image from "next/image";
import { Skeleton, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { tinaField } from "tinacms/dist/react";
import {
  DepartmentPeopleComponentsPreview,
  DepartmentPeopleComponentsPreviewFilter,
  PageComponentsPreview,
} from "./../../../../tina/__generated__/types";
import "swiper/css";

import styles from "./Preview.module.scss";
import client from "@/tina/__generated__/client";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";
import { useRouter } from "next/router";
import { format } from "date-fns";

export const Preview = ({
  data,
}: {
  data: PageComponentsPreview | DepartmentPeopleComponentsPreview;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const {
    previewImage,
    title,
    titleEng,
    descriptionEng,
    description,
    freshNews,
    readMoreLink,
  } = data;
  const [news, setNews] = useState<any[] | null | undefined>(null);

  const match = useMediaQuery("(max-width: 700px)");

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const newsResponse = await client.queries.newsConnection({
        first: 10,
        sort: "pubDate",
        last: 1,
        filter: {
          pubDate: {
            before: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          },
          hideNews: {
            eq: false,
          },
        },
      });
      setNews(newsResponse.data.newsConnection.edges);
      setLoading(false);
    };
    if (!freshNews || freshNews?.length === 0) fetchContent();
    else setNews(freshNews);
  }, [freshNews]);

  const { lang } = useContext(LangContext);

  return (
    <div className={styles.preview}>
      <div className="container-fluid">
        {previewImage && (
          <Image
            src={previewImage}
            blurDataURL={previewImage}
            width={597}
            height={714}
            alt="preview"
            placeholder="blur"
            className={loaded ? "unblur" : ""}
            onLoadingComplete={() => setLoaded(true)}
            data-tina-field={tinaField(data, "previewImage")}
          />
        )}
        <div
          className={styles.preview__block}
          style={{
            backgroundImage: match ? `url(${previewImage})` : undefined,
          }}
        >
          <div className={styles.preview__block_headline}>
            <div className={styles.preview__block_headline_h}>
              {title && titleEng && (
                <h1 data-tina-field={tinaField(data, "title")}>
                  {lang === "ua" ? title : titleEng}
                </h1>
              )}
              {description && descriptionEng && (
                <h5 data-tina-field={tinaField(data, "description")}>
                  {lang === "ua" ? description : descriptionEng}
                </h5>
              )}
            </div>
            <div className={styles.preview__block_headline_inner}>
              <button
                type="button"
                onClick={() => router.push(readMoreLink || "/")}
                data-tina-field={tinaField(data, "readMoreLink")}
              >
                {lang === "ua" ? "Читати більше" : "Read more"}
              </button>
              <div className={styles.preview__block_headline_inner_mobile}>
                <input type="text" />
                <button type="button">
                  <SearchIcon />
                </button>
              </div>
            </div>
          </div>
          <Swiper slidesPerView={"auto"} className={styles.previewSwiper}>
            {Array.from(new Array(news ? news.length : 4)).map((_, index) => (
              <SwiperSlide
                key={
                  news
                    ? freshNews && freshNews?.length > 0
                      ? news[index]?.news?.title + index
                      : news[index]?.node?.title + index
                    : "loading" + index
                }
                className={styles.previewSwiper__slide}
              >
                {index === 0 ? (
                  <h1>{lang === "ua" ? "Важливі новини" : "Important news"}</h1>
                ) : (
                  <h1 />
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    key={"loaded" + index}
                  >
                    {!isLoading && news && news?.length > 0 && (
                      <div data-tina-field={tinaField(news[index], "news")}>
                        <SanitizeHTML
                          html={
                            freshNews && freshNews?.length > 0
                              ? news[index]?.news?.title?.slice(0, 180)
                              : news[index]?.node?.title?.slice(0, 180)
                          }
                        />
                        <span>
                          {freshNews && freshNews?.length > 0
                            ? news[index]?.news?.title?.length > 180
                              ? "... "
                              : " "
                            : news[index]?.node?.title?.length > 180
                            ? "... "
                            : " "}
                        </span>
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    key={"loading" + index}
                  >
                    {isLoading && (
                      <Skeleton variant="rectangular" height={60} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
