import axios from "axios";
import constant from "/constant"; // Make sure this path is correct

const axiosInstance = axios.create({
  baseURL: constant.apiUrl,
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/"; // Change to "/login" if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;