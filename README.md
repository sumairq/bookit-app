# Bookit — Full Stack Experiences & Events Booking Platform

**Bookit** is a full-stack web application for discovering, exploring, and booking curated experiences and events. It is built using modern web technologies with a clean separation between frontend and backend in a monorepo structure.

The platform is designed to be scalable and extensible, supporting real-world booking workflows, authentication, payments, and rich experience detail pages.

---

## ✨ Features

- 🎟️ Browse curated experiences and events
- 📄 Detailed experience pages with maps, schedules, and hosts
- 👤 User authentication and profile management
- 💳 Secure booking and payment integration
- 🗄️ RESTful API built with Express.js
- 💾 Data persistence using MongoDB
- ⚛️ Modern React frontend with TypeScript
- 🔐 JWT-based authentication with secure cookies
- 🌍 Interactive maps powered by Mapbox

---

## 📁 Project Structure

This repository follows a **monorepo** structure with separate folders for the frontend and backend:

```
natours/
│
├── backend/        # Express + TypeScript API
│
├── frontend/       # React + TypeScript + Vite UI
│
├── shared/         # Shared TypeScript types (optional)
│
├── .gitignore
├── package.json    # Workspace root (optional)
└── README.md
```

### 🔹 Backend (`/backend`)

- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- Stripe Payments

### 🔹 Frontend (`/frontend`)

- React
- TypeScript
- Vite
- Axios for API communication
- React Router for navigation

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd natours
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and add:

```env
NODE_ENV=development
PORT=3000
DATABASE=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Run the backend server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will typically run on:

```
http://localhost:5173
```

The backend API will run on:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

- Users authenticate via the backend API
- JWT tokens are stored in **HTTP-only cookies**
- Protected routes are handled on both frontend and backend

---

## 💳 Payments

- Stripe is used for secure experience payments
- Checkout sessions are created on the backend
- Users are redirected from the frontend to Stripe

---

## 🚀 Future Enhancements

- Advanced filtering and sorting
- Admin dashboard
- Experience analytics
- Reviews and ratings system
- Role-based access control
- Performance optimizations
- Mobile responsiveness improvements

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Stripe

---

## 📌 Project Purpose

This project serves as a scalable foundation for a full-featured event/experience selling platform built with modern full-stack technologies. More advanced features and improvements will be progressively introduced as development continues.

---

## 📄 License

This project is for educational and portfolio purposes.
