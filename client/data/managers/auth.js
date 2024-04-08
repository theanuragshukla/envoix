import { getClient } from "../client.js";

const serverURL = process.env.SERVER_URL || "http://localhost:8000";
const baseURL = `${serverURL}/auth`

export const reqModal = async (func) => {
  try {
    const { status, data } = await func();
    if (status === 200) {
      return data;
    } else {
      return {
        status: false,
        msg: `request failed with code ${status}`,
      };
    }
  } catch (e) {
    return {
      status: false,
      msg: "Something Unexpected happened",
    };
  }
};
export const signup = (values) => {
  return reqModal(() => getClient(baseURL).post("/signup", values));
};

export const login = (values) => {
  return reqModal(() => getClient(baseURL).post("/login", values));
};
