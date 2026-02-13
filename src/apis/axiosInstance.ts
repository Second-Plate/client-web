import axios from "axios";

export const axiosInstance = axios.create({
  //   baseURL: import.meta.env.VITE_SERVER_URL,
  baseURL: "https://566cdee12be1.ngrok-free.app/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const token =
    //   sessionStorage.getItem("token") || localStorage.getItem("token");
    // if (token) {
    //   config.headers = config.headers || {};
    //   config.headers["Authorization"] = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NTcxNzE3OTIsImV4cCI6MTc1Nzc3NjU5Mn0.Iaxe2KOnip77oIdJofWpz16vZa3YjJcs_PK42VZqSmc`;
    // }
    config.headers = config.headers || {};
    config.headers[
      "Authorization"
    ] = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NTcxNzE3OTIsImV4cCI6MTc1Nzc3NjU5Mn0.Iaxe2KOnip77oIdJofWpz16vZa3YjJcs_PK42VZqSmc`;

    return config;
  },
  (error) => Promise.reject(error)
);
