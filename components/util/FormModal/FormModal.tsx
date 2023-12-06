import {
  Dispatch,
  HTMLInputTypeAttribute,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./FormModal.module.scss";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Field from "../Field/Field";
import Button from "../Button/Button";
import Modal from "react-modal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import axiosInstance from "@/interceptors/axios";
import { CHAT_ENDPOINTS } from "@/constants/endpoints";
import { Chat, useChat } from "@/context/ChatContext";
import { Field as FieldType } from "@/components/dashboard/layout/layout";
import classNames from "classnames";
import Loader from "../Loader/Loader";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  modalIsOpen: boolean;
  stateForm?: {
    headline: string;
    fields: FieldType[];
  };
};

export type Inputs = {
  title: string;
  text: string;
  method: "phone" | "text";
  notifyInViber?: "Viber" | "noViber";
  institution?: string;
  frequency_disturbance?: string;
  settlement?: string;
  helpType?: "social" | "humanitarian" | "paperwork" | "consultation";
};

type SchemaType = {
  title: yup.StringSchema<string, yup.AnyObject, undefined, "">;
  text: yup.StringSchema<string, yup.AnyObject, undefined, "">;
  method: yup.StringSchema<"text" | "phone", yup.AnyObject, undefined, "">;
  notifyInViber?: any;
};

