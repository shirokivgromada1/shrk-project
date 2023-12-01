import React, { createContext, useContext, useEffect, useState } from "react";
import styles from "./LangSwitcher.module.scss";

interface LangContextType {
  lang: string;
  changeLanguage: (language: string) => void;
}

const defaultLang: string = "ua";

export const LangContext = createContext<LangContextType>({
  lang: defaultLang,
  changeLanguage: () => {},
});

export const LangSwitcherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<string>(defaultLang);

  const changeLanguage = (language: string) => {
    setLang(language);
    localStorage.setItem("language", language);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      if (storedLanguage === "ua") setLang("ua");
      if (storedLanguage === "en") setLang("en");
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LangContext.Provider>
  );
};
const LangSwitcher: React.FC = () => {
  const { lang, changeLanguage } = useContext(LangContext)!;
  const [isUA, setIsUA] = useState("ua");
  const handleLanguageChange = () => {
    setIsUA((prev) => (prev === "ua" ? "en" : "ua"));
  };
  useEffect(() => {
    changeLanguage(isUA);
  }, [isUA, changeLanguage]);
  return (
    <div className={styles.langSwitcher} onClick={() => handleLanguageChange()}>
      {lang}
    </div>
  );
};

export default LangSwitcher;
