// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "https://friendappserver.onrender.com/api",
  timeout: 10000,
});

export const getPeople = () => API.get("/people");
export const getPersonByName = (name) => API.get(`/people/name/${encodeURIComponent(name)}`);

export async function signup(username, password) {
  const res = await API.post("/signup", { username, password });
  return res.data;
}

export async function login(username, password) {
  const res = await API.post("/login", { username, password });
  if (res.data.token) {
    localStorage.setItem("jwtToken", res.data.token);
  }

  return res.data;
}

export async function status() {
  const res = await API.get("/status");
  return res.data;
}

// --- Admin APIs (require JWT) ---
export async function getAllPeople(token) {
  const res = await API.get("/people", {
    headers: { Authorization: token },
  });
  return res.data;
}

export async function addPerson(personData, token) {
  const res = await API.post("/people", personData, {
    headers: { Authorization: token },
  });
  return res.data;
}

export async function updatePerson(id, personData, token) {
  const res = await API.put(`/people/${id}`, personData, {
    headers: { Authorization: token },
  });
  return res.data;
}

export async function deletePerson(id, token) {
  const res = await API.delete(`/people/${id}`, {
    headers: { Authorization: token },
  });
  return res.data;
}

export default API;
