import axios from "axios";

const stage = process.env.NODE_ENV === "production";
const baseURL = stage
  ? "https://rocketstore-felipe-rocha.netlify.app/.netlify/functions"
  : "http://localhost:3333";

export const api = axios.create({
  baseURL,
});
