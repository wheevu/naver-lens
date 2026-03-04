# Naver-Lens: AI-Powered Review Summarization Widget

### ⭐️ A NAVER Vietnam AI Hackathon 2025 Project ⭐️

<p align="center">
<img src="./showcase_images/team-triple-threat.png" alt="Name of Product and Hackathon team" width="39%"> &nbsp; &nbsp;
<img src="./showcase_images/ai-panel-summary.png" alt="AI Panel" width="35%">
</p>

**Naver-Lens** is an AI widget that reads through product reviews and gives shoppers quick, organized summaries—saving them from scrolling through hundreds of comments. Built for the NAVER Vietnam AI Hackathon, it uses NAVER's `HyperCLOVA` AI model to understand what buyers like and dislike about a product.

Since this is an AI hackathon focused on building AI solutions, we created a full demo e-commerce site from scratch to show exactly where Naver-Lens would live in a real online store. The shopping site is the environment; **the AI review summarizer is the actual product**.

> _💡 Note: This is an archived showcase of the project. The live `NAVER Cloud` deployment and `HyperCLOVA` AI services were only available during the hackathon and are no longer running. This project has been set up with a "showcase mode" that uses a saved AI response so you can still see how the AI widget works._

## 🎯 What I Did

I built the backend for the AI widget and handled deployment for our four-person team, **team-triple-threat**. Here's what I worked on:

- **AI Widget Backend**: I built the server that powers the review summarization feature using `Node.js` from scratch. It feeds customer reviews to the AI and streams the response back to the chat panel in real-time.
- **Demo Site**: Since we needed to show where Naver-Lens would actually be used, I also built out the backend for the demo e-commerce site—including product listings, filtering, and reviews—to create a realistic environment for the AI widget.
- **Cloud Deployment**: I set up a `Linux` server on `Naver Cloud Platform` and deployed everything there using `Docker`, so judges could try the AI widget live during our presentation.
- **Planning & Presentation**: I helped shape the product concept and designed the slides we used to pitch Naver-Lens to the judges.

<p align="center">
<img src="./showcase_images/certificate.png" alt="NAVER AI Hackathon Certificate" width="44%">
&nbsp; &nbsp;
<img src="./showcase_images/presentation.jpeg" alt="Team Presentation" width="52%">
</p>

## 🛠️ How It Works

#### 🤖 The AI Widget (The Main Product)

**Naver-Lens** is an embedded chat panel that appears on product pages. When a shopper clicks the "Summarize Reviews" button, it sends all the reviews to NAVER's `HyperCLOVA` AI and streams back an organized summary—highlighting what buyers liked, disliked, and common themes.

The backend streams the AI response in real-time, so the summary appears word-by-word as it generates. This creates an instant, engaging experience.

<p align="center">
<img src="./showcase_images/ai-panel-toast.png" alt="AI Panel Toast" width="55%">
&nbsp; &nbsp;
<img src="./showcase_images/ai-panel-summary.png" alt="AI Panel Summary" width="35%">
</p>

#### 🛒 The Demo E-Commerce Site (The Environment)

Since Naver-Lens is meant to be embedded into existing shopping sites, we built a complete demo store from scratch to show it in action. The demo site includes:

- Product catalog with filtering and search
- Product detail pages with review sections
- Multi-language support (English/Korean)
- Light and dark mode

I built the backend for this demo site using `Node.js` and `MongoDB`, organizing product data, reviews, and images so the AI widget would have realistic content to work with.

#### ☁️ Cloud Deployment (`Naver Cloud Platform`)

I packaged both the AI widget backend and the demo site using `Docker` and deployed everything to a live `Naver Cloud Platform` server. This let judges interact with Naver-Lens on real product pages during our presentation.

<p align="center">
<img src="./showcase_images/ssh-terminal.png" alt="SSH into Naver Cloud Server" width="80%">
</p>

## ✨ Visual Showcase

### The AI Widget in Action

The **Naver-Lens** widget sits on product pages and gives shoppers instant review summaries. Click the button, and the AI reads through all the reviews for you.

<p align="center">
<img src="./showcase_images/ai-panel-toast.png" alt="AI Panel Button" width="55%">
&nbsp; &nbsp;
<img src="./showcase_images/ai-panel-summary.png" alt="AI Generated Summary" width="35%">
</p>

### The Demo Site

To showcase the widget, we built a complete e-commerce demo from scratch. It looks and feels like a real online store so you can see exactly where Naver-Lens fits into the shopping experience.

**🇺🇸/🇰🇷 Homepage**

<p align="center">
<img src="./showcase_images/homepage-en.png" alt="Homepage English" width="48%"> &nbsp; &nbsp;
<img src="./showcase_images/homepage-ko.png" alt="Homepage Korean" width="49%">
</p>

**🛒 Product Pages Where the Widget Lives**

<img src="./showcase_images/product-grid.png" alt="Product grid" width="48%"> &nbsp; &nbsp;
<img src="./showcase_images/product-blog.png" alt="Product blogs" width="48%"> &nbsp; &nbsp;

<p align="center">
<img src="./showcase_images/product-details.png" alt="Product details with AI widget" width="49%">
</p>

## 🚀 How to Run (Showcase Mode)

#### 1. Clone the repository

```bash
git clone https://github.com/wheevu/naver-lens.git
cd naver-lens
```

#### 2. Run the Backend

```bash
cd backend
npm install
# Ensure SHOWCASE_MODE=true in .env
npm run dev
```

#### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

## 💻 Technology Stack

- **Frontend**: `React 19`, `Vite`, `TypeScript`, `TailwindCSS`, `i18next`
- **Backend**: `Node.js`, `Express.js`, organized code structure, real-time streaming
- **Database**: `MongoDB`, `Mongoose`
- **AI**: `NAVER HyperCLOVA` (original), `Mock Service` (showcase)
- **Deployment**: `Docker`, `Naver Cloud Platform`, `Linux (Ubuntu)`
