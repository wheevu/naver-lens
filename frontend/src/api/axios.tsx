import axios from "axios";

// Toggle this manually for testing
const isDev = true;

// backend port
const instance = axios.create({
  baseURL: isDev
    ? "http://localhost:3001" // Development
    : "http://49.50.137.153" //"https://naver-lens.onrender.com", // Production
});

// instance.defaults.withCredentials = true;

export default instance;
