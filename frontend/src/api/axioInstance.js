import axios from "axios";

const axiosInstance = axios.create({ 
   baseURL: "https://parking-system-2-kv3h.onrender.com/api",
  //  baseURL: "http://localhost:4000/api"
});

// JWT automatically attach hoga
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;