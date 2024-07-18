import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./GroupModal.module.scss";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Field from "../Field/Field";
import Button from "../Button/Button";
import Modal from "react-modal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS, DATA_ENDPOINTS } from "@/constants/endpoints";
import { useChat } from "@/context/ChatContext";
import { Field as FieldType } from "@/components/dashboard/layout/layout";
import classNames from "classnames";
import ReactSelect, { SingleValue } from "react-select";
import CustomOptionStatus from "../Inputs/Status/components/CustomOption/CustomOption";
import {
  _,
  stylesSelect as localityStyles,
} from "../Inputs/Locality/variants/Base/Base";
import { stylesSelect as statusStyles } from "../Inputs/Status/variants/Base/Base";
import Plus from "@/assets/plus.svg";
import { toast } from "react-toastify";
import axios from "axios";
import Close from "@/assets/close.svg";
import CustomOptionLocality from "@/components/authentication/sign-up/Locality/components/CustomOption/CustomOption";
import { convertToMB } from "@/pages/dashboard/messages/[id]";
import { truncateMiddleOfLongFileNames } from "../MessageBox/MessageBox";
import Loader from "../Loader/Loader";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  modalIsOpen: boolean;
};

export type Inputs = {
  title: string;
  description: string;
  status: string[];
  locality: string[];
  file: File[];
};

interface CustomFile {
  file: File;
  isAchievedLimit: boolean;
}

