import styles from "./Modal.module.scss";
import PropTypes from "prop-types";
import Link from "next/link";
import { GlobalHeaderNavLinks, Maybe } from "@/tina/__generated__/types";
import { useContext } from "react";
import { LangContext } from "@/helpers/LangSwitcher/LangSwitcher";

const Modal = ({ links }: { links: Maybe<GlobalHeaderNavLinks>[] }) => {
  const { lang } = useContext(LangContext);
  return (
    <div className={styles.modal}>
      {links.map(
        (link, index) =>
          link &&
          link.href &&
          link.label && (
            <Link href={`/${link.href}`} key={link.href + index}>
              <a>{lang === "ua" ? link.label : link.labelEng}</a>
            </Link>
          )
      )}
    </div>
  );
};

export default Modal;
Modal.propTypes = {
  links: PropTypes.array,
};
