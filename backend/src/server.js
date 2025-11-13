// server.js (excerpt)
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const API_KEY = process.env.CLOVASTUDIO_API_KEY;
const BASE_URL = process.env.CLOVASTUDIO_BASE_URL;  // e.g., "https://clovastudio.apigw.ntruss.com/v1/chat-completions"

app.post("/api/ai", async (req, res) => {
  try {
    const { 
      model = "HCX-003",
      messages,
      temperature = 0.5,
      topK = 0,
      topP = 0.8,
      maxTokens = 512,
      repeatPenalty = 1.0,
      stop = null
    } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "'messages' must be array" });
    }

    const payload = {
      model,
      messages,
      temperature,
      topK,
      topP,
      maxTokens,
      repeatPenalty,
    };
    if (stop) {
      payload.stopBefore = stop;   // depends on doc naming
    }

    const url = `${BASE_URL}/${model}`;
    console.log("Request URL:", url);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    };

    const apiResp = await axios.post(url, payload, { headers });
    console.log("Code 200: API response received hhe");
    return res.json(apiResp.data);

  } catch (err) {
    console.error("API error:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// End of server.js