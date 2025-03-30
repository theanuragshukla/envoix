import { SERVER_URL } from "../../constants.js";
import { getClient } from "../client.js";

const serverURL = SERVER_URL || "http://localhost:8000";
const baseURL = `${serverURL}/auth`;

export const reqModal = async (func) => {
  try {
    const { status, data } = await func();
    if (status.toString().startsWith("2")) {
      return data;
    } else {
      return {
        status: false,
        code: status,
        msg: `request failed with code ${status}`,
        data,
      };
    }
  } catch (e) {
    const { status, data } = e.response;
    return {
      status: false,
      code: status || 500,
      msg: e.message || "request failed",
      data,
    };
  }
};
export const signup = (values) => {
  return reqModal(() => getClient(baseURL).post("/signup", values));
};

export const login = (values) => {
  return reqModal(() => getClient(baseURL).post("/login", values));
};
