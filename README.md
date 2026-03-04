## NAVER Vietnam AI Hackathon 2025 Project

<p align="center">
<img src="./showcase_images/team-triple-threat.png" alt="Name of Product and Hackathon team" width="39%"> &nbsp; &nbsp;
<img src="./showcase_images/homepage-ko.png" alt="UI" width="52%">
</p>

**Naver-Lens** is an embedded chat that provides organized summaries of product reviews using NAVER's `HyperCLOVA` AI model. 

This codebase includes the *Naver Smart Store UI* (rebuilt from scratch) and the *backend* for everything.

Built for the **NAVER Vietnam AI Hackathon** in the final round.

> _💡 Note: This is an archived showcase of the project. The live `NAVER Cloud` deployment and `HyperCLOVA` AI services were only available during the hackathon and are no longer running. This project has been set up with a "showcase mode" that uses a saved AI response so you can still see how the full interface works._

## What I Did

I built the backend and handled the deployment for our four-person team, **team-triple-threat**. Here's what I worked on:

- **Backend Development**: I built the main server using `Node.js` from the ground up.
- **Cloud Deployment**: I set up a `Linux` server on `Naver Cloud Platform` and got everything running there. I packaged the app using `Docker` and handled the full deployment so our project could be accessed online.
- **Planning & Presentation**: I helped come up with the product idea, wrote down what we needed to build, and designed the slides we used to present our project.

<p align="center">
<img src="./showcase_images/certificate.png" alt="NAVER AI Hackathon Certificate" width="44%">
&nbsp; &nbsp;
<img src="./showcase_images/presentation.jpeg" alt="Team Presentation" width="52%">
</p>

##  How It Works

#### Backend (`Node.js` / `Express.js`)

The backend stores and manages all the product information, lets users filter and browse products, and connects to the AI service (which was developed/tuned by my teammate). I also added `caching` to make frequently viewed products load faster.

#### Review Summaries

The  main feature is the AI summary panel. When you ask for a summary, the backend streams the response in pieces as it is generated, so you don't have to wait for the entire result.

<p align="center">
<img src="./showcase_images/ai-panel-toast.png" alt="AI Panel Toast" width="55%">
&nbsp; &nbsp;
<img src="./showcase_images/ai-panel-summary.png" alt="AI Panel Summary" width="35%">
</p>

#### Database (`MongoDB`)

I designed the database to handle complex product details like multiple photos, different product options, and customer reviews.

<p align="center">
<img src="./showcase_images/database-schema.png" alt="Database Schema Diagram" width="70%">
</p>

#### Cloud Deployment (`Naver Cloud Platform`)

I packaged the entire app using `Docker` and put it on a live `Naver Cloud Platform` server so people could actually use it online.

<p align="center">
<img src="./showcase_images/ssh-terminal.png" alt="SSH into Naver Cloud Server" width="80%">
</p>

## UI

It was Naver's hackathon, so we decided to use one of their existing platforms as the UI. It includes light and dark modes, as well as multilingual support (English/Korean) *(the deployed version had working images...)*.

**🇺🇸/🇰🇷 Homepage**

<p align="center">
<img src="./showcase_images/homepage-en.png" alt="Homepage English" width="48%"> &nbsp; &nbsp;
<img src="./showcase_images/homepage-ko.png" alt="Homepage Korean" width="49%">
</p>

**Product Catalog & Details**

<img src="./showcase_images/product-grid.png" alt="Product grid" width="48%"> &nbsp; &nbsp;
<img src="./showcase_images/product-blog.png" alt="Product blogs" width="48%"> &nbsp; &nbsp;

<p align="center">
<img src="./showcase_images/product-details.png" alt="Product details" width="49%">
</p>

## How to Run (Showcase Mode)

#### 1. Clone the repository

```bash
git clone https://github.com/wheevu/naver-lens.git
cd naver-lens
```

#### 2. Run the Backend

```bash
cd backend
npm install
# Make sure SHOWCASE_MODE=true in .env
npm run dev
```

#### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

## Tech

- **Frontend**: `React 19`, `Vite`, `TypeScript`, `TailwindCSS`, `i18next`
- **Backend**: `Node.js`, `Express.js`, `MVC`, `Server-Sent Events (SSE)`
- **Database**: `MongoDB`, `Mongoose`
- **AI**: `NAVER HyperCLOVA` (original), `Mock Service` (showcase)
- **Deployment**: `Docker`, `Naver Cloud Platform`, `Linux (Ubuntu)`

---
I learned `git` and properly used GitHub for the first time during this hackathon. It was my first time on Slack too.

As you can imagine, it was mostly the same for everything else 😅 *(backend, deployment, writing PRs, resolving conflicts, learning how to make a database schema (!),...)*, over the course of 3 weeks, from ideation to a working deployment.

It was wild. But it was fun.