import { GetServerSidePropsContext } from "next";
import styles from "./Chat.module.scss";
import client from "@/tina/__generated__/client";
import ChatsLayout from "@/components/layout/Chats/Chats";
import { useTina } from "tinacms/dist/react";
import { AsyncReturnType } from "@/pages/[filename]";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import Button from "@/components/util/Button/Button";
import TextareaAutosize from "react-textarea-autosize";
import { SubmitHandler, useForm } from "react-hook-form";
import { useChat } from "@/context/ChatContext";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS } from "@/constants/endpoints";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ScrollToBottom from "react-scroll-to-bottom";
import GalleryContainer from "@/components/util/Gallery/Gallery";
import MessageBox, {
  truncateMiddleOfLongFileNames,
} from "@/components/util/MessageBox/MessageBox";
import Link from "next/link";
import { AxiosError } from "axios";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";

type Inputs = {
  message: string;
};

const schema = yup
  .object({
    message: yup.string().required(),
  })
  .required();

type ResponseFile = {
  id: number;
  files: string;
  created: string;
  size: number;
  filename: string;
};

export type Message = {
  id: number;
  created: string;
  chat: number;
  seen: boolean;
  sender: number;
  text: string;
  files: ResponseFile[];
};

interface CustomFile {
  file: File;
  isAchievedLimit: boolean;
}

export const convertToMB = (size: number) => {
  return +(size / (1024 * 1024)).toFixed(2);
};

