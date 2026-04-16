import axios from "axios";

const customAPI = axios.create({
  baseURL: "https://lyly-gifts-backend.onrender.com/api",
});
customAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default customAPI;
