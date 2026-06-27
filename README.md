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


 # 🏗️ Architecture Overview

This project follows a simple full-stack architecture where the frontend communicates with the backend through REST APIs, and the backend interacts with MongoDB to retrieve and process data.

```
                    React Frontend
                          │
                   Axios HTTP Requests
                          │
                    Express REST APIs
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
 Business Logic & Services          MongoDB Database
        │                                   │
 Risk Engine                School & Grant Collections
        │
 AI Narrative Service
        │
 Google Gemini API (Optional)
```

### Why this architecture?

I separated the application into three layers:

* **Frontend** is responsible for displaying dashboards and reports.
* **Backend** handles business logic, calculations, and API responses.
* **Database** stores imported CSV data in structured collections.

Keeping these responsibilities separate makes the project easier to maintain, debug, and extend.

---

# 📂 Project Structure

```
client/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
│
server/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── scripts/
│   └── config/
│
├── data/
│   ├── PBL CSV Files
│   ├── Grant CSV Files
│   └── Evidence Images
│
└── package.json
```

### Folder Responsibilities

| Folder         | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `components/`  | Reusable UI components                                              |
| `pages/`       | Main application pages                                              |
| `api/`         | Axios API calls                                                     |
| `controllers/` | Handles incoming API requests                                       |
| `routes/`      | Defines REST endpoints                                              |
| `models/`      | MongoDB schemas                                                     |
| `services/`    | Business logic such as risk calculation and AI narrative generation |
| `scripts/`     | CSV import (seed) scripts                                           |

Keeping business logic inside the `services` folder allows controllers to stay clean and focused only on handling requests and responses.

---

# 🔄 Application Flow

The application processes data in four simple stages.

### Step 1 — Import Data

The provided CSV files are imported into MongoDB using seed scripts.

```
CSV Files
     │
     ▼
Seed Scripts
     │
     ▼
MongoDB Collections
```

---

### Step 2 — Process Data

When the frontend requests dashboard data:

* Express APIs fetch records from MongoDB.
* Aggregation pipelines calculate KPIs.
* The Risk Engine classifies attendance into risk categories.
* Processed data is returned as JSON.

```
React
   │
API Request
   │
Express
   │
MongoDB Aggregation
   │
Risk Engine
   │
JSON Response
```

---

### Step 3 — Display Dashboard

The frontend receives the processed data and displays:

* KPI Cards
* Charts
* Tables
* Risk Status
* Trends

No business calculations are performed in React.

---

### Step 4 — Generate Grant Narrative

For grant reports:

1. Backend collects finance and performance data.
2. Required metrics are calculated.
3. If AI is enabled, Gemini generates a narrative.
4. If AI is unavailable, a template-based summary is returned automatically.

```
Grant Data
      │
Fact Panel
      │
───────────────
│             │
Gemini      Template
│             │
───────────────
      │
Generated Report
```

This ensures the application continues to work even if the AI service is unavailable.

---

# 💡 Design Decisions

Some important design choices made during development:

### 1. Keep calculations in the backend

Instead of calculating attendance and risk inside React, all calculations are performed on the server.

Benefits:

* Single source of truth
* Cleaner frontend
* Easier testing
* Consistent API responses

---

### 2. Separate AI from Business Logic

The AI model is **not** responsible for calculations.

The backend first computes all metrics such as:

* Attendance Rate
* Participation Rate
* Budget Utilization
* Risk Status

Only after these values are finalized are they sent to Gemini to generate a human-readable narrative.

This prevents AI from inventing numbers and keeps business calculations deterministic.

---

### 3. Modular Backend

The backend is divided into:

* Routes
* Controllers
* Services
* Models

This separation makes the codebase easier to maintain and allows new features to be added with minimal changes.

# 🗄️ Database Design

The application stores data in MongoDB using separate collections for school responses and grant reporting data. Keeping the data organized into dedicated collections makes querying faster and simplifies future feature additions.

## Collections Used

### 1. SchoolResponse

This is the primary collection used by the dashboard.

Each document represents **one school's response for one reporting month**.

Example fields:

* Reporting Month
* School Code
* District
* Block
* Grade
* Subject
* Enrollment
* Attendance
* Evidence Submitted
* Attendance Rate (computed)
* Risk Status (computed)

This collection powers:

