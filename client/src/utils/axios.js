import axios from "axios";

// Use the VITE_ prefixed environment variable
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // Access the environment variable
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Authorization header will be added in components directly where needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;