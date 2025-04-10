# 🔐 Auth Node Express - MongoDB + TypeScript

This is the **Express.js** implementation of a full-featured authentication system using **MongoDB**, **TypeScript**, and **Mongoose**, as part of the [Auth Practice](https://github.com/aphatheology/auth-practice) monorepo.

---

## 📦 Tech Stack
- **Express.js** (Node.js framework)
- **TypeScript**
- **MongoDB + Mongoose**
- **Migrate Mongo** (for migrations)
- **Joi** (request validation)
- **JWT** (authentication)
- **Bcrypt** (password hashing)
- **Dotenv** (env management)

---

## ✨ Features

- 📧 Email/password registration with email verification (WIP)
- 🔐 Login with JWT token generation
- 🌐 OAuth (Google now, GitHub later via migration)
- 🔄 Account linking via shared email
- 🧱 Migrations using `migrate-mongo`
- 🚦 Standard API response format

---

## 🧪 API Response Format
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "email": "..." },
    "token": "..."
  }
}
```

Error Example:
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": { "email": "Email is already in use" }
}
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/aphatheology/auth-practice.git
cd auth-practice/auth-node-express
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Configure environment
Set the environment variables:

```bash
cp .envExample .env

# open the .env file and modify the environment variables 
```

### 4. Run migration
```bash
yarn migrate:up
```

### 5. Start the server
```bash
yarn dev
```

---

> Built with 💛 by Mustapha AbdulKareem
