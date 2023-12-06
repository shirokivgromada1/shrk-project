import { Chat, Group } from "@/context/ChatContext";
import styles from "./ChatCard.module.scss";
import { motion } from "framer-motion";
import { format } from "date-fns";
import uaLocale from "date-fns/locale/uk";
import classNames from "classnames";
import { useUser } from "@/context/UserContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosInstance from "@/interceptors/axios";
import { AUTH_ENDPOINTS, CHAT_ENDPOINTS } from "@/constants/endpoints";
import Button from "../Button/Button";
import Link from "next/link";
import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";
import Select, { SingleValue } from "react-select";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--themeBgColor, #fff)",
    padding: 20,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "0px 4px 6px 0px rgba(85, 85, 85, 0.08)",
    borderRadius: 10,
    minWidth: 254,
    transform: "translateY(-30px) !important",
  },
}));

type Props = {
  chat: Chat;
  setView: Dispatch<SetStateAction<boolean>>;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
};

export type User = {
  firstName: string;
  lastName: string;
  locality: string;
  phoneNumber: string;
  vulnerableGroup: string;
};

export type Option = {
  label: string;
  value: string;
};

export const options = [
  { value: "completed", label: "Завершено" },
  { value: "inProgress", label: "В процесі" },
  { value: "rejected", label: "Відхилено" },
];

