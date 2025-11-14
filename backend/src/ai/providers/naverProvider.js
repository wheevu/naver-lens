// CLOVA X
'use strict';

import axios from 'axios';

class NaverClovaProvider {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async chatCompletion(messages, options = {}) {
    const {
      model = 'HCX-005',
      temperature = 0.5,
      topK = 0,
      topP = 0.8,
      maxTokens = 512,
      repeatPenalty = 1.0,
      stop = null
    } = options;

    const payload = {
      model,
      messages,
      temperature,
      topK,
      topP,
      maxTokens,
      repeatPenalty
    };

    if (stop) {
      payload.stopBefore = stop;
    }

    const url = `${this.baseUrl}/${model}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data;
    } catch (error) {
      console.error('NAVER CLOVA API Error:', error.response?.data || error.message);
      throw new Error(`CLOVA API failed: ${error.response?.data?.status?.message || error.message}`);
    }
  }
}

export default NaverClovaProvider;