* Dashboard KPIs
* District analysis
* Block analysis
* Trend analysis
* Risk calculations

---

### 2. Grant

Stores basic information about each grant.

Example fields:

* Grant ID
* Grant Name
* Donor
* Project Duration
* Covered Districts

This collection contains only the static information related to a grant.

---

### 3. GrantFinanceLine

Stores monthly financial records for every grant.

Example fields:

* Grant ID
* Reporting Month
* Budget Category
* Budget Allocated
* Budget Utilized

This data is used to calculate budget utilization shown in the Grant Reporting Assistant.

---

### 4. GrantPerformance

Stores monthly performance information.

Example fields:

* Grant ID
* Reporting Month
* Milestones
* Participation Rate
* Evidence Submission Rate
* Draft Report Text

This collection provides the operational performance data for each grant.

---

### 5. EvidenceAsset

Stores references to evidence images linked with a grant.

Example fields:

* Grant ID
* Reporting Month
* Image Path
* Caption

These images are displayed inside the Grant Reporting Assistant.

---

## Why Multiple Collections?

Instead of storing everything in one large collection, the data is separated based on its purpose.

Benefits include:

* Easier querying
* Better scalability
* Cleaner data relationships
* Simpler maintenance
* Independent updates without affecting other modules

---

# ⚙️ Risk Classification Engine

One of the key requirements of the assignment was identifying schools that require attention.

For this purpose, I implemented a dedicated **Risk Engine**.

The Risk Engine is a standalone service responsible only for determining the risk status based on attendance percentage.

### Risk Thresholds

| Attendance Rate   | Status      |
| ----------------- | ----------- |
| **75% and above** | ✅ On Track  |
| **60% – 74.9%**   | 🟡 Behind   |
| **35% – 59.9%**   | 🟠 At Risk  |
| **Below 35%**     | 🔴 Critical |

The Risk Engine is completely independent of the frontend and AI service, making it easy to test and reuse across different APIs.

---

# 📈 Dashboard Calculations

The dashboard does not display raw CSV values directly.

Instead, the backend computes important metrics before sending data to the frontend.

Some examples include:

* Total Schools
* Participating Schools
* Participation Rate
* Total Enrollment
* Attendance Rate
* Evidence Submission Rate
* District Rankings
* Block Rankings
* Risk Status

These calculations are performed using MongoDB aggregation pipelines and backend business logic.

This approach keeps the frontend lightweight and ensures consistent calculations across the application.

---

# 🤖 AI Workflow

The AI feature is designed as an **optional enhancement**, not as the core business logic.

The application first computes all required metrics using backend logic.

Only after these values are finalized are they passed to the AI model for generating a human-readable report.

```
School & Grant Data
        │
        ▼
Business Logic
        │
        ▼
Computed Metrics
        │
───────────────
│             │
Gemini AI   Template
│             │
───────────────
        │
Generated Narrative
```

The AI model is **never responsible for calculations** such as attendance rate, participation rate, budget utilization, or risk classification.

Its responsibility is only to convert already-computed facts into a readable summary.

---

# 🛡️ AI Fallback Strategy

To make the application reliable, a fallback mechanism has been implemented.

### If AI is available

* Backend prepares the fact panel.
* Gemini generates a narrative.
* Response is returned to the frontend.

### If AI is unavailable

The backend automatically generates a structured template-based narrative using the same computed metrics.

This ensures that the application continues to function even if:

* API quota is exceeded
* Network requests fail
* Gemini service is unavailable

The user receives a complete report regardless of AI availability.

---

# 💭 Key Design Decision

One important architectural decision during development was keeping **business logic separate from AI**.

Instead of asking the AI model to analyze raw CSV files, the backend first computes all metrics and validates the results.

The AI receives only structured facts and converts them into a readable narrative.

This approach improves:

* Accuracy
* Reliability
* Predictability
* Maintainability

and ensures that important business calculations are never dependent on an external AI service.

# 🔌 API Reference

The backend exposes REST APIs that power both the Program Intelligence Dashboard and the Grant Reporting Assistant.

---

## Dashboard APIs

### Get Filter Values

```http
GET /api/dashboard/filters
```

Returns available filter options such as:

* Reporting Months
* Districts
* Blocks
* Grades
* Subjects

This endpoint is used to populate filter dropdowns in the dashboard.