const GroupModal = ({ setIsOpen, handleClose, modalIsOpen }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localityOptions, setLocalityOptions] = useState(_);
  const [statusOptions, setStatusOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [size, setSize] = useState(0);
  const [files, setFiles] = useState<CustomFile[] | null>(null);
  const [isLoading, setLoading] = useState(false);

  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  const { userId } = useAuth();
  const { onChangeGroups, groups } = useChat();

  const addStatus = useCallback(() => {
    setSelectedStatuses([...selectedStatuses, ""]);
  }, [selectedStatuses]);

  const handleSelectStatus = (value: string, index: number) => {
    if (!selectedLocalities.includes(value)) {
      const newSelectedStatuses = [...selectedStatuses];
      newSelectedStatuses[index] = value;
      setSelectedStatuses(newSelectedStatuses);
    }
  };

  const addLocality = useCallback(() => {
    setSelectedLocalities([...selectedLocalities, ""]);
  }, [selectedLocalities]);

  const handleSelectLocality = (value: string, index: number) => {
    if (!selectedLocalities.includes(value)) {
      const newSelectedLocalities = [...selectedLocalities];
      newSelectedLocalities[index] = value;
      setSelectedLocalities(newSelectedLocalities);
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${DATA_ENDPOINTS.LIST_STATUSES}/`
      )
      .then((response) => {
        setStatusOptions(response.data.statuses);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${DATA_ENDPOINTS.LIST_VILLAGES}/`
      )
      .then((response) => {
        setLocalityOptions(response.data.villages);
      })
      .catch((error) => {});
  }, []);

  function closeModal() {
    handleClose();
    setIsOpen(false);
    document.body.classList.remove("overflow-y-hidden");
  }

  const onSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData();
    userId && formData.append("id", userId.toString());
    formData.append("title", title);
    formData.append("description", description);
    formData.append("description", description);
    formData.append("statuses", JSON.stringify(selectedStatuses));
    formData.append("localities", JSON.stringify(selectedLocalities));

    files &&
      files.forEach((file) => {
        formData.append("files", file.file);
        formData.append("types", file.file.type);
      });

    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.GROUP_CREATE}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        const group = response.data;

        if (groups.length > 0) {
          onChangeGroups([...groups, group]);
        } else {
          onChangeGroups([group]);
        }
        closeModal();
      })
      .finally(() => {
        setLoading(false);
      });
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = event.target.files;
      handleFile(fileList);
    }
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    hiddenFileInput.current && hiddenFileInput.current.click();
  };

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

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className={styles.formModal}
    >
      <div className={styles.formModal__header}>
        <div>
          <h1>Надіслати групове повідомлення</h1>
        </div>
        <button type="button" onClick={closeModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6.75781 17.243L12.0008 12L17.2438 17.243M17.2438 6.75702L11.9998 12L6.75781 6.75702"
              stroke="#5A5959"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <form className={styles.formModal__form} onSubmit={onSubmit}>
        <div>
          <div className={styles.formModal__input}>
            <div>
              <h1>Тема листа</h1>
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formModal__textarea}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ваш лист..."
              maxLength={400}
            />
            <span>*Максимальний обсяг 400 символів</span>
          </div>
          <div className={styles.formModal__flex}>
            <div className={styles.formModal__select}>
              <div className={styles.formModal__status}>
                <h1>Статус</h1>
                <p>
                  Оберіть статус користувачів, яким хочете відправити
                  повідомлення
                </p>
              </div>
              <div className={styles.formModal__select_status}>
                {selectedStatuses.map((selectedStatus, index) => {
                  return (
                    <div className={styles.formModal__select_locality_wrapper}>
                      <ReactSelect
                        value={statusOptions?.find(
                          (c) => c.value === selectedStatus
                        )}
                        onChange={(val) =>
                          handleSelectStatus(val ? val.value : "", index)
                        }
                        placeholder="Ваш статус"
                        components={{ Option: CustomOptionStatus }}
                        options={statusOptions.filter(
                          (status) => !selectedStatus.includes(status.value)
                        )}
                        className={styles.select}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 7,
                          colors: {
                            ...theme.colors,
                            primary: "transparent",
                          },
                        })}
                        // styles={{
                        //   ...statusStyles,
                        //   ...{
                        //     container: (style) => ({
                        //       ...style,
                        //       width: "fit-content",
                        //     }),
                        //     valueContainer: (styles) => ({
                        //       ...styles,
                        //       padding: "0 35px 0 20px",
                        //       width: "100%",
                        //     }),
                        //   },
                        // }}
                      />
                      {selectedStatus && (
                        <button
                          onClick={() =>
                            setSelectedStatuses([
                              ...selectedStatuses.filter(
                                (status) => status !== selectedStatus
                              ),
                            ])
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                          >
                            <path
                              d="M10.5 1.50714L9.49286 0.5L5.5 4.49286L1.50714 0.5L0.5 1.50714L4.49286 5.5L0.5 9.49286L1.50714 10.5L5.5 6.50714L9.49286 10.5L10.5 9.49286L6.50714 5.5L10.5 1.50714Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
                <Button
                  type="button"
                  classNames={styles.formModal__plusButton}
                  onClick={addStatus}
                >
                  <Plus />
                  <span>Додати статус</span>
                </Button>
              </div>
            </div>
            <div className={styles.formModal__select}>
              <div className={styles.formModal__locality}>
                <h1>Населений пункт</h1>
                <p>
                  Оберіть населений пункт користувачів, яким хочете відправити
                  повідомлення
                </p>
              </div>
              <div className={styles.formModal__select_locality}>
                {selectedLocalities.map((selectedLocality, index) => {
                  return (
                    <div className={styles.formModal__select_locality_wrapper}>
                      <ReactSelect
                        value={localityOptions?.find(
                          (c) => c.value === selectedLocality
                        )}
                        onChange={(val) =>
                          handleSelectLocality(val ? val.value : "", index)
                        }
                        placeholder="Ваш населений пункт"
                        components={{ Option: CustomOptionLocality }}
                        options={localityOptions.filter(
                          (locality) =>
                            !selectedLocalities.includes(locality.value)
                        )}
                        className={styles.select}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 7,
                          colors: {
                            ...theme.colors,
                            primary: "transparent",
                          },
                        })}
                        // styles={{
                        //   ...localityStyles,
                        //   ...{
                        //     control: (styles) => ({
                        //       ...styles,
                        //       color: "var(--themeColor)",
                        //       fontFamily: "Inter",
                        //       fontSize: "16px",
                        //       lineHeight: "normal",
                        //       textAlign: "left",
                        //     }),
                        //   },
                        // }}
                      />
                      {selectedLocality && (
                        <button
                          onClick={() =>
                            setSelectedLocalities([
                              ...selectedLocalities.filter(
                                (locality) => locality !== selectedLocality
                              ),
                            ])
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                            fill="none"
                          >
                            <path
                              d="M10.5 1.50714L9.49286 0.5L5.5 4.49286L1.50714 0.5L0.5 1.50714L4.49286 5.5L0.5 9.49286L1.50714 10.5L5.5 6.50714L9.49286 10.5L10.5 9.49286L6.50714 5.5L10.5 1.50714Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
                <Button
                  type="button"
                  classNames={styles.formModal__plusButton}
                  onClick={addLocality}
                >
                  <Plus />
                  <span>Додати населений пункт</span>
                </Button>
              </div>
            </div>
            <div className={styles.formModal__attach}>
              <div className={styles.formModal__attach_headline}>
                <h1>Вкласти файли</h1>
              </div>
              <div className={styles.formModal__attach_input}>
                <Button
                  type="button"
                  classNames={styles.formModal__attach_file}
                  style={{ borderRadius: "5px", padding: 0 }}
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
                <span>*Максимальний обсяг файлів 5 Мб</span>
              </div>
            </div>
          </div>
        </div>
        <>
          {!isLoading && (
            <Button
              type="submit"
              style={{ borderRadius: 26 }}
              disabled={
                !title ||
                !description ||
                isEmpty(selectedLocalities) ||
                isEmpty(selectedStatuses) ||
                selectedLocalities.includes("") ||
                selectedStatuses.includes("") ||
                size >= 5
              }
            >
              Надіслати лист
            </Button>
          )}
          {isLoading && <Loader />}
        </>
      </form>
    </Modal>
  );
};

export default GroupModal;