const Chat = (props: AsyncReturnType<typeof getServerSideProps>["props"]) => {
  const { data } = useTina(props);
  const { chats } = useChat();
  const { isAdmin } = useUser();
  const { userId } = useAuth();

  const {
    query: { id },
  } = useRouter();

  const [files, setFiles] = useState<CustomFile[] | null>(null);

  const [messages, setMessages] = useState<Message[] | null>(null);
  const messageEl = useRef<HTMLDivElement | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const [size, setSize] = useState(0);

  const removeFile = (index: number) => {
    if (files) {
      setFiles(
        files.filter((file, fIndex) => {
          if (fIndex === index) {
            const fileSize = convertToMB(file.file.size);
            setSize((prev) => prev - fileSize);
            return;
          }
          return file;
        })
      );
    }
  };

  const handleFile = (fileList: FileList) => {
    const uploadFiles: CustomFile[] = [];

    let _size = size;

    for (let i = 0; i < fileList.length; i++) {
      const fileSize = convertToMB(fileList[i].size);
      _size += fileSize;
      uploadFiles.push({
        file: fileList[i],
        isAchievedLimit: fileSize >= 5,
      });
    }

    setSize(_size);

    if (files) {
      setFiles([...files, ...uploadFiles]);
    } else {
      setFiles([...uploadFiles]);
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    hiddenFileInput.current && hiddenFileInput.current.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = event.target.files;
      handleFile(fileList);
    }
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isDirty, isValid, disabled },
  } = useForm<Inputs>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.CHAT_BY_ID}/${id}/messages/`
        )
        .then((response) => {
          const messages = response.data;
          setMessages((prevMessages) => {
            if (!prevMessages) return messages;
            if (messages && messages.length > 0) {
              const newMessagesToAdd = messages.filter(
                (newMessage: Message) =>
                  !prevMessages.some(
                    (prevMessage) => prevMessage.id === newMessage.id
                  )
              );
              return [...prevMessages, ...newMessagesToAdd];
            } else return null;
          });
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 308) {
            setMessages(null);
            router.push("/dashboard/messages");
          }
        });
    }
  }, [id, chats]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    userId && formData.append("user_id", userId.toString());
    formData.append("message", data.message);
    id && formData.append("id", id.toString());
    files &&
      files.forEach((file) => {
        formData.append("files", file.file);
        formData.append("types", file.file.type);
      });
    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.MESSAGE_CREATE}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setFiles(null);
        setSize(0);
        reset();
      })
      .catch((error) => {});
  };

  return (
    <ChatsLayout data={data}>
      <div className={styles.chat}>
        <div className={styles.chat__title}>
          {id && chats && (
            <h1>{chats.find((chat) => chat.id === +id)?.title}</h1>
          )}
        </div>
        <ScrollToBottom>
          <MessageBox messageEl={messageEl} messages={messages} />
        </ScrollToBottom>
        {id &&
          ((chats &&
            chats.find((chat) => chat.id === +id)?.status === "completed") ||
            isAdmin) && (
            <div className={styles.chat__input}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextareaAutosize
                  placeholder="Напишіть свою відповідь"
                  maxRows={3}
                  minRows={1}
                  {...register("message")}
                />
                <Button
                  classNames={styles.file}
                  type="button"
                  style={{ borderRadius: "50%", padding: 0 }}
                  onClick={handleClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.5 17.9165C6.35302 17.9101 5.23339 17.5658 4.2811 16.9264C3.32882 16.2871 2.58614 15.3812 2.14593 14.3221C1.70573 13.2629 1.58754 12.0975 1.80615 10.9715C2.02475 9.84557 2.57045 8.80904 3.375 7.99155L8.08333 3.33322C8.86435 2.55463 9.92218 2.11743 11.025 2.11743C12.1278 2.11743 13.1856 2.55463 13.9667 3.33322C14.7427 4.11389 15.1783 5.16994 15.1783 6.27072C15.1783 7.37149 14.7427 8.42754 13.9667 9.20822L9.25833 13.8999C8.78992 14.3655 8.15629 14.6269 7.49583 14.6269C6.83536 14.6269 6.20174 14.3655 5.73333 13.8999C5.49812 13.665 5.31211 13.3856 5.1862 13.0779C5.06028 12.7703 4.99698 12.4406 5 12.1082C4.99837 11.4466 5.25908 10.8113 5.725 10.3415L10.4333 5.64988C10.5108 5.57178 10.603 5.50978 10.7045 5.46747C10.8061 5.42517 10.915 5.40338 11.025 5.40338C11.135 5.40338 11.2439 5.42517 11.3455 5.46747C11.447 5.50978 11.5392 5.57178 11.6167 5.64988C11.7719 5.80602 11.859 6.01723 11.859 6.23738C11.859 6.45754 11.7719 6.66875 11.6167 6.82488L6.90833 11.5165C6.75312 11.6727 6.666 11.8839 6.666 12.104C6.666 12.3242 6.75312 12.5354 6.90833 12.6915C7.06446 12.8468 7.27567 12.9339 7.49583 12.9339C7.71598 12.9339 7.92719 12.8468 8.08333 12.6915L12.7917 7.99155C13.2522 7.52386 13.5104 6.89379 13.5104 6.23738C13.5104 5.58098 13.2522 4.95091 12.7917 4.48322C12.3229 4.01505 11.6875 3.75208 11.025 3.75208C10.3625 3.75208 9.72708 4.01505 9.25833 4.48322L4.55 9.16655C3.78655 9.94542 3.35892 10.9926 3.35892 12.0832C3.35892 13.1739 3.78655 14.221 4.55 14.9999C5.33102 15.7785 6.38885 16.2157 7.49166 16.2157C8.59447 16.2157 9.65231 15.7785 10.4333 14.9999L16.9083 8.54988C16.9858 8.47178 17.078 8.40978 17.1795 8.36747C17.2811 8.32516 17.39 8.30338 17.5 8.30338C17.61 8.30338 17.7189 8.32516 17.8205 8.36747C17.922 8.40978 18.0142 8.47178 18.0917 8.54988C18.2469 8.70602 18.334 8.91723 18.334 9.13738C18.334 9.35754 18.2469 9.56875 18.0917 9.72488L11.6167 16.1832C11.078 16.7284 10.4372 17.1621 9.73081 17.4595C9.02445 17.7569 8.2664 17.9122 7.5 17.9165Z"
                      fill="white"
                    />
                  </svg>
                </Button>
                <input
                  style={{ display: "none" }}
                  type="file"
                  multiple={true}
                  ref={hiddenFileInput}
                  onChange={handleChange}
                />
                <Button
                  classNames={styles.submit}
                  type="submit"
                  style={{ borderRadius: "50%", padding: 0 }}
                  disabled={!isValid || size >= 5}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M16.2938 2.49759C16.0931 2.51219 15.8962 2.55926 15.7106 2.63696H15.7081C15.53 2.70759 14.6831 3.06384 13.3956 3.60384L8.78189 5.54696C5.47126 6.94071 2.21689 8.31321 2.21689 8.31321L2.25564 8.29821C2.25564 8.29821 2.03126 8.37196 1.79689 8.53259C1.65209 8.62473 1.5275 8.74528 1.43064 8.88696C1.31564 9.05571 1.22314 9.31384 1.25751 9.58071C1.31376 10.032 1.60626 10.3026 1.81626 10.452C2.02876 10.6032 2.23126 10.6738 2.23126 10.6738H2.23626L5.28814 11.702C5.42501 12.1413 6.21814 14.7488 6.40876 15.3495C6.52126 15.7082 6.63064 15.9326 6.76751 16.1038C6.83376 16.1913 6.91126 16.2645 7.00439 16.3232C7.0528 16.3514 7.10442 16.3736 7.15814 16.3895L7.12689 16.382C7.13626 16.3845 7.14376 16.392 7.15064 16.3945C7.17564 16.4013 7.19251 16.4038 7.22439 16.4088C7.70751 16.5551 8.09564 16.2551 8.09564 16.2551L8.11751 16.2376L9.91939 14.597L12.9394 16.9138L13.0081 16.9432C13.6375 17.2195 14.275 17.0657 14.6119 16.7945C14.9513 16.5213 15.0831 16.172 15.0831 16.172L15.105 16.1157L17.4388 4.16009C17.505 3.86509 17.5219 3.58884 17.4488 3.32071C17.3733 3.04935 17.1992 2.81597 16.9606 2.66634C16.7603 2.54453 16.5279 2.48574 16.2938 2.49759ZM16.2306 3.77884C16.2281 3.81821 16.2356 3.81384 16.2181 3.88946V3.89634L13.9063 15.7276C13.8963 15.7445 13.8794 15.7813 13.8331 15.8182C13.7844 15.857 13.7456 15.8813 13.5425 15.8007L9.84876 12.9688L7.61751 15.0026L8.08626 12.0088L14.1213 6.38384C14.37 6.15259 14.2869 6.10384 14.2869 6.10384C14.3044 5.82009 13.9113 6.02071 13.9113 6.02071L6.30126 10.7351L6.29876 10.7226L2.65126 9.49446V9.49196L2.64189 9.49009C2.64828 9.48796 2.65454 9.48546 2.66064 9.48259L2.68064 9.47259L2.70001 9.46571C2.70001 9.46571 5.95689 8.09321 9.26751 6.69946C10.925 6.00134 12.595 5.29821 13.8794 4.75571C14.6411 4.43509 15.4036 4.11634 16.1669 3.79946C16.2181 3.77946 16.1938 3.77884 16.2306 3.77884Z"
                      fill="white"
                    />
                  </svg>
                </Button>
                {files && files.length > 0 && (
                  <div className={styles.gallery}>
                    <GalleryContainer files={files.map((file) => file.file)} />
                  </div>
                )}
                {files && files.length > 0 && (
                  <div className={styles.files}>
                    {files.map((file, index) => (
                      <a
                        href={URL.createObjectURL(file.file)}
                        download={file.file.name}
                        key={"file" + index}
                        className={styles.files__item}
                        style={{
                          backgroundColor: file.isAchievedLimit
                            ? "rgba(163, 16, 16, 0.50)"
                            : "rgba(48, 156, 84, 0.5)",
                        }}
                      >
                        <span className={styles.files__item_info}>
                          <span>
                            {truncateMiddleOfLongFileNames(file.file.name)}
                          </span>
                          <span>({convertToMB(file.file.size)} Мб)</span>
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M10 1.00714L8.99286 0L5 3.99286L1.00714 0L0 1.00714L3.99286 5L0 8.99286L1.00714 10L5 6.00714L8.99286 10L10 8.99286L6.00714 5L10 1.00714Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                      </a>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}
      </div>
    </ChatsLayout>
  );
};

export default Chat;

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
