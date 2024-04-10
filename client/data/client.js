import axios from "axios";
import { getAuthToken } from "../config/index.js";
import { ORIGIN } from "../constants.js";

export const getClient = (baseURL) => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": getAuthToken(),
    },
    origin: ORIGIN,
    withCredentials: true,
  });
};
