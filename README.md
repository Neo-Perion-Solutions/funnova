# 🌟 FUNNOVA - Digital Learning Platform

Welcome to **FUNNOVA**, a vibrant, child-friendly learning adventure designed for Grade 4 and Grade 5 students to excel in Mathematics and Science! 🚀

## 📚 Tech Stack
- **Frontend**: React + Vite + React Router v6 + CSS
- **Backend**: Node.js + Express
- **Database**: Neon Cloud PostgreSQL (pg)
- **Security**: JWT Authentication + bcryptjs Password Hashing

---

## 🛠️ Setup Instructions

### Prerequisites
1. Node.js (v16 or higher recommended)
2. No local PostgreSQL needed — database runs on Neon Cloud

### 1. Database Setup (Neon Cloud)
1. The database is hosted on **Neon Cloud PostgreSQL** — no local PostgreSQL installation needed.
2. Run the schema against the Neon database:
   ```bash
   psql "postgresql://neondb_owner:npg_QK9jHF8tRiaU@ep-wandering-shape-aneklrr4-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require" -f server/schema.sql
   ```
3. Run the seed data script:
   ```bash
   psql "postgresql://neondb_owner:npg_QK9jHF8tRiaU@ep-wandering-shape-aneklrr4-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require" -f server/seed.sql
   ```

### 2. Backend Setup
1. CD into the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Your `.env` file already contains the Neon connection string. Verify `server/.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://neondb_owner:npg_QK9jHF8tRiaU@ep-wandering-shape-aneklrr4-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=super_secret_funnova_jwt_key_2024
   JWT_EXPIRES_IN=7d
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. CD into the `client` directory (in a new terminal):
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will usually run on `http://localhost:5173`.*

---

## 🔑 Demo Accounts

The `seed.sql` script creates these two users automatically for testing. The password for both is **password123**:

| Role | Student ID | Password | Grade | Name |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `STU-001` | `password123` | 4 | Alice Wonderland |
| **Admin** | `ADMIN-001` | `password123` | 4 | Teacher Tom |

---

## 🎮 Features Included
- **Robust Role-Based Authentication**: Admin vs Student.
- **Dynamic Content**: Subjects filtering based on selected Grade (via React Context).
- **Interactive Quizzes**: Multiple Choice, True/False, and Fill in the Blank questions with instant visual feedback.
- **Fun Rewards**: Score tracking, animated progress bars, and floating bubble animations.
- **Embedded Videos & Games**: YouTube video embedding and external learning games with visibility toggles.
- **Personal Tracker**: Live, accurate calculation of Student progress against available materials in PostgreSQL.
