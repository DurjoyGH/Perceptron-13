# Perceptron-13 (Industrial Tour 2025 Management System)

Perceptron-13 is a full‑stack web application built to manage and publish information for the **CSE Department (Jashore University of Science & Technology) Industrial Tour 2025**.

It provides:
- A **public website** for tour information (members, schedule, seat/room allocations, committee, etc.)
- A **user area** (profile, personal info, uploads)
- An **admin dashboard** to manage schedules, users, gallery, and send announcements via email
- A **backend API** with authentication (JWT access + refresh token flow), password reset via OTP, and MongoDB persistence

> Tech Stack: **React + Vite + Tailwind CSS (frontend)**, **Node.js + Express (backend)**, **MongoDB + Mongoose**, Cloudinary for image uploads.

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started (Local Development)](#getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
  - [Backend `.env`](#backend-env)
  - [Frontend `.env`](#frontend-env)
- [API Overview (High Level)](#api-overview-high-level)
- [Auth: Refresh Token Notes](#auth-refresh-token-notes)
- [Common Scripts](#common-scripts)
- [Notes / Security](#notes--security)
- [License](#license)

---

## Features

### Public (No Login)
- Home / landing page
- Member listing & member profile view
- Tour schedule view (day-by-day itinerary)
- Seat allocation pages (bus / ship) and room allocation page (UI routes exist)
- Committee / contact information
- Transactions page (UI route exists)

### Authentication
- Register / Login
- "Me" endpoint for current user
- Logout
- Refresh token flow (access token renewal)
- Forgot password → OTP verification → Reset password

### User Dashboard
- View & update profile
- Upload/delete profile picture
- Manage featured photos (add/update/delete)

### Admin Dashboard
- Manage users
- Manage tour schedules (CRUD)
- Manage gallery (image upload via Cloudinary)
- Send announcement emails (templated HTML emails)

---

## Project Structure

```text
.
├── backend/                 # Node.js + Express API server
│   ├── app.js               # Express app + middleware + routes
│   ├── server.js            # Server entrypoint
│   ├── configs/             # DB, cloudinary config
│   ├── controllers/         # Route controllers (business logic)
│   ├── middlewares/         # Auth middleware, etc.
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routers
│   ├── services/            # Email services, etc.
│   └── utils/               # Email templates, helpers
│
├── frontend/                # React + Vite client
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx          # Routes (public/admin/user)
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page screens
│   │   ├── components/      # Shared components/layouts
│   │   └── services/        # API client wrappers (axios)
│   └── .env                 # Frontend environment variables (VITE_API_URL)
│
├── QUICK_START_REFRESH_TOKEN.md
└── REFRESH_TOKEN_IMPLEMENTATION.md
```

---

## Architecture Overview

- The **frontend** is a React SPA (Vite) that talks to the backend through REST APIs.
- The **backend** is an Express server exposing endpoints under `/api/...`.
- Authentication is handled using **JWT access tokens** (sent by the frontend in `Authorization: Bearer <token>`) and a **refresh token** flow.
- Data is stored in **MongoDB** via Mongoose models (users, votes, tour schedules, etc.).
- Image uploads (gallery/profile photos) are designed to go through **Cloudinary**.

---

## Getting Started (Local Development)

### Prerequisites
Install:
- Node.js (LTS recommended)
- npm (comes with Node) or pnpm/yarn
- MongoDB (local or cloud MongoDB Atlas)
- (Optional) Cloudinary account for image uploads

---

## Backend Setup

1. Go to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in `backend/` (see [Backend `.env`](#backend-env)).

4. Run the server:
```bash
npm run dev
```
or (if no dev script exists):
```bash
node server.js
```

Backend runs on:
- `http://localhost:5000`  
API base:
- `http://localhost:5000/api`

---

## Frontend Setup

1. Go to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Ensure `frontend/.env` has the backend API URL (see [Frontend `.env`](#frontend-env)).

4. Start dev server:
```bash
npm run dev
```

Frontend runs on:
- typically `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

Create `backend/.env` and set values similar to:

```env
PORT=5000
DB_URL=mongodb://localhost:27017/perceptron13

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# JWT / Auth (names may vary depending on implementation)
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

# Refresh token (if used)
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (for OTP / announcements)
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# Cloudinary (for gallery/profile uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> Exact variable names can differ depending on the backend controllers/services. If something fails at runtime, search the backend code for `process.env.` and adjust accordingly.

### Frontend `.env`

`frontend/.env` already contains:

```env
VITE_API_URL=http://localhost:5000/api
```

This is used by the frontend API services (axios).

---

## API Overview (High Level)

Backend mounts routes like:

- `/api/auth/...` (register, login, refresh-token, forgot-password, verify-otp, reset-password, me, logout)
- `/api/user/...` (members, profile, profile-picture, featured-photos)
- `/api/tour/...` (tour schedule endpoints)
- `/api/admin/...` (admin-only operations)
- `/api/vote/...` (voting-related endpoints)

---

## Auth: Refresh Token Notes

This repo includes:
- `QUICK_START_REFRESH_TOKEN.md`
- `REFRESH_TOKEN_IMPLEMENTATION.md`

These documents describe how the refresh token system works and how to integrate it correctly (recommended reading before deploying).

---

## Common Scripts

Typical commands (depends on `package.json`):

Frontend:
```bash
npm run dev
npm run build
npm run preview
```

Backend:
```bash
npm run dev
npm start
```

---

## Notes / Security

- Do **not** commit real secrets into the repo (MongoDB URI, SMTP credentials, Cloudinary keys).
- **Important:** There is a `seedTourSchedules.js` file that appears to contain a hard-coded MongoDB connection string. Replace/remove secrets before sharing publicly.
- Configure CORS using `ALLOWED_ORIGINS` to match your deployed frontend domain.

---

## License

Add a license if you plan to open-source this project.
If this is an internal university project, you can keep it proprietary or add a simple MIT license depending on your needs.
