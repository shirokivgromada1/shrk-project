import client from "@/tina/__generated__/client";
import styles from "./Groups.module.scss";
import { GetServerSidePropsContext } from "next";
import ChatsLayout from "@/components/layout/Chats/Chats";
import { useTina } from "tinacms/dist/react";
import { AsyncReturnType } from "@/pages/[filename]";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@/context/ChatContext";
import { Skeleton } from "@mui/material";
import { isEmpty } from "lodash";
import GroupCard from "@/components/util/GroupCard/GroupCard";

const Groups = (props: AsyncReturnType<typeof getServerSideProps>["props"]) => {
  const { data } = useTina(props);
  const { isLoading, groups } = useChat();
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
        {!isLoading && !isEmpty(groups) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.groupsContainer}
          >
            <AnimatePresence>
              {groups
                .sort((a, b) =>
                  new Date(a.created) > new Date(b.created) ? -1 : 1
                )
                .map((group, index) => {
                  return (
                    <motion.div
                      key={"GroupCard" + index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <GroupCard
                        group={group}
                        isLarge={
                          !!group.description && group.description.length > 200
                        }
                      />
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </motion.div>
        )}
        {!isLoading && groups.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.groupsContainer__noChats}
          >
            <h1>Групових повідомлень ще немає...</h1>
            <p>
              Тут будуть відображатись групові повідомлення, надіслані
              користувачам сервісу
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ChatsLayout>
  );
};

export default Groups;

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
