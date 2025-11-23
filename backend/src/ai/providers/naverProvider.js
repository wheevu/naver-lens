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

  /**
   * Stream chat completion using SSE (Server-Sent Events)
   * @param {Array} messages - Chat messages array
   * @param {Object} options - API options
   * @param {Function} onToken - Callback for each token received
   * @param {Function} onComplete - Callback when streaming completes
   * @param {Function} onError - Callback for errors
   */
  async chatCompletionStream(messages, options = {}, onToken, onComplete, onError) {
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
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'text/event-stream'
    };

    try {
      const response = await axios.post(url, payload, {
        headers,
        responseType: 'stream'
      });

      let buffer = '';
      let fullContent = '';

      response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '' || line.startsWith(':')) {
            continue; // Skip empty lines and comments
          }

          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              
              // Handle token event
              if (parsed.message?.content) {
                const token = parsed.message.content;
                fullContent += token;
                
                if (onToken) {
                  onToken(token, parsed);
                }
              }

              // Handle result event (final message)
              if (parsed.finishReason) {
                if (onComplete) {
                  onComplete({
                    fullContent,
                    finishReason: parsed.finishReason,
                    usage: parsed.usage,
                    created: parsed.created
                  });
                }
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      });

      response.data.on('end', () => {
        // Stream ended
        if (!fullContent && onError) {
          onError(new Error('Stream ended without content'));
        }
      });

      response.data.on('error', (error) => {
        console.error('Stream error:', error);
        if (onError) {
          onError(error);
        }
      });

    } catch (error) {
      console.error('NAVER CLOVA Streaming API Error:', error.response?.data || error.message);
      if (onError) {
        onError(error);
      }
      throw new Error(`CLOVA Streaming API failed: ${error.response?.data?.status?.message || error.message}`);
    }
  }
}

export default NaverClovaProvider;