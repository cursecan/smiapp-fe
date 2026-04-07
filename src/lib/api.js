import axios from "axios";

import { useUserToken } from "../token/userToken"
import { refreshApi } from "./refresh";
import { ApiError } from "./apiError";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
})


let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


api.interceptors.request.use(
  (config) => {
    const token = useUserToken.getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message;

    const apiError = new ApiError(message, status, data);
    

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
          
            return new Promise((resolve, reject) => {
            failedQueue.push({ 
                resolve: () => resolve(api(originalRequest)),
                reject: (err) => reject(err),
                })
            })
        }

        originalRequest._retry = true;
        isRefreshing = true;
        

        try {
            await refreshApi()
            processQueue(null);

            return api(originalRequest);
        } catch (err) {
            processQueue(err, null);
            useUserToken.clearAccessToken();
            
            return Promise.reject(
                new ApiError("Failed to refresh token", 401)
            );
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(apiError);
  }
);