import axios, { AxiosRequestConfig } from "axios";
import { REACT_APP_SERVER_URL } from "../config";

const client = axios.create({ baseURL: REACT_APP_SERVER_URL });

export default async function api(options: AxiosRequestConfig) {
  const onSuccess = (response: any) => response;

  const onError = (error: any) => {
    console.log("Request Failed:", error.config);
    if (error.response) {
      // Request was made but server responded with something other than 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else {
      // Something else happened while setting up the request triggered the error
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error.response || error.message);
  };

  return client({ ...options, withCredentials: true })
    .then(onSuccess)
    .catch(onError);
}
