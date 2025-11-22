- reference: https://dev.to/mr_ali3n/folder-structure-for-nodejs-expressjs-project-435l

---

## I. Project structure

```bash
.
├── Dockerfile
├── README.md
├── data
├── package.json
├── server.js
└── src
    ├── ai
    │   ├── processors
    │   ├── prompts
    │   └── providers
    ├── config
    ├── controllers
    ├── models
    ├── routes
    ├── services
    └── test
```

## II. How to run (development)

```bash
npm install
npm run dev
```

## III. Test api

1. `GET` products:

```bash
curl http://localhost:3001/api/products/900000016
```

Or on PowerShell:
```powershell
curl.exe http://localhost:3001/api/products/900000016
```

2. `POST` summarize (need naver api key):

```bash
curl -X POST http://localhost:3001/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "900000016"
  }'
```

Or on PowerShell (Option 1 - Using variable):
```powershell
$body = '{"productId": "900000016"}'; curl.exe -X POST http://localhost:3001/api/summarize -H "Content-Type: application/json" -d $body
```

Or on PowerShell (Option 2 - Using file):
```powershell
# First create test-request.json with content: {"productId": "900000016"}
curl.exe -X POST http://localhost:3001/api/summarize -H "Content-Type: application/json" -d "@test-request.json"
```

Or on PowerShell (Option 3 - Using Invoke-WebRequest):
```powershell
$headers = @{"Content-Type" = "application/json"}
$body = '{"productId": "900000016"}'
Invoke-WebRequest -Uri "http://localhost:3001/api/summarize" -Method POST -Headers $headers -Body $body
```

## Explanation

- `ai`: every ai logic in here - prompt, preprocess, providers.
- `config`: every backend config in here
- `models`: storing summaries in database
- `routes`: every api handling go here
- `services`: Orchestrates backend flow

## IV. Product API (breaking change)

### `GET /api/products`

- Query params: `page`, `limit` (max 100), `category1-4`, `brand`, `mallName`, `minPrice`, `maxPrice`, `minRating`
- Returns paginated data sourced from the in-memory cache

```json
{
  "data": [
    {
      "id": "900000016",
      "name": "Product title",
      "imageUrl": "https://...",
      "price": 12345,
      "originalPrice": 15000,
      "brand": "Brand",
      "mallName": "Mall",
      "rating": 4.7,
      "reviewCount": 180,
      "categories": {
        "category1": "Fashion",
        "category2": "Shoes",
        "category3": "Sneakers",
        "category4": "Men"
      },
      "descriptionPreview": "First 100 chars of description..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Frontend migration notes for Minh
 
- **Accessing Data**: The API response is now an object.
  - `response.data` -> The API response object (contains `data` and `pagination`).
  - `response.data.data` -> The actual array of products.
- **Pagination**: Use `response.data.pagination` to drive the UI (total pages, next/prev logic).
- **Filtering**:
  - Pass query params directly: `/api/products?category1=Shoes`
  - **New**: Use `searchCategory` to search across all category levels: `/api/products?searchCategory=Shoes`
- **Single Product**: `/api/products/:id` response shape is unchanged.

## Git procedure

### Before you code

Always work on your own branch - here is backend:

```bash
git checkout backend
git pull --rebase origin backend
```

### After you code

**message commit rules**

- feat(auth): implement OAuth2 login flow

- fix(user): sanitize input to prevent SQL injection

- refactor(order): extract payment logic into service layer

- perf(cache): add Redis caching for product queries

- test(api): add integration tests for /checkout endpoint

- chore(deps): upgrade express to v4.18.2

- docs(api): document new /users/me endpoint

```bash
git add .
git commit -m "your message"
git push origin backend
```

### `vercel.json` if want to deploy on vercel
```bash
{
    "version": 2,
    "builds": [
        {
            "src": "server.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "server.js"
        }
    ]

}
```
