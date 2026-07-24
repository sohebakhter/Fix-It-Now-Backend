# 🔧 FixItNow Backend

A robust RESTful API for **FixItNow**, a service booking platform that connects customers with technicians. The backend handles authentication, authorization, service management, booking requests, payments, reviews, and role-based access control.

---

## 🚀 Live API

> Add your deployed backend URL here

Example:

```text
https://fixitnow-backend.vercel.app
```

---

## 📌 Features

### Authentication

* JWT Authentication
* Access & Refresh Token
* Password Hashing with bcrypt
* Role-Based Authorization

### User Management

* User Registration
* User Login
* Update Profile
* Delete Profile
* Change Password

### Technician

* Create Technician Profile
* Manage Services
* Manage Availability
* Accept/Decline Booking Requests
* View Assigned Bookings

### Services

* Create Service
* Update Service
* Delete Service
* Get All Services
* Get Single Service
* Search & Filter Services

### Categories

* Create Category
* Update Category
* Delete Category
* Get Categories

### Availability

* Create Available Time Slots
* Update Availability
* Delete Availability
* Prevent Overlapping Slots

### Bookings

* Create Booking Request
* Accept / Decline Booking
* Cancel Booking
* Complete Booking
* View Booking History

### Payments

* Stripe Checkout Session
* Stripe Webhook Integration
* Payment Verification
* Payment History

### Reviews

* Create Review
* Update Review
* Delete Review
* Calculate Average Rating

### Admin

* Manage Users
* Manage Services
* Manage Bookings
* Manage Payments

---

## 🛠 Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* bcrypt
* Stripe
* Zod
* Cookie Parser

---

## 📂 Project Structure

```text
src/
│
├
├── modules/
│   ├── auth/
│   ├── user/
│   ├── technician/
│   ├── category/
│   ├── service/
│   ├── availability/
│   ├── booking/
│   ├── payment/
│   └── review/
│
├── middlewares/
├── routes/
├── utils/
├── config/
└── errors/
│
├── prisma/
└── server.ts
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

---

## 📚 API Modules

* Authentication
* Users
* Technician
* Categories
* Services
* Availability
* Bookings
* Payments
* Reviews

---

## 🔄 Booking Workflow

```text
Customer
    │
    ▼
Create Booking Request
    │
    ▼
Technician Accepts
    │
    ▼
Stripe Checkout
    │
    ▼
Payment Success
    │
    ▼
Booking In Progress
    │
    ▼
Service Completed
    │
    ▼
Customer Leaves Review
```

---

## 🔒 Security

* JWT Authentication
* Role-Based Authorization
* Password Hashing
* Request Validation
* Ownership Verification
* Secure Stripe Webhooks
* Centralized Error Handling

---

## 📦 Main Dependencies

* express
* typescript
* prisma
* @prisma/client
* jsonwebtoken
* bcrypt
* stripe
* cookie-parser
* cors
* dotenv

---

## 👨‍💻 Author

**Soheb Akhter Badhan**

GitHub: https://github.com/sohebakhter/Fix-It-Now-Backend.git

LinkedIn: https://www.linkedin.com/in/soheb-akhter
