import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// keep 401 redirect ONLY for auth
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
