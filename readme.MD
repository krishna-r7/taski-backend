# 🎟️ Ticket Booking & Wallet Management System - Backend

A scalable backend application built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose** for managing event ticket bookings, wallet payments, and an admin dashboard.

---

## 🚀 Features

### 👤 Authentication

- User Registration
- User Login
- JWT Authentication
- Role-based Authorization (User/Admin)

---

### 💰 Wallet

- Add Money using Razorpay
- Verify Razorpay Payment
- Wallet Balance
- Wallet Transaction History
- Transaction Ledger

---

### 🎫 Event Management

- Create Event
- Update Event
- Delete Event
- List All Events
- Upcoming Events
- Event Names
- View Event Details

---

### 💺 Seat Management

- Bulk Seat Creation
- View Seat Availability
- Reserve Seats (5 Minutes)
- Seat Status
  - Available
  - Reserved
  - Booked

---

### 📖 Booking

- Reserve Seats
- Confirm Booking
- Booking History
- Booking Details
- Cancel Booking
- Refund Booking

---

### 👨‍💼 Admin

- Manage Events
- Manage Seats
- View All Bookings
- View Wallet Transactions
- Refund Wallet
- Cancel Bookings

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Razorpay
- Express Rate Limit
- Bcrypt
- Dotenv

---

## 📁 Project Structure

```
src
│
├── api
│   ├── booking
│   ├── event
│   ├── seat
│   ├── user
│   └── wallet
│
├── config
│
├── middleware
│
│
├── db
│
└── index.ts
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate to project

```bash
cd taski-backend
```

Install dependencies

```bash
npm install
```

---

## 📦 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

APP_NAME=Taski

MONGO_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

---

## ▶️ Run Project

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

---

# 🔗 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/users/signup` |
| POST | `/api/users/login` |
| GET | `/api/users/profile` |

---

## Wallet

| Method | Endpoint |
|---------|----------|
| POST | `/api/wallet/create-order` |
| POST | `/api/wallet/verify-payment` |
| GET | `/api/wallet/balance` |
| GET | `/api/wallet/transactions` |
| GET | `/api/wallet/transactions/all` |

---

## Events

| Method | Endpoint |
|---------|----------|
| POST | `/api/events` |
| GET | `/api/events` |
| GET | `/api/events/upcoming` |
| GET | `/api/events/names` |
| GET | `/api/events/:id` |
| PUT | `/api/events/:id` |
| DELETE | `/api/events/:id` |
| GET | `/api/events/:id/seats` |

---

## Bookings

| Method | Endpoint |
|---------|----------|
| POST | `/api/bookings/reserve` |
| POST | `/api/bookings/confirm` |
| GET | `/api/bookings` |
| GET | `/api/bookings/admin` |
| GET | `/api/bookings/:id` |
| PUT | `/api/bookings/:id/cancel` |
| PUT | `/api/bookings/:id/refund` |

---

# 🔐 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- Razorpay Signature Verification
- MongoDB Transactions
- Idempotent APIs

---

# ⚡ Concurrency Handling

The application prevents:

- Double Booking
- Double Spending
- Duplicate Payment Requests
- Wallet Race Conditions

---

# 💳 Payment Flow

```
User

↓

Create Razorpay Order

↓

Complete Payment

↓

Verify Razorpay Signature

↓

MongoDB Transaction

├── Credit Wallet
├── Create Wallet Transaction
└── Commit Transaction
```

---

# 🎟️ Booking Flow

```
Select Event

↓

Select Seats

↓

Reserve Seats

↓

Wallet Payment

↓

Confirm Booking

↓

Booking Created
```

---

# 📌 Future Improvements

- Email Notifications
- QR Code Tickets
- Real-time Seat Updates using Socket.IO
- Redis for Reservation Locks
- Docker Support
- Unit & Integration Tests

---

# 👨‍💻 Author

**Krishnaraj R**

Full Stack Developer

Node.js | Express.js | TypeScript | React | MongoDB