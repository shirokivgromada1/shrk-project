import { Dispatch, FC, useEffect, useRef, useState } from "react";
import styles from "./EyeModal.module.scss";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
// import { useTheme } from "@/context/ThemeContext"
import Modal from "react-modal";
import useBetterMediaQuery from "@/hooks/useBetterMediaQuery";

Modal.setAppElement("#__next");

type Props = {
  setEyeView: Dispatch<boolean>;
  eyeView: boolean;
};

export const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0, // this will set a delay before the children start animating
      staggerChildren: 0.01, // this will set the time inbetween children animation
    },
  },
};

export const opacityVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const EyeModal: FC<Props> = ({ eyeView, setEyeView }) => {
  const fontSizes = [{ 55: 1.5 }, { 40: 1.25 }, { 22: 0.9 }, { 15: 0.75 }];
  const colors = [
    "#000",
    "#123293",
    "#0000F5",
    "#67C9FA",
    "#75FB4C",
    "#FFFF54",
    "#ED702D",
    "#EA3323",
    "#FFF",
  ];

  const [mix, setMix] = useState<{ bgColor: string; color: string }[] | null>(
    null
  );

  const tabletMatch = useBetterMediaQuery("(max-width: 1200px)");

  const mixColors = (colors: string[]) => {
    const mixArray = [];
    for (const color of colors) {
      for (const bg of colors) {
        if (bg !== color) mixArray.push({ bgColor: bg, color: color });
      }
    }
    setMix(mixArray);
  };

  useEffect(() => {
    mixColors(colors);
  }, []);

  const resetTheme = () => {
    document.documentElement.style.setProperty("--themeBgColor", "unset");
    document.documentElement.style.setProperty("--themeColor", "unset");
    document.documentElement.style.setProperty("--themeFontSize", "1");
  };

  const onChangeTheme = (bgColor: string, color: string) => {
    document.documentElement.style.setProperty("--themeBgColor", bgColor);
    document.documentElement.style.setProperty("--themeColor", color);
  };

  const onChangeFontSize = (size: number) => {
    document.documentElement.style.setProperty(
      "--themeFontSize",
      size.toString()
    );
  };

  useEffect(() => {
    if (tabletMatch) {
      resetTheme();
    }
  }, [tabletMatch]);

  return (
    <Modal
      isOpen={eyeView}
      onRequestClose={() => setEyeView(false)}
      className={styles.modal}
      closeTimeoutMS={200}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.modal__inner}
      >
        <motion.div>
          <div className={styles.modal_fontSize}>
            {fontSizes.map((size, i) => (
              <button
                type="button"
                key={"size" + i}
                onClick={() => onChangeFontSize(Object.values(size)[0])}
              >
                <span style={{ fontSize: `${Object.keys(size)[0]}px` }}>A</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={resetTheme}>
            По замовчуванні
          </button>
        </motion.div>
        {mix && (
          <motion.div
            className={styles.aboutGreeting}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {mix.map((m, i) => (
              <motion.button
                variants={opacityVariants}
                key={"mix" + i}
                style={{ backgroundColor: m.bgColor }}
                onClick={() => onChangeTheme(m.bgColor, m.color)}
              >
                <span style={{ fontSize: 20, color: m.color }}>A</span>
              </motion.button>
            ))}
          </motion.div>
        )}
        <IoMdClose onClick={() => setEyeView(false)} />
      </motion.div>
    </Modal>
  );
};

export default EyeModal;
