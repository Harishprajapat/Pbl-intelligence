#  PBL Intelligence Dashboard & Grant Reporting Assistant

> A full-stack web application built as part of the **Mantra4Change Full-Stack Product Engineering Intern Assignment**.

The application transforms raw Project-Based Learning (PBL) school response data into an interactive analytics dashboard and provides a Grant Reporting Assistant that combines financial, performance, and evidence data into a report-ready summary with optional AI-assisted narrative generation.

---

## ✨ Features

### 📊 Program Intelligence Dashboard

* Interactive dashboard built using React
* Filter data by Month, District, Block, Grade, and Subject
* KPI cards for participation, attendance, enrollment, and evidence submission
* District and Block level performance analysis
* Month-over-month trend visualization
* Risk classification using predefined attendance thresholds

### 📑 Grant Reporting Assistant

* View grant profile and reporting information
* Budget utilization summary
* Performance milestones
* Evidence image viewer
* AI-assisted narrative generation
* Automatic template fallback if AI is unavailable

### ⚙️ Backend Features

* RESTful APIs built with Express.js
* MongoDB Atlas integration
* CSV data import using seed scripts
* Aggregation pipelines for dashboard analytics
* Modular service architecture
* AI service isolated from business logic

---

## 🛠 Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Frontend        | React (Vite), Tailwind CSS, Axios, Recharts |
| Backend         | Node.js, Express.js                         |
| Database        | MongoDB Atlas, Mongoose                     |
| AI              | Google Gemini API (with template fallback)  |
| Version Control | Git & GitHub                                |

---

## 🌐 Live Demo

Frontend: **https://pbl-intelligence.vercel.app**

Backend API: **https://pbl-intelligence.onrender.com/api/health**

---

## 📸 Screenshots

> Replace these placeholders after deployment.

### Dashboard

<img width="1920" height="1080" alt="Screenshot (823)" src="https://github.com/user-attachments/assets/c2091920-7b11-4f78-98a3-6dd838961239" />

### Grant Report

 <img width="1920" height="1080" alt="Screenshot (824)" src="https://github.com/user-attachments/assets/08830b41-da46-4ec1-a91f-29c56e0decda" />

### AI Narrative

 <img width="1920" height="1080" alt="Screenshot (825)" src="https://github.com/user-attachments/assets/a3ae1c42-c9ed-4340-986f-abb104a89eee" />
