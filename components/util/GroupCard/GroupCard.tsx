import { MouseEvent, useEffect, useState } from "react";
import styles from "./GroupCard.module.scss";
import { SlArrowDown } from "react-icons/sl";
import { format } from "date-fns";
import uaLocale from "date-fns/locale/uk";
import AnimateHeight from "react-animate-height";
import Button from "../Button/Button";
import SanitizeHTML from "../SanitizeHTML";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS } from "@/constants/endpoints";
import { useRouter } from "next/router";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import sanitizeHtml from "sanitize-html";
import Trash from "@/assets/trash.svg";
import { Group, useChat } from "@/context/ChatContext";
import { convertToMB } from "@/pages/dashboard/messages/[id]";
import { truncateMiddleOfLongFileNames } from "../MessageBox/MessageBox";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

type Props = {
  group: Group;
  isLarge: boolean;
};

const GroupCard = ({ group, isLarge }: Props) => {
  const {
    title,
    created,
    description,
    files,
    status_items,
    locality_items,
    id,
  } = group;
  const { userId } = useAuth();
  const { isAdmin } = useUser();
  const { onChangeGroups, groups } = useChat();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [seeMore, setSeeMore] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const tabletMatch = useBetterMediaQuery("(max-width: 780px)") as boolean;

  useEffect(() => {
    if (files) {
      files.forEach((file) => {
        fetch("http://127.0.0.1:8000" + file.files)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setUrls([...urls, url]);
          });
      });
    }
  }, []);

  const openHandle = () => {
    if (userId && !group.seen_items.includes({ id: userId })) {
      axiosInstance
        .patch(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.GROUP_READ}/${id}/`
        )
        .then((response) => {
          onChangeGroups([
            ...groups.filter((group) => group.id !== id),
            {
              ...group,
              seen_items: [...group.seen_items, { id: userId }],
            },
          ]);
        })
        .catch((err) => console.error(err));
    }
    setOpen((prev) => !prev);
  };

  const removeGroup = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    axiosInstance
      .delete(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.GROUP_DELETE}/${id}/`
      )
      .then(() => {
        onChangeGroups([...groups.filter((group) => group.id !== id)]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      className={styles.card}
      style={{
        opacity:
          !isAdmin &&
          userId &&
          group.seen_items.find((value) => +value.id === +userId)
            ? "0.5"
            : "1",
      }}
    >
      <div className={styles.card__message} onClick={openHandle}>
        <span className={styles.card__message_title}>{title}</span>
        <div>
          <span className={styles.card__message_lastCreated}>
            {format(new Date(created), "d MMM Y", { locale: uaLocale })}
          </span>
          <div className={styles.card__message_controllers}>
            <Button
              type="button"
              style={{ borderRadius: "50%", padding: 0 }}
              onClick={removeGroup}
            >
              <Trash />
            </Button>
            <SlArrowDown
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </div>
      </div>
      <AnimateHeight height={open ? "auto" : 0}>
        <div className={styles.card__details}>
          <div className={styles.card__details_text}>
            {tabletMatch && (
              <div>
                <b>Дата: </b>
                {format(new Date(created), "d MMM Y", { locale: uaLocale })}
              </div>
            )}
            <div className={styles.card__details_wrapper}>
              <div>
                <SanitizeHTML
                  html={sanitizeHtml(
                    isLarge
                      ? description.slice(0, !seeMore ? 200 : undefined) +
                          (!seeMore ? "..." : "")
                      : description
                  )}
                />
                {isLarge && (
                  <button
                    type="button"
                    onClick={() => setSeeMore((prev) => !prev)}
                    className={styles.card__message_showMore}
                  >
                    <span>{seeMore ? "Меньше" : "Більше"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      style={{
                        transform: seeMore ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M8.75 12.5L15 18.75L21.25 12.5"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {files && (
                <div className={styles.card__details_files}>
                  <h1>Вкладені файли</h1>
                  <div className={styles.card__details_files_items}>
                    {files.map((file, index) => (
                      <div
                        key={"file" + index}
                        className={styles.card__details_files_items_item}
                      >
                        <a href={urls[index]} download={file.filename}>
                          <span>
                            {truncateMiddleOfLongFileNames(file.filename)}
                          </span>
                          <span>({convertToMB(file.size)}) Мб</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.card__details_groups}>
                <div>
                  <h1>Статус</h1>
                </div>
                <div className={styles.card__details_groups_items}>
                  {status_items.map((status, index) => (
                    <div
                      key={"status" + index}
                      className={styles.card__details_groups_items_item}
                    >
                      {status.status}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.card__details_groups}>
                <div>
                  <h1>Населений пункт</h1>
                </div>
                <div className={styles.card__details_groups_items}>
                  {locality_items.map((locality, index) => (
                    <div
                      key={"status" + index}
                      className={styles.card__details_groups_items_item}
                    >
                      {locality.locality}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default GroupCard;
