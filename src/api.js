// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "https://friendappserver-production.up.railway.app/api",
  timeout: 10000,
});

export const getPeople = () => API.get("/people");
export const getPersonByName = (name) => API.get(`/people/name/${encodeURIComponent(name)}`);

export default API;
