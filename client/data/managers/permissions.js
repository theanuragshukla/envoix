import { getClient } from "../client.js";
import { reqModal } from "./auth.js";

const serverURL = process.env.SERVER_URL || "http://localhost:8000";
const baseURL = `${serverURL}/envs`;

export const addUser = ({id, values}) => {
  return reqModal(() => getClient(baseURL).post(`/${id}/permissions/add`, values));
};

export const updateUser = ({id, values}) => {
  return reqModal(() => getClient(baseURL).post(`/${id}/permissions/update`, values));
};

export const removeUser = ({id, values}) => {
  return reqModal(() => getClient(baseURL).post(`/${id}/permissions/remove`, values));
};

export const allPermissions = ({id}) => {
  return reqModal(() => getClient(baseURL).get(`/${id}/permissions`));
};