---

### Dashboard Summary

```http
GET /api/dashboard/summary
```

**Query Parameters**

| Parameter | Description     |
| --------- | --------------- |
| month     | Reporting month |
| district  | District name   |
| block     | Block name      |
| grade     | Grade           |
| subject   | Subject         |

Returns:

* Total Schools
* Participating Schools
* Participation Rate
* Attendance Rate
* Total Enrollment
* Evidence Submission Rate
* Overall Risk Status

---

### Dashboard Trends

```http
GET /api/dashboard/trend
```

Returns month-over-month trends for:

* Participation
* Attendance
* Enrollment
* Evidence Submission

This data is used to render charts in the dashboard.

---

### Geography Analysis

```http
GET /api/dashboard/geography
```

Supports:

* District Ranking
* Block Ranking

Each record includes:

* Attendance
* Participation
* Risk Status

---

## Grant APIs

### List Grants

```http
GET /api/grants
```

Returns all available grants.

---

### Available Reporting Months

```http
GET /api/grants/:grantId/months
```

Returns all reporting months available for a selected grant.

---

### Grant Report

```http
GET /api/grants/:grantId/report
```

Returns a complete grant report containing:

* Grant Profile
* Financial Summary
* Performance Summary
* Evidence Assets
* Live Dashboard Metrics

---

### Generate Narrative

```http
POST /api/grants/:grantId/narrative
```

Request Body

```json
{
  "month": "2025-08",
  "aiEnabled": true
}
```

Response

```json
{
  "narrative": "...",
  "source": "gemini"
}
```

If AI is unavailable, the response automatically falls back to:

```json
{
  "narrative": "...",
  "source": "template_fallback"
}
```

This keeps the frontend behavior consistent regardless of AI availability.

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure you have:

* Node.js (v18 or above)
* MongoDB Atlas Account
* Git
* Google Gemini API Key (optional)

---

## Clone Repository

```bash
git clone <your-github-repository>
cd pbl-intelligence
```

---

## Install Dependencies

Backend

```bash
cd server
npm install
```

Frontend

```bash
cd client
npm install
```

---

## Configure Environment Variables

### Server (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
```

---

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Import Data

Run the seed scripts to import the CSV files into MongoDB.

```bash
cd server

node src/scripts/seed.js

node src/scripts/seedGrants.js
```

---

## Start Development Server

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

Visit:

```
http://localhost:5173
```

---

# 🌍 Deployment

This project can be deployed using:

Frontend

* Vercel
* Netlify

Backend

* Render
* Railway

Database

* MongoDB Atlas

Environment variables should be configured in the deployment platform before running the application.

---

# 💡 Challenges Faced

During development, a few challenges required careful consideration.

### 1. Designing the Data Model

The source data was spread across multiple CSV files.

Instead of combining everything into one collection, the data was separated into logical collections for school responses, grants, finance records, performance records, and evidence assets.

This made the application easier to maintain and query.

---

### 2. Attendance & Risk Calculation

Rather than relying entirely on derived values from the CSV files, the backend recalculates attendance-related metrics before assigning risk status.

This ensures the dashboard always displays consistent results.

---

### 3. AI Integration

The assignment required AI-assisted reporting while ensuring the application still works without AI.

To achieve this:

* AI is used only for narrative generation.
* All business calculations remain deterministic.
* A template-based fallback guarantees report generation even if AI is unavailable.

---

# 📚 What I Learned

Building this project helped me gain practical experience in:

* Designing REST APIs
* Working with MongoDB Aggregation Pipelines
* Importing CSV datasets
* Structuring a MERN application
* Integrating AI into an existing application
* Separating business logic from presentation logic
* Building reusable backend services

---

# 🔮 Future Improvements

Given more time, I would like to add:

* User Authentication
* Role-Based Access Control
* PDF Report Export
* Dashboard Report Scheduling
* Advanced Analytics
* Unit & Integration Testing
* Docker Support
* CI/CD Pipeline
* Cloud Storage for Evidence Assets

---

# 🙏 Acknowledgements

This project was developed as part of the **Mantra4Change Full-Stack Product Engineering Intern Assignment**.

The objective was to demonstrate practical full-stack development skills by building a real-world dashboard capable of transforming educational and grant reporting data into meaningful insights.

