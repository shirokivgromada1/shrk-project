import styles from "./Modal.module.scss";
import CloseIcon from "./../../../assets/close.svg";
import { useEffect } from "react";
import classNames from "classnames";

type Props = {
  onClose: () => void;
  isView: boolean;
  children?: React.ReactNode;
  closeMarkup?: React.ReactNode;
};

const Modal = ({ onClose, isView, children, closeMarkup }: Props) => {
  useEffect(() => {
    if (isView) document.body.classList.add("overflow-y-hidden");
    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [isView]);

  if (!isView) return;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={classNames(styles.wrapper, {
          [styles.defaultWrapper]: !closeMarkup,
          [styles.customWrapper]: closeMarkup,
        })}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className={styles.modal__exit}>
          <button
            type="button"
            className={styles.modal__exit_button}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modal__message}>{children}</div>
        <div
          className={!closeMarkup ? styles.modal__close : styles.modal__custom}
        >
          {!closeMarkup && (
            <button
              type="button"
              className={styles.modal__close_button}
              onClick={onClose}
            >
              Продовжити
            </button>
          )}
          {closeMarkup && closeMarkup}
        </div>
      </div>
    </div>
  );
};

export default Modal;
