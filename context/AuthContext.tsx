import { createContext, useContext, useState } from "react";

const IDLETIME = 300; // 5 minutes (300 seconds) idle timeout

type typeAuthContextDefaultValues = {
  userId: number | null;
  isAuth: boolean | null;
  isLoading: boolean;
  iat: number;
  idleTimeout: number;
  openViberModal: boolean;
  onChangeUserId: (userId: number | null) => void;
  onChangeAuth: (isAuth: boolean) => void;
  onChangeLoading: (isLoading: boolean) => void;
  onChangeIat: (iat: number) => void;
  onChangeViberModal: (open: boolean) => void;
  logOut: () => void;
};

const authContextDefaultValues: typeAuthContextDefaultValues = {
  userId: null,
  onChangeUserId: () => {},
  isAuth: null,
  onChangeAuth: () => {},
  isLoading: true,
  onChangeLoading: () => {},
  idleTimeout: IDLETIME,
  logOut: () => {},
  iat: 0,
  onChangeIat: () => {},
  openViberModal: false,
  onChangeViberModal: () => {},
};

const AuthContext = createContext(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuth, setAuth] = useState<boolean | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [iat, setIat] = useState(0);
  const idleTimeout = IDLETIME;
  const [openViberModal, setOpenModal] = useState(false);

  const onChangeUserId = (userId: number | null) => {
    setUserId(userId);
  };

  const onChangeAuth = (isAuth: boolean) => {
    setAuth(isAuth);
  };

  const onChangeLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const onChangeIat = (iat: number) => {
    setIat(iat);
  };

  const logOut = () => {
    setUserId(null);
    setAuth(false);
  };

  const onChangeViberModal = (open: boolean) => {
    setOpenModal(open);
  };

  const value = {
    userId,
    onChangeUserId,
    isAuth,
    onChangeAuth,
    isLoading,
    onChangeLoading,
    idleTimeout,
    logOut,
    onChangeIat,
    iat,
    openViberModal,
    onChangeViberModal,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
