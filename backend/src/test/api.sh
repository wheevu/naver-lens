curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "HCX-005",
      "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are an English assistant. Respond in English."
          }
        ]
      },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "Hi HyperCLOVA X!"
              }
            ]
          }
      ]
  }'                         