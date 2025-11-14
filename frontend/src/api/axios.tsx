import axios from "axios";

// backend port
const instance = axios.create({
  baseURL: "http://localhost:3001",
});
// instance.defaults.withCredentials = true;

export default instance;
