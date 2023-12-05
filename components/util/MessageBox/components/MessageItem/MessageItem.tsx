import classNames from "classnames";
import styles from "./MessageItem.module.scss";
import { motion } from "framer-motion";
import { Message, convertToMB } from "@/pages/dashboard/messages/[id]";
import { useAuth } from "@/context/AuthContext";
import SanitizeHTML from "@/components/util/SanitizeHTML";
import GalleryContainer from "@/components/util/Gallery/Gallery";
import { truncateMiddleOfLongFileNames } from "../../MessageBox";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS } from "@/constants/endpoints";
import { useUser } from "@/context/UserContext";

type Props = {
  message: Message;
  fileUrls: Record<string, string>;
};

const MessageItem = ({ message, fileUrls }: Props) => {
  const { userId } = useAuth();
  const { isAdmin } = useUser();

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && !message.seen && userId !== message.sender) {
      console.log("seen message");
      axiosInstance
        .post(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.SEEN}/`,
          { messageId: message.id }
        )
        .catch((err) => {
          console.error("err", err);
        });
    }
  }, [inView]);

  console.log("message.files", message.files);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classNames(styles.messageBox__message, {
        [styles.messageBox__message_user]: message.sender === userId,
        [styles.messageBox__message_admin]: isAdmin
          ? message.sender === userId
          : message.sender !== userId,
      })}
      ref={ref}
    >
      <div>
        {isAdmin
          ? message.sender === userId
            ? "А"
            : "Я"
          : message.sender === userId
          ? "Я"
          : "A"}
      </div>
      <div className={styles.messageBox__message_text}>
        <div>
          <SanitizeHTML html={message.text} />
        </div>
        {message.files && message.files.length > 0 && (
          <>
            <div className={styles.messageBox__message_text_gallery}>
              <GalleryContainer
                files={message.files.map((file) => ({
                  name: process.env.NEXT_PUBLIC_APP_BASE_URL + file.files,
                }))}
              />
            </div>
            <div className={styles.files}>
              {message.files.map((file, index) => {
                return (
                  <a
                    href={fileUrls[file.filename] || ""}
                    download={file.filename}
                    key={"file" + index}
                    className={styles.files__item}
                    style={{
                      backgroundColor: "rgba(48, 156, 84, 0.5)",
                    }}
                  >
                    <span className={styles.files__item_info}>
                      <span>
                        {truncateMiddleOfLongFileNames(file.filename)}
                      </span>
                      <span>({convertToMB(file.size)} Мб)</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </>
        )}
        <div className={styles.messageBox__message_text_time}>
          {format(new Date(message.created), "HH:mm")}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;
