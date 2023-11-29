import { AnimatePresence } from "framer-motion";
import styles from "./MessageBox.module.scss";
import { MutableRefObject, useEffect, useState } from "react";
import { Message, convertToMB } from "@/pages/dashboard/messages/[id]";
import classNames from "classnames";
import { useAuth } from "@/context/AuthContext";
import SanitizeHTML from "../SanitizeHTML";
import GalleryContainer from "../Gallery/Gallery";
import { format } from "date-fns";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";
import MessageItem from "./components/MessageItem/MessageItem";

type Props = {
  messageEl: MutableRefObject<HTMLDivElement | null>;
  messages: Message[] | null;
};

export function truncateMiddleOfLongFileNames(fileName: string) {
  let fileNameLength = fileName.length;

  if (fileNameLength < 15) {
    return fileName;
  } else {
    let extensionDelimiterIndex = fileName.lastIndexOf(".");
    let middleRemovedName = `${fileName.substring(0, 7)}...${fileName.substring(
      extensionDelimiterIndex - 3
    )}`;
    return middleRemovedName;
  }
}

const MessageBox = ({ messageEl, messages }: Props) => {
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    messages?.forEach((message) => {
      message?.files?.forEach((file, index) => {
        fetch("http://127.0.0.1:8000" + file.files)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setFileUrls((prev) => ({ ...prev, [file.filename]: url }));
          });
      });
    });
  }, []);

  return (
    <div className={styles.messageBox} ref={messageEl}>
      <AnimatePresence>
        {messages &&
          messages.map((message, idx) => (
            <MessageItem
              key={"message" + idx}
              message={message}
              fileUrls={fileUrls}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageBox;
