import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/" : "194.87.26.15:8080",
});
