import { AUTH_ENDPOINTS } from "@/constants/endpoints";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_APP_BASE_URL;

const axiosInstance = axios.create({
  timeout: 5000,
  headers: {
    Authorization:
      typeof window !== "undefined"
        ? "JWT " + localStorage.getItem("access_token")
        : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops early
    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + `${AUTH_ENDPOINTS.SIGN_IN}/refresh/`
    ) {
      window.location.href = "/sign-in";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post(
              `${process.env.NEXT_PUBLIC_APP_BASE_URL}${AUTH_ENDPOINTS.SIGN_IN}/refresh/`,
              { refresh: refreshToken }
            )
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {});
        } else {
          window.location.href = "/sign-in";
        }
      } else {
        window.location.href = "/sign-in";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
