import { AsyncReturnType } from "@/pages/[filename]";
import styles from "./Message.module.scss";
import { GetServerSidePropsContext } from "next";
import client from "@/tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import MessageCard from "@/components/util/MessageCard/MessageCard";
import { useChat } from "@/context/ChatContext";
import { Skeleton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import ChatsLayout from "@/components/layout/Chats/Chats";
import { isEmpty } from "lodash";
import GroupCard from "@/components/util/GroupCard/GroupCard";

const Messages = (
  props: AsyncReturnType<typeof getServerSideProps>["props"]
) => {
  const { data } = useTina(props);
  const { chats, groups, isLoading } = useChat();
  const chats_ = [...chats, ...groups];

  const sortedCombined = chats_.sort((a, b) => {
    // Check if the object has 'latest_message_created' (Chat) or 'created' (Group) and compare
    const dateA = new Date(
      "latest_message_created" in a ? a.latest_message_created : a.created
    ).getTime();
    const dateB = new Date(
      "latest_message_created" in b ? b.latest_message_created : b.created
    ).getTime();

    return dateB - dateA;
  });

  return (
    <ChatsLayout data={data}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.messagesContainer}
          >
            <Skeleton variant="rounded" height={62} />
            <Skeleton variant="rounded" height={62} />
            <Skeleton variant="rounded" height={62} />
          </motion.div>
        )}
        {!isLoading && !isEmpty(sortedCombined) && sortedCombined.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.messagesContainer}
          >
            <AnimatePresence>
              {sortedCombined.map((chat, index) => {
                if ("latest_message_created" in chat) {
                  if (chat.status === "completed")
                    return (
                      <motion.div
                        key={"MessageCard" + index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <MessageCard
                          title={chat.title}
                          created={chat.latest_message_created}
                          text={chat.latest_message}
                          messageId={chat.latest_message_id}
                          chatId={chat.id}
                          senderId={chat.latest_message_sender_id}
                          seen={chat.latest_message_seen}
                          isLarge={
                            !!chat.latest_message &&
                            chat.latest_message.length > 200
                          }
                        />
                      </motion.div>
                    );
                } else {
                  return (
                    <motion.div
                      key={"GroupCard" + index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <GroupCard
                        group={chat}
                        isLarge={
                          !!chat.description && chat.description.length > 200
                        }
                      />
                    </motion.div>
                  );
                }
              })}
            </AnimatePresence>
          </motion.div>
        )}
        {!isLoading && sortedCombined.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.messagesContainer__noChats}
          >
            <h1>Повідомлень ще немає...</h1>
            <p>
              Тут будуть відображатись повідомлення, отримані в процесі
              користування сервісом
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ChatsLayout>
  );
};

export default Messages;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `home.md`,
  });
  const props = {
    ...tinaProps,
    enableVisualEditing: process.env.VERCEL_ENV === "preview",
  };
  return {
    props: JSON.parse(JSON.stringify(props)) as typeof props,
  };
};
