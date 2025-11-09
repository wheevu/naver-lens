# 1. Project structure
```bash
.
├── Dockerfile
├── README.md
├── eslint.config.mjs
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── api
│   ├── components
│   ├── hooks
│   ├── pages
│   ├── styles
│   ├── utils
│   └── vite-env.d.ts
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.tsbuildinfo
└── vite.config.ts
```

# 2. Explanation
- `api`: axios api
- `components`: React components
- `hooks`: custom hooks if need
- `pages`: contain web pages
- `styles`: all .css file go here

# 3. Run
```bash
npm install
npm run dev
```