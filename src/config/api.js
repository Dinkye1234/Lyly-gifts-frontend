import axios from "axios";

const API = axios.create({
  baseURL: "https://lyly-gifts-backend.onrender.com/api", // Зөвхөн суурь хаягийг нь бичнэ
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Authorization болон Bearer гэдгийг зөв бичих (үсгийн алдааг засав)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Таны нэвтрэх эрхийн хугацаа дууссан байна");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
