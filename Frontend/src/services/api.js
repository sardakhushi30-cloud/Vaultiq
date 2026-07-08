//This file contains the API service to connect frontend and backend together.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;