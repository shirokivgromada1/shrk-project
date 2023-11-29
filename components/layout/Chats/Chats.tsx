import DashboardLayout from "@/components/dashboard/layout/layout";
import styles from "./Chats.module.scss";
import Button from "@/components/util/Button/Button";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { SlArrowLeft } from "react-icons/sl";
import { useChat } from "@/context/ChatContext";
import { isEmpty } from "lodash";

type Props = {
  data: any;
  children: string | string[] | React.ReactNode;
};

const ChatsLayout = ({ data, children }: Props) => {
  const router = useRouter();
  const { chats, groups } = useChat();

  return (
    <DashboardLayout data={data}>
      <div className={styles.wrapper}>
        <div className={styles.navigation}>
          <Button
            type="button"
            classNames={styles.navigation_backButton}
            style={{ padding: 0, borderRadius: "50%" }}
            onClick={() => router.push("/dashboard")}
          >
            <SlArrowLeft />
          </Button>
          {router.asPath === "/dashboard/messages" &&
            !isEmpty(chats) &&
            chats.filter((chat) => chat.status === "completed").length > 0 && (
              <span>Повідомлення</span>
            )}
          {router.asPath === "/dashboard/groups" && (
            <span>Групові повідомлення</span>
          )}
        </div>
        <AnimatePresence>{children}</AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ChatsLayout;
