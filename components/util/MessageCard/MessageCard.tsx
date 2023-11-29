import { useEffect, useState } from "react";
import styles from "./MessageCard.module.scss";
import { SlArrowDown } from "react-icons/sl";
import { format } from "date-fns";
import uaLocale from "date-fns/locale/uk";
import AnimateHeight from "react-animate-height";
import Button from "../Button/Button";
import SanitizeHTML from "../SanitizeHTML";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS } from "@/constants/endpoints";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useChat } from "@/context/ChatContext";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import sanitizeHtml from "sanitize-html";

type Props = {
  title: string;
  created: string;
  text: string;
  messageId: number;
  chatId: number;
  senderId: number;
  seen: boolean;
  isLarge: boolean;
};

const MessageCard = ({
  title,
  created,
  text,
  messageId,
  senderId,
  chatId,
  seen = false,
  isLarge,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(seen);
  const { userId } = useAuth();
  const router = useRouter();
  const [seeMore, setSeeMore] = useState(false);

  const tabletMatch = useBetterMediaQuery("(max-width: 780px)") as boolean;

  useEffect(() => {
    userId !== senderId ? setShown(seen) : setShown(true);
  });

  const handleShow = () => {
    setOpen((prev) => !prev);
    if (!shown) {
      axiosInstance
        .post(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.SEEN}/`,
          { messageId }
        )
        .catch((err) => {
          console.error("err", err);
        });
    }
  };

  return (
    <div className={styles.card} style={{ opacity: shown ? "0.5" : "1" }}>
      <div className={styles.card__message} onClick={handleShow}>
        <span className={styles.card__message_title}>{title}</span>
        <div>
          <span className={styles.card__message_lastCreated}>
            {format(new Date(created), "d MMM Y", { locale: uaLocale })}
          </span>
          <SlArrowDown
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
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
            <SanitizeHTML
              html={sanitizeHtml(
                isLarge
                  ? text.slice(0, !seeMore ? 200 : undefined) +
                      (!seeMore ? "..." : "")
                  : text
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
          <Button
            type="button"
            style={{ borderRadius: 26 }}
            onClick={() => router.push("/dashboard/messages/" + chatId)}
          >
            Перейти в діалог
          </Button>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default MessageCard;
