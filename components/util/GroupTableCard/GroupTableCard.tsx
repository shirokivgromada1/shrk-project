import { Group } from "@/context/ChatContext";
import styles from "./GroupTableCard.module.scss";
import { motion } from "framer-motion";
import { format } from "date-fns";
import uaLocale from "date-fns/locale/uk";
import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button/Button";
import Link from "next/link";

type Props = {
  chat: Group;
  setView: Dispatch<SetStateAction<boolean>>;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
};

const GroupTableCard = ({ chat, setView, setActiveIndex }: Props) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classNames(styles.chat)}
    >
      <td>{chat.title}</td>
      <td>
        {format(new Date(chat.created), "d MMM Y", {
          locale: uaLocale,
        })}
      </td>
      <td></td>
      <td>
        <div>
          <Button
            type="button"
            style={{ padding: 0, borderRadius: "50%" }}
            onClick={() => {
              setActiveIndex(chat.id);
              setView(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M13.3167 2.83333H10.8375L10.1292 2.125H6.58753L5.87919 2.83333H3.40002V4.25H13.3167M4.10836 13.4583C4.10836 13.8341 4.25761 14.1944 4.52329 14.4601C4.78897 14.7257 5.1493 14.875 5.52502 14.875H11.1917C11.5674 14.875 11.9278 14.7257 12.1934 14.4601C12.4591 14.1944 12.6084 13.8341 12.6084 13.4583V4.95833H4.10836V13.4583Z"
                fill="white"
              />
            </svg>
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default GroupTableCard;
