import { SERVER_URL } from "../../constants.js";
import { getClient } from "../client.js";
import { reqModal } from "./auth.js";

const serverURL = SERVER_URL || "http://localhost:8000";
const baseURL = `${serverURL}/envs`;

export const addUser = ({id, values}) => {
  return reqModal(() => getClient(baseURL).post(`/${id}/permissions/add_user`, values));
};

export const updateUser = ({id, values}) => {
  return reqModal(() => getClient(baseURL).put(`/${id}/permissions/update_user`, values));
};

export const removeUser = ({id, values}) => {
  return reqModal(() => getClient(baseURL).delete(`/${id}/permissions/remove_user`, values));
};

export const allPermissions = ({id}) => {
  return reqModal(() => getClient(baseURL).get(`/${id}/permissions/all`));
};


