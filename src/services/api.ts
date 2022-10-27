import axios from "axios";

const stage = process.env.NODE_ENV === "production";
const netlifyRoute = stage ? "/.netlify/functions" : "";

export const api = axios.create({
  baseURL: `http://localhost:3333${netlifyRoute}`,
});
