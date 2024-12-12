# Member Management System

This project is a **Member Management System** designed to provide an end-to-end solution for managing members, roles, and activities. It includes separate **frontend** and **backend** applications that communicate via a proxy for seamless integration.

## Features

### Frontend
- Built with **React** and styled with **TailwindCSS**.
- Implements **pagination**, **sorting**, and **search** for member management.
- Provides a user-friendly interface to:
  - **Add**, **edit**, and **delete members**.
  - **Manage roles** for members.
  - View **recent activity logs**.
- State management is handled using **Redux**.
- **Dynamic forms** for CRUD operations, enabling reusability across modules.

### Backend
- Built with **Node.js** and **Express.js**.
- Database powered by **Sequelize ORM** and **PostgreSQL**.
- Provides RESTful APIs for:
  - **User Authentication** using **JWT**.
  - **Role management** (CRUD operations with logging).
  - **Member management** (CRUD with pagination and role associations).
  - **Activity logs** for tracking operations.
- Middleware for:
  - **Authentication** using JWT.
  - **File uploads** using Multer.
  - Logging activity in the database.

---

## Project Structure

### Folder Layout
```plaintext
.
├── frontend/             # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Views for different modules (e.g., members, roles)
│   │   ├── redux/        # Redux slices and store configuration
│   │   ├── App.js        # Main application entry
│   │   └── index.js      # Application root
│   ├── package.json      # Dependencies and scripts for the frontend
│   └── README.md         # Frontend-specific README
├── backend/              # Backend Express Application
│   ├── controllers/      # Controllers for routes
│   ├── middleware/       # Authentication and logging middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API endpoints for members, roles, users
│   ├── config/           # Database configuration
│   ├── server.js         # Application entry point
│   ├── package.json      # Dependencies and scripts for the backend
│   └── README.md         # Backend-specific README
└── README.md             # Project overview (this file)
```

# Setup Instructions

## Prerequisites
Ensure you have the following installed:
- **Node.js** (>=18.x)
- **npm** or **yarn**

---

## Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend` directory and populate it with:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```
4. Run database migrations and seed the data:
   ```bash
   npx sequelize-cli db:migrate
   node seeders/seeds.js
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

---

## Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the proxy in `frontend/package.json`:
   ```json
   "proxy": "http://localhost:5000"
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

Once completed, the **frontend** will run on `http://localhost:3000` and communicate with the **backend** via the proxy set in the `frontend/package.json` file.
