# BaseScan Pro Dashboard (Learning Project)

A simple on-chain analytics dashboard that consumes the [BaseScan](https://basescan.org/) API and visualizes activity for a given wallet address.

> ⚠️ Note: This is a **learning / practice project**, not a production analytics tool and not affiliated with Base or BaseScan.

---

## 🎯 Purpose

This project was built to understand:

- How to **call REST APIs** and work with JSON responses  
- How to structure information inside a **dashboard layout**  
- How to display metrics and charts for better **data storytelling**  
- How to **deploy** a small project using Vercel

It is not a full data science project – it’s mainly about APIs, UI and basic visualization.

---

## ✨ Features

For a given Base wallet address, the dashboard currently shows:

- **On-chain score** (based on recent transactions)  
- **Total gas spent**  
- **Active time & active day**  
- **Total transactions & unique active days**  
- **Success rate and interaction stats**  
- Top contract interactions (last N transactions)  
- Simple activity charts (recent volume / token activity)

Many of these values come directly from the BaseScan API response and are displayed in a clean UI.

---

## 🛠 Tech Stack

> Update this section if your stack is different.

- Frontend: React / Next.js  
- Styling: Tailwind CSS  
- Deployment: Vercel  
- Data Source: BaseScan API

