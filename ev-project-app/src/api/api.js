import axios from "axios";

const API = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URL + "/api", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default API;
