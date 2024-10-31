/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const BASE_URL = `${
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_BASE_URL
    : "http://localhost:4000"
}/api/v1`;

// axios instance to access non-protected resources (login, register, logout, refresh)
export default axios.create({
  baseURL: BASE_URL,
});

// axios instance to access protected resources
export const axiosProtected = axios.create({
  baseURL: BASE_URL,
});
