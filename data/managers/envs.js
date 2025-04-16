import { SERVER_URL } from "../../constants.js";
import { getClient } from "../client.js";
import { reqModal } from "./auth.js";

const serverURL = SERVER_URL || "http://localhost:8000";
const baseURL = `${serverURL}/envs`;

export const createEnv = (values) => {
  return reqModal(() => getClient(baseURL).post("/create", values));
};

export const getAllEnvs = () => {
  return reqModal(() => getClient(baseURL).get("/all"));
};

export const pullEnv = ({ id, password, oneTimePassword }) => {
  return reqModal(() =>
    getClient(baseURL).post(`/${id}/pull`, { password, oneTimePassword })
  );
};

export const updateEnv = ({ id, values }) => {
  return reqModal(() => getClient(baseURL).put(`/${id}/push`, values));
};

export const deleteEnv = ({ id }) => {
  return reqModal(() => getClient(baseURL).delete(`/${id}/delete`));
};
