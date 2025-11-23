import axios from "axios";

<<<<<<< HEAD
// Toggle this manually for testing
const isDev = true;
=======
// Automatically detect environment using Vite
// true when running 'npm run dev', false when running 'npm run build'
const isDev = import.meta.env.DEV;
>>>>>>> 78fb5be (chore: config files for naver cloud deployment)

// backend port
const instance = axios.create({
  baseURL: isDev
    ? "http://localhost:3001" // Development
    : "http://49.50.137.153", // Production (Naver Cloud)
  // Previous Render link for reference: "https://naver-lens.onrender.com"
});

// instance.defaults.withCredentials = true;

export default instance;