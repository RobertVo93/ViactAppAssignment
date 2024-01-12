import axios from "axios";
import Cookies from "js-cookie";

import { config as appConfig } from "../config/config";

const axiosInstance = axios.create({
  baseURL: appConfig.API_URI
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = Cookies.get(appConfig.COOKIES.ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