const ChatCard = ({ chat, setView, setActiveIndex }: Props) => {
  const { isAdmin } = useUser();

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (selectedOption: SingleValue<Option>) => {
    setSelectedOption(selectedOption);
    axiosInstance
      .patch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.CHAT_UPDATE}/${chat.id}/`,
        {
          status: selectedOption?.value,
        }
      )
      .catch(() => {});
  };

  useEffect(() => {
    setSelectedOption(
      options.find((option) => option.value === chat.status) || null
    );
  }, [chat.status]);

  const showInfo = (userID: number) => {
    setLoading(true);
    axiosInstance
      .get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${AUTH_ENDPOINTS.USERS}/${userID}/`
      )
      .then((response) => {
        const user: User = response.data;
        setUser(user);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classNames(styles.chat, {
        [styles.chat__read]: isAdmin && chat.latest_message_seen,
      })}
    >
      <td>{chat.title}</td>
      <td>
        {format(new Date(chat.latest_message_created), "d MMM Y", {
          locale: uaLocale,
        })}
      </td>
      <td>
        <div
          className={classNames(styles.status, {
            [styles.status__completed]: selectedOption?.value === "completed",
            [styles.status__progress]: selectedOption?.value === "inProgress",
            [styles.status__rejected]: selectedOption?.value === "rejected",
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="6"
            viewBox="0 0 6 6"
            fill="none"
          >
            <circle cx="3" cy="3" r="3" />
          </svg>
          {!isAdmin && (
            <span style={{ paddingRight: "25px" }}>
              {chat.status === "completed" && "Завершено"}
              {chat.status === "inProgress" && "В процесі"}
              {chat.status === "rejected" && "Відхилено"}
            </span>
          )}
          {isAdmin && (
            <>
              <Select
                value={selectedOption}
                onChange={handleChange}
                options={options}
                className={classNames(styles.select, {
                  [styles.select__completed]: chat.status === "completed",
                  [styles.select__progress]: chat.status === "inProgress",
                  [styles.select__rejected]: chat.status === "rejected",
                })}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    backgroundColor: "transparent",
                    border: "none !important",
                    borderColor: "transparent !important",
                    boxShadow: "none !important",
                    minHeight: "27px !important",
                  }),
                  valueContainer: (styles) => ({
                    ...styles,
                    padding: "5px 0px 5px 38px",
                    width: "100%",
                  }),
                  container: (styles) => ({
                    ...styles,
                    width: "148px",
                  }),
                  singleValue: (styles) => ({
                    ...styles,
                    color:
                      selectedOption?.value === "completed"
                        ? "#309C54"
                        : selectedOption?.value === "inProgress"
                        ? "#FF7A00"
                        : "#F33A3A",
                  }),

                  dropdownIndicator: () => ({
                    display: "none",
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  menu: (styles) => ({
                    ...styles,
                    borderRadius: "10px !important",
                    opacity: "1 !important",
                  }),
                  menuList: (styles) => ({
                    padding: "15px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    backgroundColor: "var(--themeBgColor, #fff)",
                  }),
                  option: (
                    styles,
                    { data, isDisabled, isFocused, isSelected }
                  ) => {
                    return {
                      padding: 0,
                      paddingBottom: "11px",
                      fontWeight: isSelected ? "600" : "400",
                      ":first-child": {
                        color: "var(--themeColor, rgba(48, 156, 84, 1))",
                        borderBottom: isSelected
                          ? "1px solid rgba(48, 156, 84, 1)"
                          : "1px solid rgba(48, 156, 84, 0.25)",
                      },
                      ":nth-child(2)": {
                        color: "var(--themeColor, rgba(255, 122, 0, 1))",
                        borderBottom: isSelected
                          ? "1px solid rgba(255, 122, 0, 1)"
                          : "1px solid rgba(255, 122, 0, 0.25)",
                      },
                      ":last-child": {
                        color: "var(--themeColor, rgba(243, 58, 58, 1))",
                        borderBottom: isSelected
                          ? "1px solid rgba(243, 58, 58, 1)"
                          : "1px solid rgba(243, 58, 58, 0.25)",
                      },
                      cursor: isDisabled ? "not-allowed" : "default",
                      ":hover": {
                        cursor: "pointer",
                        ":first-child": {
                          color: "rgba(48, 156, 84, 0.70)",
                          borderBottom: "1px solid rgba(48, 156, 84, 0.5)",
                        },
                        ":nth-child(2)": {
                          color: "rgba(255, 122, 0, 0.7)",
                          borderBottom: "1px solid rgba(255, 122, 0, 0.5)",
                        },
                        ":last-child": {
                          color: "rgba(243, 58, 58, 0.7)",
                          borderBottom: "1px solid rgba(243, 58, 58, 0.5)",
                        },
                      },
                    };
                  },
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="4"
                viewBox="0 0 8 4"
                fill="none"
              >
                <path
                  d="M0 0L4 4L8 0H0Z"
                  fill={
                    selectedOption?.value === "completed"
                      ? "#309C54"
                      : selectedOption?.value === "inProgress"
                      ? "#FF7A00"
                      : "#F33A3A"
                  }
                />
              </svg>
            </>
          )}
        </div>
      </td>
      {isAdmin && (
        <td>
          {chat.method === "Текстове повідомлення" ? "Повідомлення" : "Телефон"}
        </td>
      )}
      {isAdmin && (
        <HtmlTooltip
          title={
            <>
              {!isLoading && user && (
                <div className={styles.tooltip}>
                  <div>
                    <span>ПІ</span>
                    <h5>
                      {user.firstName} {user.lastName}
                    </h5>
                  </div>
                  <div>
                    <span>Телефон</span>
                    <h5>{user.phoneNumber}</h5>
                  </div>
                  <div>
                    <span>Статус</span>
                    <h5>{user.vulnerableGroup}</h5>
                  </div>
                  <div>
                    <span>Населений пункт</span>
                    <h5>{user.locality}</h5>
                  </div>
                </div>
              )}
              {isLoading && <div>Loading...</div>}
            </>
          }
        >
          <td
            className={styles.table__userID}
            onMouseEnter={() => showInfo(chat.receiver)}
          >
            ID#{chat.receiver}
          </td>
        </HtmlTooltip>
      )}
      <td>
        <div>
          {(isAdmin || chat.status === "completed") && (
            <Button type="button" style={{ padding: 0, borderRadius: "50%" }}>
              <Link href={"/dashboard/messages/" + chat.id}>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M2.62504 9C1.84587 9 1.20837 8.3625 1.20837 7.58333V4.04167C1.20837 3.2625 1.84587 2.625 2.62504 2.625H8.29171C9.07087 2.625 9.70837 3.2625 9.70837 4.04167V7.58333C9.70837 8.3625 9.07087 9 8.29171 9H6.87504V11.125L4.75004 9H2.62504ZM15.375 13.25C16.1542 13.25 16.7917 12.6125 16.7917 11.8333V8.29167C16.7917 7.5125 16.1542 6.875 15.375 6.875H11.125V7.58333C11.125 9.14167 9.85004 10.4167 8.29171 10.4167V11.8333C8.29171 12.6125 8.92921 13.25 9.70837 13.25H11.125V15.375L13.25 13.25H15.375Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </Link>
            </Button>
          )}
          <Button
            type="button"
            style={{ padding: 0, borderRadius: "50%" }}
            onClick={() => {
              setActiveIndex(chat.id);
              setView(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M13.3167 2.83333H10.8375L10.1292 2.125H6.58753L5.87919 2.83333H3.40002V4.25H13.3167M4.10836 13.4583C4.10836 13.8341 4.25761 14.1944 4.52329 14.4601C4.78897 14.7257 5.1493 14.875 5.52502 14.875H11.1917C11.5674 14.875 11.9278 14.7257 12.1934 14.4601C12.4591 14.1944 12.6084 13.8341 12.6084 13.4583V4.95833H4.10836V13.4583Z"
                fill="white"
              />
            </svg>
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ChatCard;
