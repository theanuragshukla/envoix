import { getClient } from "../client.js";
import { reqModal } from "./auth.js";

const serverURL = process.env.SERVER_URL || "http://localhost:8000";
const baseURL = `${serverURL}/envs`;

export const createEnv = (values) => {
  return reqModal(() => getClient(baseURL).post("/add", values));
};

export const getAllEnvs = () => {
  return reqModal(() => getClient(baseURL).get("/all"));
};

export const pullEnv = ({id}) => {
  return reqModal(() => getClient(baseURL).get(`/${id}`));
};

export const updateEnv = ({id, values}) => {
  return reqModal(() => getClient(baseURL).post(`/${id}/update`, values));
};
