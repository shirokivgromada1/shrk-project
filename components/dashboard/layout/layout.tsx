import { Layout } from "@/components/layout/layout";
import React, {
  Dispatch,
  HTMLInputTypeAttribute,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { ContentQueryQuery } from "@/tina/__generated__/types";
import Panel from "./Panel/Panel";
import axios from "axios";
import { AUTH_ENDPOINTS, CHAT_ENDPOINTS } from "@/constants/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { BounceLoader } from "react-spinners";
import styles from "./Layout.module.scss";
import axiosInstance from "@/interceptors/axios";
import { useUser } from "@/context/UserContext";
import useIdleTimeout from "@/hooks/useIdleTimeout";
import classNames from "classnames";
import Report from "./../../../assets/report.svg";
import Help from "./../../../assets/help.svg";
import Offer from "./../../../assets/offer.svg";
import Message from "./../../../assets/message.svg";
import Link from "next/link";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";
import { Chat, useChat } from "@/context/ChatContext";
import FormModal, { Inputs } from "@/components/util/FormModal/FormModal";
import { isEmpty } from "lodash";
import * as yup from "yup";
import Mail from "@/assets/mail.svg";
import Write from "@/assets/write.svg";
import GroupModal from "@/components/util/GroupModal/GroupModal";
import Group from "@/assets/group.svg";

export type FeedBackInputs = {
  institution: string;
};

export type Field = {
  type: HTMLInputTypeAttribute;
  label: string;
  id: string;
  registerLabel: keyof Inputs;
  schema: yup.StringSchema<string, yup.AnyObject, undefined, "">;
  listOptions?: { value: string; label: string }[];
};

const DashboardLayout = ({
  data,
  children,
  setType,
}: {
  data?: ContentQueryQuery;
  children: React.ReactNode;
  setType?: Dispatch<
    SetStateAction<"chat" | "feedback" | "help" | "offers" | null>
  >;
}) => {
  const router = useRouter();
  const {
    userId,
    onChangeUserId,
    isAuth,
    onChangeLoading,
    onChangeAuth,
    logOut,
    isLoading,
  } = useAuth();
  const { isIdle } = useIdleTimeout();
  const {
    onChangePhoneNumber,
    onChangeLocality,
    onChangeStatus,
    onChangeViber,
    onChangeAdmin,
    isAdmin,
  } = useUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const mobileMatch = useBetterMediaQuery("(max-width: 910px)");

  const { onChangeViberModal } = useAuth();

  const {
    chats,
    groups,
    onChangeChats,
    onChangeGroups,
    onChangeLoading: onChangeChatLoading,
    socketRefs,
  } = useChat();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const ref: React.Ref<any> = useRef(null);
  const chatsRef = useRef(chats);

  const countUnread = chats.filter(
    (chat) =>
      !chat.latest_message_seen && userId !== chat.latest_message_sender_id
  ).length;

  const countFeedback = chats.filter(
    (chat) =>
      chat.type === "feedback" &&
      !chat.latest_message_seen &&
      userId !== chat.latest_message_sender_id &&
      chat.status === "completed"
  ).length;

  const countHelp = chats.filter(
    (chat) =>
      chat.type === "help" &&
      !chat.latest_message_seen &&
      userId !== chat.latest_message_sender_id &&
      chat.status === "completed"
  ).length;

  const countOffers = chats.filter(
    (chat) =>
      chat.type === "offers" &&
      !chat.latest_message_seen &&
      userId !== chat.latest_message_sender_id &&
      chat.status === "completed"
  ).length;

  const countChats = chats.filter(
    (chat) =>
      chat.type === "chat" &&
      !chat.latest_message_seen &&
      userId !== chat.latest_message_sender_id &&
      chat.status === "completed"
  ).length;

  const countGroups = groups.filter((group) => {
    return !group.seen_items.some((item) => item.id === userId);
  }).length;

  function openModal() {
    setIsOpen(true);
    document.body.classList.add("overflow-y-hidden");
  }

  function openGroupModal() {
    setGroupModalOpen(true);
    document.body.classList.add("overflow-y-hidden");
  }

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      router.push("/sign-in");
    } else {
      onChangeLoading(true);
      axiosInstance
        .get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}${AUTH_ENDPOINTS.ME}/`, {
          headers: {
            Authorization: "JWT " + localStorage.getItem("access_token"),
          },
        })
        .then((response) => {
          const { message, data } = response.data;
          onChangeUserId(data.id);
          onChangePhoneNumber(data.phoneNumber);
          onChangeLocality(data.locality);
          onChangeStatus(data.vulnerableGroup);
          onChangeViber(data.hasViber);
          onChangeAdmin(data.is_admin);

          if (!data.hasViber && !data.is_admin) {
            onChangeViberModal(true);
          }

          onChangeAuth(true);
        })
        .catch((err) => {
          console.info(err);
        })
        .finally(() => {
          onChangeLoading(false);
        });
    }
  }, [isAuth]);

  useEffect(() => {
    if (isIdle) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}${AUTH_ENDPOINTS.LOGOUT}/`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          const { message } = response.data;

          logOut();
          router.push("/sign-in");
        })
        .catch((err) => {});
    }
  }, [isIdle, isAuth]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (open) ref?.current?.focus();
  }, [open]);

  useEffect(() => {
    chats.forEach((chat: Chat) => {
      if (!socketRefs[chat.id]) {
        socketRefs[chat.id] = new WebSocket(
          `ws://site.shtg.gov.ua/ws/chat/${chat.id}/`,
          "echo-protocol"
        );
        socketRefs[chat.id].onmessage = (event) => {
          const data = JSON.parse(event.data);
          const { chat_id } = data;
          if (chat_id) {
            axiosInstance
              .get(
                `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.CHAT_BY_ID}/${chat.id}/`
              )
              .then((response) => {
                const chat: Chat = response.data;
                const currentChats = chatsRef.current;
                if (!isEmpty(chat)) {
                  onChangeChats([
                    ...currentChats.filter((c) => c.id !== +chat_id),
                    chat,
                  ]);
                } else {
                  onChangeChats([...chats.filter((c) => c.id !== +chat_id)]);
                }
              })
              .catch((error) => {});
          }
        };
        return () => {
          socketRefs[chat.id].close();
          delete socketRefs[chat.id];
        };
      }
    });
  }, [chats]);

  useEffect(() => {
    onChangeChatLoading(true);
    axiosInstance
      .get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.MESSAGES}/`,
        {
          headers: {
            Authorization: "JWT " + localStorage.getItem("access_token"),
          },
        }
      )
      .then((response) => {
        onChangeChats(response.data);
      })
      .catch((error) => {})
      .finally(() => {
        onChangeChatLoading(false);
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://site.shtg.gov.ua/ws/groups/`,
      "echo-protocol"
    );

    socket.onmessage = (event) => {
      onChangeChatLoading(true);
      axiosInstance
        .get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.GROUPS}/`)
        .then((response) => {
          onChangeGroups(response.data);
        })
        .catch((error) => {})
        .finally(() => {
          onChangeChatLoading(false);
        });
    };
  }, []);

  const [stateForm, setStateForm] = useState<
    | {
        headline: string;
        fields: Field[];
      }
    | undefined
  >(undefined);

  const feedBackPost = () => {
    openModal();
    setStateForm({
      headline: "Відгук про роботу",
      fields: [
        {
          type: "text",
          label: "1. До якої установи/підприємства ви звертались?",
          id: "institution",
          registerLabel: "institution",
          schema: yup
            .string()
            .required("Установа є обов'язковим")
            .max(400, "Установа має містити максимум 400 символів"),
        },
        {
          type: "text",
          label: "2. Як давно турбує це питання?",
          id: "frequency_disturbance",
          registerLabel: "frequency_disturbance",
          schema: yup
            .string()
            .required("Питання є обов'язковим")
            .max(400, "Питання має містити максимум 400 символів"),
        },
        {
          type: "text",
          label: "3. Вкажіть населений пункт?",
          id: "settlement",
          registerLabel: "settlement",
          schema: yup
            .string()
            .required("Населений пункт є обов'язковим")
            .max(400, "Населений пункт має містити максимум 400 символів"),
        },
      ],
    });
  };

  const helpPost = () => {
    openModal();
    setStateForm({
      headline: "Потрібна допомога",
      fields: [
        {
          type: "text",
          label: "1. Вкажіть населений пункт",
          id: "settlement",
          registerLabel: "settlement",
          schema: yup
            .string()
            .required("Установа є обов'язковим")
            .max(400, "Установа має містити максимум 400 символів"),
        },
        {
          type: "radio",
          label: "2. Який вид допомоги потрібний?",
          id: "helpType",
          registerLabel: "helpType",
          listOptions: [
            { label: "Соціальна", value: "social" },
            { label: "Гуманітарна", value: "humanitarian" },
            { label: "Оформлення документів", value: "paperwork" },
            { label: "Консультація з фахівцем", value: "consultation" },
          ],
          schema: yup
            .string<"social" | "humanitarian" | "paperwork" | "consultation">()
            .required("Вид допомоги є обов'язковим")
            .max(400, "Вид допомоги має містити максимум 400 символів"),
        },
        {
          type: "text",
          label: "3. До якої установи/підприємства ви звертались?",
          id: "institution",
          registerLabel: "institution",
          schema: yup
            .string()
            .required("Установа є обов'язковим")
            .max(400, "Установа має містити максимум 400 символів"),
        },
      ],
    });
  };

  const offerPost = () => {
    openModal();
    setStateForm({
      headline: "Пропозиції",
      fields: [
        {
          type: "text",
          label: "1. Вкажіть населений пункт",
          id: "settlement",
          registerLabel: "settlement",
          schema: yup
            .string()
            .required("Установа є обов'язковим")
            .max(400, "Установа має містити максимум 400 символів"),
        },
      ],
    });
  };

  useEffect(() => {
    if (setType && isAdmin)
      setType(
        (router.query.type as "chat" | "feedback" | "help" | "offers") || null
      );
  }, [router]);

  useEffect(() => {
    onChangeLoading(true);
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.GROUPS}/`, {
        headers: {
          Authorization: "JWT " + localStorage.getItem("access_token"),
        },
      })
      .then((response) => {
        onChangeGroups(response.data);
      })
      .catch((err) => {})
      .finally(() => {
        onChangeLoading(false);
      });
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {(isLoading || !isAuth) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BounceLoader color="#36d7b7" />
            </motion.div>
          )}
          {!isLoading && isAuth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Layout data={data?.global as any}>
                <Panel
                  handleClick={handleClick}
                  handleClose={handleClose}
                  open={open}
                />
                <div
                  className={styles.dashboard}
                  style={{
                    height: open ? "728px" : "100%",
                    overflow: "hidden",
                    paddingBottom: isEmpty(chats) ? "0px" : "260px",
                  }}
                >
                  <div
                    className={classNames(styles.dashboard_menu)}
                    style={{ left: open ? "0" : "-100%" }}
                  >
                    <div className={styles.dashboard_menu_options}>
                      <h1>Зворотній зв’язок</h1>
                      <ul>
                        <li>
                          <button
                            type="button"
                            onClick={
                              !isAdmin
                                ? feedBackPost
                                : () =>
                                    router.push({
                                      pathname: "/dashboard",
                                      query: { type: "feedback" },
                                    })
                            }
                          >
                            <div
                              style={{
                                opacity:
                                  (isAdmin &&
                                    router.query.type === "feedback") ||
                                  !isAdmin
                                    ? 1
                                    : 0.5,
                              }}
                            >
                              <span>
                                <Report />
                              </span>
                              <p>Відгук про роботу</p>
                            </div>
                            {countFeedback !== 0 && (
                              <span>
                                {countFeedback !== 0 && countFeedback}
                              </span>
                            )}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={
                              !isAdmin
                                ? helpPost
                                : () =>
                                    router.push({
                                      pathname: "/dashboard",
                                      query: { type: "help" },
                                    })
                            }
                          >
                            <div
                              style={{
                                opacity:
                                  (isAdmin && router.query.type === "help") ||
                                  !isAdmin
                                    ? 1
                                    : 0.5,
                              }}
                            >
                              <span>
                                <Help />
                              </span>
                              <p>Потрібна допомога</p>
                            </div>
                            {countHelp !== 0 && (
                              <span>{countHelp !== 0 && countHelp}</span>
                            )}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={
                              !isAdmin
                                ? offerPost
                                : () =>
                                    router.push({
                                      pathname: "/dashboard",
                                      query: { type: "offers" },
                                    })
                            }
                          >
                            <div
                              style={{
                                opacity:
                                  (isAdmin && router.query.type === "offers") ||
                                  !isAdmin
                                    ? 1
                                    : 0.5,
                              }}
                            >
                              <span>
                                <Offer />
                              </span>
                              <p>Пропозиції</p>
                            </div>
                            {countOffers !== 0 && (
                              <span>{countOffers !== 0 && countOffers}</span>
                            )}
                          </button>
                        </li>
                        {isAdmin && (
                          <li>
                            <button
                              type="button"
                              onClick={() =>
                                router.push({
                                  pathname: "/dashboard",
                                  query: { type: "chat" },
                                })
                              }
                            >
                              <div
                                style={{
                                  opacity:
                                    (isAdmin && router.query.type === "chat") ||
                                    !isAdmin
                                      ? 1
                                      : 0.5,
                                }}
                              >
                                <span>
                                  <Mail />
                                </span>
                                <p>Загальні</p>
                              </div>
                              {countChats !== 0 && <span>{countChats}</span>}
                            </button>
                          </li>
                        )}
                        {!isAdmin && mobileMatch ? (
                          <li>
                            <button
                              onClick={() => {
                                handleClose();
                                router.push("/dashboard/messages");
                              }}
                            >
                              <div
                                style={{
                                  opacity:
                                    (isAdmin &&
                                      router.asPath ===
                                        "/dashboard/messages") ||
                                    !isAdmin
                                      ? 1
                                      : 0.5,
                                }}
                              >
                                <span>
                                  <Message />
                                </span>
                                <p>Повідомлення</p>
                              </div>
                              {countUnread + countGroups !== 0 && (
                                <span>{countUnread + countGroups}</span>
                              )}
                            </button>
                          </li>
                        ) : (
                          <></>
                        )}
                        {isAdmin && mobileMatch ? (
                          <li>
                            <button
                              onClick={() => {
                                handleClose();
                                router.push("/dashboard/groups");
                              }}
                            >
                              <div
                                style={{
                                  opacity:
                                    (isAdmin &&
                                      router.asPath === "/dashboard/groups") ||
                                    !isAdmin
                                      ? 1
                                      : 0.5,
                                }}
                              >
                                <span>
                                  <Group />
                                </span>
                                <p>Групові повідомлення</p>
                              </div>
                            </button>
                          </li>
                        ) : (
                          <></>
                        )}
                      </ul>
                    </div>
                    <div
                      className={styles.dashboard_menu_feedback}
                      style={{ marginTop: isAdmin ? "40px" : "30px" }}
                    >
                      <p
                        className={classNames(
                          styles.dashboard_menu_feedback_paragraph,
                          {
                            [styles.dashboard_menu_feedback_paragraph_user]:
                              !isAdmin,
                            [styles.dashboard_menu_feedback_paragraph_admin]:
                              isAdmin,
                          }
                        )}
                      >
                        {isAdmin
                          ? "Натисніть на кнопку, щоб створити групове повідомлення"
                          : "Натисніть на кнопку, щоб зв’язатись з нами"}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          if (isAdmin) {
                            openGroupModal();
                          } else {
                            openModal();
                            setStateForm(undefined);
                          }
                        }}
                        style={{ padding: isAdmin ? "14px 31px" : "8px 25px" }}
                      >
                        {isAdmin && <Write />}
                        <span>
                          {isAdmin ? "Створити" : "Звернутись до нас"}
                        </span>
                      </button>
                      {modalIsOpen && (
                        <FormModal
                          modalIsOpen={modalIsOpen}
                          setIsOpen={setIsOpen}
                          handleClose={handleClose}
                          stateForm={stateForm}
                        />
                      )}
                      {groupModalOpen && (
                        <GroupModal
                          modalIsOpen={groupModalOpen}
                          setIsOpen={setGroupModalOpen}
                          handleClose={() => setGroupModalOpen(false)}
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.dashboard_tab}>{children}</div>
                </div>
              </Layout>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardLayout;
