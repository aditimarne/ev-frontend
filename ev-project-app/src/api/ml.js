import axios from "axios";

const MLAPI = axios.create({
  baseURL: import.meta.env.VITE_ML_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default MLAPI;
