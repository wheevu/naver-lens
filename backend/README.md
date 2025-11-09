- reference: https://dev.to/mr_ali3n/folder-structure-for-nodejs-expressjs-project-435l
---
## Note: 
- I don't familiar with Backend folder structure, so feel free to custom **and** explain in this README; but there are few importants folders **THAT SHOULD NOT BE FIXED**:
- Remember to finish the `Dockerfile`

```bash
.
├── Dockerfile
├── README.md
└── src
    ├── ai
    │   ├── processors
    │   │   └── text.processor.js
    │   ├── prompts
    │   │   ├── summarization.js
    │   │   └── template.js
    │   └── providers
    │       └── naver.provider.js
    ├── config
    │   ├── app.js
    │   ├── db.config.js
    │   └── env.config.js
    ├── models
    │   ├── index.js
    │   └── summary.model.js
    ├── routes
    │   ├── summarization.controller.js
    └── services
        └── product.service.js
```

## Explanation
- `ai`: every ai logic in here - prompt, preprocess, providers.
- `config`: every backend config in here
- `models`: storing summaries in database
- `routes`: every api handling go here
- `services`: Orchestrates backend flow

## Next step
- @Vu and @Son try your best to make it works, so we can write a Dockerfile and try to deploy it