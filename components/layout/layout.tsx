import Head from "next/head";
import Header from "./Header/Header";
import layoutData from "./../../content/global/index.json";
import { Global } from "../../tina/__generated__/types";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Menu from "./Header/components/Menu/Menu";
import Footer from "./Footer/Footer";
import { useRouter } from "next/router";
import styles from "./layout.module.scss";
import { LangSwitcherProvider } from "@/helpers/LangSwitcher/LangSwitcher";
import Link from "next/link";
import Notification from "@/assets/notification.svg";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useChat } from "@/context/ChatContext";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";

export const Layout = ({
  data = layoutData,
  children,
}: {
  data?: Omit<Global, "id" | "_sys" | "_values">;
  children: React.ReactNode;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuth, userId } = useAuth();
  const { isAdmin } = useUser();
  const { chats, groups } = useChat();
  const tabletMatch = useBetterMediaQuery("(max-width: 1200px)");

  const countUnread =
    (isAuth &&
      !isAdmin &&
      chats.filter(
        (chat) =>
          !chat.latest_message_seen && userId !== chat.latest_message_sender_id
      ).length) ||
    0;

  const countGroups =
    (isAuth &&
      !isAdmin &&
      groups.filter((group) => {
        return !group.seen_items.some((item) => item.id === userId);
      }).length) ||
    0;

  useEffect(() => {
    menuOpen && setMenuOpen(false);
  }, [router.asPath]);

  return (
    <LangSwitcherProvider>
      <div className={styles.layout}>
        <Head>
          <title>Широківська об'єднана територіальна громада</title>
          <meta
            name="description"
            content="Широківська об'єднана територіальна громада"
          />
          <meta name="google-site-verification" content="BtNoBo6VDG3qZgTAKlHNsPIcxrAm9TBjavDwtpv1maU" />
          <link rel="icon" href="./../../public/favicon.ico" sizes="32x32" />
        </Head>
        <Header
          data={data?.header}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <AnimatePresence mode="wait">
          {menuOpen && <Menu data={data?.header} />}
          {!menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <main className={styles.layout__main}>
                <>{children}</>
                {!tabletMatch &&
                  !router.asPath.startsWith("/dashboard") &&
                  isAuth &&
                  !isAdmin && (
                    <Link href={"/dashboard"}>
                      <a>
                        {countUnread + countGroups !== 0 && (
                          <span>{countUnread + countGroups}</span>
                        )}
                        <Notification />
                      </a>
                    </Link>
                  )}
              </main>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer data={data?.footer} />
      </div>
    </LangSwitcherProvider>
  );
};
