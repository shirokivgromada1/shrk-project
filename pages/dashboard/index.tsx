import { useAuth } from "@/context/AuthContext";
import styles from "./Dashboard.module.scss";
import client from "@/tina/__generated__/client";
import { GetServerSidePropsContext } from "next";
import { AsyncReturnType } from "../[filename]";
import { useTina } from "tinacms/dist/react";
import DashboardLayout from "@/components/dashboard/layout/layout";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import Button from "@/components/util/Button/Button";
import Modal from "@/components/util/Modal/Modal";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS } from "@/constants/endpoints";
import { Button as MaterialButton } from "@mui/material";
import { isEmpty } from "lodash";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import ChatCard, { Option, options } from "@/components/util/ChatCard/ChatCard";
import Loader from "@/components/util/Loader/Loader";
import GroupTableCard from "@/components/util/GroupTableCard/GroupTableCard";

import DashboardChatCard from "@/components/util/DashboardChatCard/DashboardChatCard";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";

export default function Dashboard(
  props: AsyncReturnType<typeof getServerSideProps>["props"]
) {
  const { data } = useTina(props);
  const { openViberModal, onChangeViberModal, userId } = useAuth();
  const { chats, groups, onChangeChats, onChangeLoading, isLoading } =
    useChat();
  const { isAdmin } = useUser();
  const [isView, setView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [type, setType] = useState<
    "chat" | "feedback" | "help" | "offers" | null
  >(null);

  const mobileMatch = useBetterMediaQuery(
    !isAdmin ? "(max-width: 735px)" : "(max-width: 1260px)"
  );

  let chats_;
  if (isAdmin) {
    chats_ = chats;
  } else {
    chats_ = [...chats, ...groups];
  }

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

  const removeChat = () => {
    axiosInstance
      .delete(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.CHAT_DELETE}/${activeIndex}`
      )
      .then((response) => {
        onChangeChats(chats.filter((chat) => chat.id !== activeIndex));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => cancelRemove());
  };

  useEffect(() => {
    if (isAdmin) {
      const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/chats/`,
        "echo-protocol"
      );
      socket.onmessage = (event) => {
        onChangeLoading(true);
        axiosInstance
          .get(
            `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.MESSAGES}/`
          )
          .then((response) => {
            onChangeChats(response.data);
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            onChangeLoading(false);
          });
      };
    }
  }, [isAdmin]);

  const cancelRemove = () => {
    setView(false);
    setActiveIndex(null);
  };

  return (
    <DashboardLayout data={data} setType={setType}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Loader />
          </motion.div>
        )}

        {!isLoading &&
          sortedCombined.filter((chat) => {
            if (type && isAdmin && "latest_message_created" in chat)
              return chat.type === type;
            else return chat;
          }).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!mobileMatch && (
                <table className={styles.table}>
                  <tr>
                    <th>Назва</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    {isAdmin && <th>Спосіб звʼязку</th>}
                    {isAdmin && <th>Юзер</th>}
                    <th>Дії</th>
                  </tr>
                  <AnimatePresence>
                    {sortedCombined
                      .filter((chat) => {
                        if (type && isAdmin && "latest_message_created" in chat)
                          return chat.type === type;
                        else return chat;
                      })
                      .map((chat, index) =>
                        "latest_message_created" in chat ? (
                          <ChatCard
                            key={"chat" + index}
                            chat={chat}
                            setView={setView}
                            setActiveIndex={setActiveIndex}
                          />
                        ) : (
                          <GroupTableCard
                            key={"group" + index}
                            chat={chat}
                            setView={setView}
                            setActiveIndex={setActiveIndex}
                          />
                        )
                      )}
                  </AnimatePresence>
                </table>
              )}
              {mobileMatch ? (
                <div className={styles.dashboard}>
                  {sortedCombined.map((chat, index) => {
                    return (
                      <DashboardChatCard
                        key={"dashboardChat" + index}
                        chat={chat}
                        setActiveIndex={setActiveIndex}
                        setView={setView}
                      />
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
              <Modal
                isView={isView}
                onClose={cancelRemove}
                closeMarkup={
                  <div className={styles.confirm}>
                    <Button
                      type="button"
                      classNames={styles.confirm__yes}
                      onClick={removeChat}
                      style={{ borderRadius: 26, padding: "8px 24px" }}
                    >
                      Так
                    </Button>
                    <MaterialButton
                      type="button"
                      className={styles.confirm__no}
                      onClick={cancelRemove}
                      style={{
                        borderRadius: 26,
                        padding: "8px 24px",
                      }}
                    >
                      Ні
                    </MaterialButton>
                  </div>
                }
              >
                <div className={styles.modal}>
                  <h1>Видалити повідомлення?</h1>
                  <p>Видалені повідомлення неможливо відновити.</p>
                </div>
              </Modal>
            </motion.div>
          )}
        {isEmpty(
          sortedCombined.filter((chat) => {
            if (type && isAdmin && "latest_message_created" in chat)
              return chat.type === type;
            else return chat;
          })
        ) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.noChats}
          >
            <h1>Заяв ще немає...</h1>
            <p>
              Тут будуть відображатись заяви, надіслані в процесі користування
              сервісом
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        isView={openViberModal}
        onClose={() => onChangeViberModal(false)}
        closeMarkup={
          <div className={styles.viberAssistant__button}>
            <Button
              type="button"
              style={{ borderRadius: 26 }}
              onClick={() => {
                window.open(
                  `viber://pa?chatURI=shyrokebot&context=${userId}`,
                  "_blank"
                );
                onChangeViberModal(false);
              }}
            >
              Додати помічник
            </Button>
          </div>
        }
      >
        <div className={styles.viberAssistant}>
          <h1>Привіт, я можу стати твоїм помічником!</h1>
          <div>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M9.95606 7.7525C9.72374 7.71869 9.48685 7.76545 9.28481 7.885H9.26731C8.79856 8.16 8.37606 8.50625 8.01606 8.91375C7.71606 9.26 7.55356 9.61 7.51106 9.9475C7.48606 10.1475 7.50356 10.35 7.56231 10.5412L7.58481 10.5538C7.92231 11.545 8.36231 12.4988 8.89981 13.3963C9.59288 14.6569 10.4458 15.8227 11.4373 16.865L11.4673 16.9075L11.5148 16.9425L11.5436 16.9763L11.5786 17.0063C12.6245 18.0008 13.7931 18.8577 15.0561 19.5563C16.4998 20.3425 17.3761 20.7138 17.9023 20.8688V20.8763C18.0561 20.9238 18.1961 20.945 18.3373 20.945C18.7855 20.9119 19.2097 20.7297 19.5423 20.4275C19.9486 20.0675 20.2923 19.6438 20.5598 19.1725V19.1638C20.8111 18.6888 20.7261 18.2413 20.3636 17.9375C19.6354 17.3013 18.8481 16.7362 18.0123 16.25C17.4523 15.9463 16.8836 16.13 16.6536 16.4375L16.1623 17.0575C15.9098 17.365 15.4523 17.3225 15.4523 17.3225L15.4398 17.33C12.0261 16.4588 11.1148 13.0025 11.1148 13.0025C11.1148 13.0025 11.0723 12.5325 11.3886 12.2925L12.0036 11.7975C12.2986 11.5575 12.5036 10.99 12.1873 10.43C11.7043 9.59345 11.1404 8.80635 10.5036 8.08C10.3647 7.90906 10.1699 7.79263 9.95356 7.75125L9.95606 7.7525ZM15.7248 6.25C15.5591 6.25 15.4001 6.31585 15.2829 6.43306C15.1657 6.55027 15.0998 6.70924 15.0998 6.875C15.0998 7.04076 15.1657 7.19973 15.2829 7.31694C15.4001 7.43415 15.5591 7.5 15.7248 7.5C17.3048 7.5 18.6173 8.01625 19.6561 9.00625C20.1898 9.5475 20.6061 10.1888 20.8786 10.8913C21.1523 11.595 21.2773 12.3463 21.2448 13.0988C21.2378 13.2645 21.297 13.4262 21.4093 13.5484C21.5216 13.6705 21.6778 13.743 21.8436 13.75C22.0093 13.757 22.1711 13.6978 22.2932 13.5855C22.4153 13.4732 22.4878 13.317 22.4948 13.1513C22.5336 12.2256 22.3799 11.302 22.0436 10.4388C21.7057 9.57142 21.1935 8.78265 20.5386 8.12125L20.5261 8.10875C19.2373 6.8775 17.6073 6.25 15.7248 6.25Z"
                  fill="#9747FF"
                />
                <path
                  d="M15.6816 8.30499C15.5159 8.30499 15.3569 8.37084 15.2397 8.48805C15.1225 8.60526 15.0566 8.76423 15.0566 8.92999C15.0566 9.09575 15.1225 9.25472 15.2397 9.37193C15.3569 9.48914 15.5159 9.55499 15.6816 9.55499H15.7029C16.8429 9.63624 17.6729 10.0162 18.2541 10.64C18.8504 11.2825 19.1591 12.0812 19.1354 13.0687C19.1316 13.2345 19.1938 13.395 19.3083 13.5149C19.4228 13.6348 19.5803 13.7043 19.746 13.7081C19.9118 13.7119 20.0723 13.6497 20.1922 13.5352C20.3121 13.4207 20.3816 13.2633 20.3854 13.0975C20.4154 11.8012 19.9979 10.6825 19.1704 9.78999V9.78749C18.3241 8.87999 17.1629 8.39999 15.7654 8.30624L15.7441 8.30374L15.6816 8.30499Z"
                  fill="#9747FF"
                />
                <path
                  d="M15.6585 10.3988C15.5748 10.3914 15.4905 10.4009 15.4107 10.4268C15.3308 10.4527 15.257 10.4945 15.1936 10.5495C15.1302 10.6046 15.0786 10.6719 15.0418 10.7474C15.005 10.8228 14.9837 10.905 14.9794 10.9888C14.975 11.0727 14.9876 11.1565 15.0163 11.2354C15.0451 11.3143 15.0895 11.3866 15.1468 11.448C15.2041 11.5093 15.2732 11.5585 15.3499 11.5926C15.4267 11.6266 15.5095 11.6449 15.5935 11.6463C16.116 11.6738 16.4497 11.8313 16.6597 12.0425C16.8709 12.255 17.0285 12.5963 17.0572 13.13C17.0588 13.2139 17.0772 13.2966 17.1114 13.3732C17.1456 13.4498 17.1949 13.5187 17.2563 13.5759C17.3177 13.633 17.39 13.6772 17.4688 13.7059C17.5477 13.7345 17.6315 13.7469 17.7152 13.7425C17.799 13.738 17.881 13.7168 17.9564 13.68C18.0318 13.6431 18.099 13.5915 18.154 13.5282C18.209 13.4649 18.2507 13.3911 18.2766 13.3113C18.3025 13.2315 18.312 13.1473 18.3047 13.0638C18.2647 12.3138 18.0297 11.6513 17.5485 11.1638C17.0647 10.6763 16.406 10.4388 15.6585 10.3988Z"
                  fill="#9747FF"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.83351 2.98001C12.8111 2.09089 16.9359 2.09089 20.9135 2.98001L21.3373 3.07376C22.5 3.3337 23.5679 3.91092 24.4223 4.74129C25.2768 5.57166 25.8842 6.62266 26.1773 7.77751C27.1869 11.7561 27.1869 15.9239 26.1773 19.9025C25.8842 21.0574 25.2768 22.1084 24.4223 22.9387C23.5679 23.7691 22.5 24.3463 21.3373 24.6063L20.9123 24.7C18.421 25.2571 15.8647 25.467 13.316 25.3238L9.99976 28.2913C9.87474 28.4032 9.72196 28.4795 9.55737 28.5123C9.39278 28.545 9.22242 28.533 9.06407 28.4774C8.90572 28.4219 8.76518 28.3249 8.65712 28.1965C8.54907 28.0681 8.47746 27.913 8.44976 27.7475L7.90101 24.47C6.84874 24.1426 5.89802 23.5508 5.13972 22.7511C4.38142 21.9515 3.84088 20.9707 3.56976 19.9025C2.56008 15.9239 2.56008 11.7561 3.56976 7.77751C3.86279 6.62266 4.47026 5.57166 5.32468 4.74129C6.1791 3.91092 7.24701 3.3337 8.40976 3.07376L8.83351 2.98001ZM20.5048 4.80876C16.7964 3.97977 12.9507 3.97977 9.24226 4.80876L8.81726 4.90376C7.99316 5.08833 7.23634 5.49771 6.63086 6.08643C6.02537 6.67514 5.5949 7.42017 5.38726 8.23876C4.4544 11.9147 4.4544 15.7654 5.38726 19.4413C5.595 20.26 6.02565 21.0051 6.63138 21.5939C7.2371 22.1826 7.99418 22.5919 8.81851 22.7763L8.93101 22.8013C9.113 22.842 9.27872 22.936 9.40698 23.0714C9.53523 23.2068 9.6202 23.3773 9.65101 23.5613L10.0185 25.7588L12.3585 23.665C12.452 23.5811 12.5613 23.5169 12.68 23.4761C12.7988 23.4353 12.9245 23.4188 13.0498 23.4275C15.5486 23.6048 18.0599 23.4174 20.5048 22.8713L20.9285 22.7763C21.7528 22.5919 22.5099 22.1826 23.1156 21.5939C23.7214 21.0051 24.152 20.26 24.3598 19.4413C25.2923 15.7663 25.2923 11.915 24.3598 8.23876C24.152 7.42001 23.7214 6.67488 23.1156 6.08614C22.5099 5.49741 21.7528 5.08813 20.9285 4.90376L20.5048 4.80876Z"
                  fill="#9747FF"
                />
              </svg>
              <span>
                : Я буду допомогати з повідомленнями та швидко відповідати тобі)
              </span>
            </span>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

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
