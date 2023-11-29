import "./../styles.css";
import "./../datepicker.scss";
import { AppProps } from "next/app";
import { FilterProvider } from "@/context/FilterContext";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../interceptors/axios";
import { UserProvider } from "@/context/UserContext";
import { ChatProvider } from "@/context/ChatContext";

const App = ({ Component, pageProps }: AppProps<any>) => {
  return (
    <ChatProvider>
      <UserProvider>
        <AuthProvider>
          <FilterProvider>
            <Component {...pageProps} />
            <ToastContainer />
            <Script src="//cdn.jsdelivr.net/npm/share-buttons/dist/share-buttons.js" />
          </FilterProvider>
        </AuthProvider>
      </UserProvider>
    </ChatProvider>
  );
};

export default App;
