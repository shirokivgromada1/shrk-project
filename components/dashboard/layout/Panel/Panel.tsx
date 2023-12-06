import Link from "next/link";
import styles from "./Panel.module.scss";
import Notification from "./../../../../assets/notification.svg";
import Settings from "./../../../../assets/settings.svg";
import Exit from "./../../../../assets/exit.svg";
import Burger from "./../../../../assets/burger.svg";
import Cross from "./../../../../assets/cross.svg";
import classNames from "classnames";
import { AUTH_ENDPOINTS } from "@/constants/endpoints";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import { useChat } from "@/context/ChatContext";
import GroupIcon from "@/assets/group.svg";

type Props = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  open: boolean;
};

const Panel = ({ handleClick, handleClose, open }: Props) => {
  const { logOut, userId } = useAuth();
  const { clear, isAdmin } = useUser();

  const mobileMatch = useBetterMediaQuery("(max-width: 910px)");

  const { chats, groups } = useChat();
  const countUnread = chats.filter(
    (chat) =>
      !chat.latest_message_seen &&
      userId !== chat.latest_message_sender_id &&
      chat.status === "completed"
  ).length;

  const countGroups = groups.filter((group) => {
    return !group.seen_items.some((item) => item.id === userId);
  }).length;

  const handleExit = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${AUTH_ENDPOINTS.LOGOUT}/`,
        {
          refresh_token: localStorage.getItem("refresh_token"),
        },
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
            accept: "application/json",
          },
          timeout: 5000,
        }
      )
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        logOut();
        clear();
      })
      .catch((error) => {});
  };

  return (
    <div className={classNames(styles.panel)}>
      <div className="container">
        {!mobileMatch ? (
          <div className={styles.panel__notification}>
            {isAdmin && (
              <Link href={"/dashboard/groups"}>
                <a>
                  <span>
                    <GroupIcon />
                  </span>
                  <span className={styles.panel__notification_text}>
                    Групові повідомлення
                  </span>
                </a>
              </Link>
            )}
            {!isAdmin && (
              <Link href={"/dashboard/messages"}>
                <a>
                  <span className={styles.panel__notification_icon}>
                    {countUnread + countGroups !== 0 && (
                      <span>{countUnread + countGroups}</span>
                    )}
                    <Notification />
                  </span>
                  <span className={styles.panel__notification_text}>
                    Повідомлення
                  </span>
                </a>
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.panel__burger}>
            {!open && (
              <button type="button" onClick={handleClick}>
                <Burger />
              </button>
            )}
            {open && (
              <button type="button" onClick={handleClose}>
                <Cross />
              </button>
            )}
          </div>
        )}
        <div className={styles.panel__dashboard}>
          {isAdmin ? "Кабінет адміністратора" : "Особистий кабінет"}
        </div>
        <div className={styles.panel__control}>
          {!isAdmin && (
            <Link href={"/dashboard/settings"}>
              <a>
                <Settings />
              </a>
            </Link>
          )}
          <button onClick={handleExit}>
            <Exit />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
