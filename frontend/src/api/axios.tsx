import axios from "axios";

// Toggle this manually for testing
const isDev = false;

// backend port
const instance = axios.create({
  baseURL: isDev
    ? "http://localhost:3001" // Development
    : "https://naver-lens.onrender.com", // Production
});

// instance.defaults.withCredentials = true;

export default instance;
