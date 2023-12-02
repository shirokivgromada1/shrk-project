import { Dispatch, FC, useEffect, useState } from "react";
import styles from "./SearchModal.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "react-modal";
import { GoSearch } from "react-icons/go";
import AnimateHeight from "react-animate-height";
// import { builder } from "@builder.io/react"
import Logo from "./../../../../../../assets/logoSmall.png";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import client from "@/tina/__generated__/client";

// Modal.setAppElement("#__next");

type Props = {
  setSearchView: Dispatch<boolean>;
  searchView: boolean;
};

const SearchModal: FC<Props> = ({ searchView, setSearchView }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    async function getSearch() {
      const data = [];

      const news = (await client.queries.newsConnection()).data;
      const newsFiltered = news?.newsConnection?.edges?.filter((d) => {
        const titleMatch = d?.node?.title
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const descriptionMatch = d?.node?.description.children.some(
          (child: any) =>
            child.children.some((c: any) =>
              c?.text?.toLowerCase().includes(keyword.toLowerCase())
            )
        );
        if (titleMatch || descriptionMatch) {
          return d;
        }
      });

      const announcements = (await client.queries.announcementsConnection())
        .data;
      const announcementsFiltered =
        announcements?.announcementsConnection?.edges?.filter((a) => {
          const titleMatch = a?.node?.title
            .toLowerCase()
            .includes(keyword.toLowerCase());
          const descriptionMatch = a?.node?.description.children.some(
            (child: any) =>
              child.children.some((c: any) =>
                c?.text?.toLowerCase().includes(keyword.toLowerCase())
              )
          );
          if (titleMatch || descriptionMatch) {
            return a;
          }
        });

      const vacancy = (await client.queries.vacanciesConnection()).data;
      const vacancyFiltered = vacancy?.vacanciesConnection?.edges?.filter(
        (v) => {
          const titleMatch = v?.node?.title
            .toLowerCase()
            .includes(keyword.toLowerCase());
          const descriptionMatch = v?.node?.description.children.some(
            (child: any) =>
              child.children.some((c: any) =>
                c?.text?.toLowerCase().includes(keyword.toLowerCase())
              )
          );
          if (titleMatch || descriptionMatch) {
            return v;
          }
        }
      );

      const newspapers = (await client.queries.newspapersConnection()).data;
      const newspapersFiltered =
        newspapers?.newspapersConnection?.edges?.filter((n) => {
          const titleMatch = n?.node?.title
            .toLowerCase()
            .includes(keyword.toLowerCase());
          if (titleMatch) {
            return n;
          }
        });

      data.push(...(newsFiltered as any[]));
      data.push(...(announcementsFiltered as any[]));
      data.push(...(vacancyFiltered as any[]));
      data.push(...(newspapersFiltered as any[]));

      setData(data || null);
      setLoading(false);
    }
    if (keyword) {
      setLoading(true);
      getSearch();
    } else {
      setData(null);
    }
  }, [keyword]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <Modal
      isOpen={searchView}
      onRequestClose={() => setSearchView(false)}
      className={styles.modal}
      closeTimeoutMS={200}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.modal__inner}
      >
        <div className={styles.modal__inner_search}>
          <input
            autoFocus
            id="search"
            type="text"
            placeholder="Введіть слово"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <label htmlFor="search">
            <GoSearch />
          </label>
        </div>
        <AnimateHeight height={isLoading ? 40 : 0}>
          <div className={styles.modal__inner_loading}>
            <span>Пошук...</span>
            <div></div>
          </div>
        </AnimateHeight>
        {keyword && data && data.length > 0 && (
          <motion.div className={styles.modal__inner_answers}>
            {data.map((d, index) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={"answer" + index}
              >
                <Image src={Logo} alt="logo" width={25} height={24.35} />
                {d.node && "hideNews" in d.node && (
                  <Link href={"/news/" + d.node._sys.filename}>
                    <a>{d.node.title}</a>
                  </Link>
                )}
                {d.node && "hideVac" in d.node && (
                  <Link href={"/vacancies/" + d.node._sys.filename}>
                    <a>{d.node.title}</a>
                  </Link>
                )}
                {d.node && "hidePaper" in d.node && (
                  <Link href={d?.node?.pdf} download>
                    <a>{d.node.title}</a>
                  </Link>
                )}
                {d.node && "hideAnn" in d.node && (
                  <Link href={"/announcements/" + d.node._sys.filename}>
                    <a>{d.node.title}</a>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Modal>
  );
};

export default SearchModal;