const FormModal = ({
  setIsOpen,
  handleClose,
  modalIsOpen,
  stateForm,
}: Props) => {
  const { userId } = useAuth();
  const { phoneNumber, hasViber, onChangeViber } = useUser();
  const { onChangeChats, chats } = useChat();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  let SchemaObject: SchemaType = {
    title: yup.string().required("Тема є обов'язковим"),
    text: yup
      .string()
      .required("Повідомлення є обов'язковим")
      .max(400, "Повідомлення має містити максимум 400 символів"),
    method: yup
      .string<"phone" | "text">()
      .required("Метод зв'язку є обов'язковим")
      .oneOf(["phone", "text"]),
  };

  if (hasViber) {
    SchemaObject.notifyInViber = yup
      .string<"Viber" | "noViber">()
      .oneOf(["Viber", "noViber"]);
  } else {
    SchemaObject.notifyInViber = yup
      .string<"Viber" | "noViber">()
      .required("Viber є обов'язковим")
      .oneOf(["Viber", "noViber"]);
  }

  if (stateForm) {
    SchemaObject = Object.assign(
      SchemaObject,
      Object.fromEntries(
        stateForm.fields.map((field) => [field.registerLabel, field.schema])
      )
    );
  }

  const schema = yup.object().shape(SchemaObject).required();

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
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  function closeModal() {
    handleClose();
    setIsOpen(false);
    document.body.classList.remove("overflow-y-hidden");
    reset();
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);

    if (!data.notifyInViber) data.notifyInViber = "Viber";

    axiosInstance
      .post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}${CHAT_ENDPOINTS.CHAT_CREATE}/`,
        data
      )
      .then((response) => {
        const chat = response.data;
        if (chats) onChangeChats([chat, ...chats]);
        else onChangeChats([chat]);
        closeModal();
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notify_viber_id/${userId}/`,
      "echo-protocol"
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!!data.viber_id && data.viber_id !== "None") {
        onChangeViber(!!data.viber_id);
      } else {
        onChangeViber(false);
      }
    };

    return () => {
      socket.close();
    };
  }, [router.asPath]);

  useEffect(() => {
    if (!hasViber) {
      if (watch("notifyInViber") === "Viber") {
        trigger("notifyInViber").then(() =>
          setError("notifyInViber", { message: "Користувач не підписався" })
        );
      } else {
        trigger("notifyInViber").then(() => clearErrors("notifyInViber"));
      }
    } else trigger("notifyInViber").then(() => clearErrors("notifyInViber"));
  }, [watch("notifyInViber"), hasViber]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className={styles.formModal}
    >
      <div className={styles.formModal__header}>
        <div>
          <h1>{stateForm?.headline || "Звернутися до нас"}</h1>
          <p>Вам потрібно написати листа на нашу пошту </p>
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
      <form
        className={styles.formModal__form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className={styles.formModal__input}>
            <Field
              type="text"
              label="Тема листа"
              id="title"
              register={register}
              registerLabel={"title"}
            />
          </div>
          <div className={styles.formModal__textarea}>
            <textarea
              placeholder="Ваш лист..."
              {...register("text")}
              maxLength={400}
            />
            <span>*Максимальний обсяг 400 символів</span>
          </div>
        </div>
        {stateForm && (
          <div className={styles.moreInfo}>
            <div className={styles.formModal__contact}>
              {stateForm?.fields.map((field, index) => (
                <>
                  {field.type === "text" && (
                    <div
                      className={classNames(
                        styles.formModal__contact,
                        styles.formModal__customField
                      )}
                    >
                      <div className={styles.formModal__contact_title}>
                        <span>{field.label}</span>
                        <span>
                          <b>*</b>обов'язкове питання
                        </span>
                      </div>
                      <div
                        key={"field" + index}
                        className={styles.formModal__input}
                        style={{ marginBottom: "0" }}
                      >
                        <Field
                          type={field.type}
                          id={field.id}
                          register={register}
                          registerLabel={field.registerLabel}
                        />
                      </div>
                    </div>
                  )}
                  {field.type === "radio" && (
                    <div
                      className={styles.formModal__contact}
                      style={{ gap: 15 }}
                    >
                      <div className={styles.formModal__contact_title}>
                        <span>{field.label}</span>
                        <span>
                          <b>*</b>обов'язкове питання
                        </span>
                      </div>
                      <div className={styles.formModal__contact_options}>
                        {field.listOptions?.map((option) => (
                          <Field
                            type="radio"
                            id={option.value}
                            value={option.value}
                            label={option.label}
                            register={register}
                            registerLabel={field.registerLabel}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        )}
        <div className={styles.formModal__contact}>
          <div className={styles.formModal__contact_title}>
            <span>Оберіть спосіб зворотного зв'язку</span>
            <span>
              <b>*</b>обов'язкове питання
            </span>
          </div>
          <div className={styles.formModal__contact_options}>
            <Field
              type="radio"
              id="phone"
              value={"phone"}
              label={`Номер телефону (${phoneNumber}) `}
              register={register}
              registerLabel={"method"}
            />
            <Field
              value={"text"}
              type="radio"
              id="text"
              label="Текстове повідомлення"
              register={register}
              registerLabel={"method"}
            />
          </div>
        </div>
        {!hasViber && (
          <div className={styles.formModal__contact}>
            <div className={styles.formModal__contact_title}>
              <span>Підключити Viber-помічник?</span>
              <span>
                <b>*</b>обов'язкове питання
              </span>
            </div>
            <div className={styles.formModal__contact_options}>
              <Field
                value={"Viber"}
                type="radio"
                id="Viber"
                label={`Так, для мене це буде зручно`}
                register={register}
                registerLabel={"notifyInViber"}
              />
              <Field
                value={"noViber"}
                type="radio"
                id="noViber"
                label="Не користуюсь Viber"
                register={register}
                registerLabel={"notifyInViber"}
              />
            </div>
            {watch("notifyInViber") === "Viber" && (
              <div className={styles.formModal__Viber_status}>
                {!hasViber && (
                  <Button
                    type="button"
                    style={{ borderRadius: 26 }}
                    onClick={() =>
                      window.open(
                        `viber://pa?chatURI=shyrokebot&context=${userId}`,
                        "_blank"
                      )
                    }
                  >
                    Додати помічник
                  </Button>
                )}
                {hasViber && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M5 10.8335L8.5 13.8335L15 5.8335"
                        stroke="white"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Viber-помічник успішно підключено</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        <>
          {isLoading && <Loader />}
          {!isLoading && (
            <Button
              type="submit"
              style={{ borderRadius: 26 }}
              disabled={!isDirty || !isValid || !isEmpty(errors)}
              toolTip={
                errors.notifyInViber?.message ||
                errors.method?.message ||
                errors.text?.message ||
                errors.title?.message
              }
            >
              Надіслати лист
            </Button>
          )}
        </>
      </form>
    </Modal>
  );
};

export default FormModal;
