# MoMan - Finance Tracker

MoMan is a personal finance application designed specifically for students. It helps users track their income and expenses based on custom categories they create.

Key Features:

- Custom Categories: Organize finances with personalized labels (e.g., Food, Transport, Entertainment).
- Recurring Transactions: Automatically records repeating payments (like monthly subscriptions or allowance) into your tracking history without processing real money transfers.
- Notifications: Get alerts for important financial updates.

# Setup & Installation Guide

This guide covers setting up the database, environment, and running the project.

---

## 1. Prerequisites

Ensure the following are installed on your machine:

- Access to the source code
- A **MongoDB Atlas** account
- A Google account with an app password
- **npm**

---

## 2. MongoDB Atlas Setup

### 2.1 Create or Access a Cluster

1. Log in to **MongoDB Atlas**
2. Create a new cluster
3. Choose a region close to your location

---

### 2.2 Create a Database User

1. Go to **Database Access**
2. Add a new database user
3. Role: **Read and write to any database**
4. Save the username and password

---

### 2.3 Configure Network Access

1. Go to **Network Access**
2. Add your IP address (or 0.0.0.0/0 to allow access from anywhere)

---

### 2.4 Get the Connection String

1. Go to **Clusters → Connect → Drivers**
2. Select **Node.js**
3. Copy the connection string

Example:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## 3. Configure Environment Variables

Create a `.env` file at the project root:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority"
EMAIL_USER="<Google_username>"
EMAIL_PASS="<Google_app_password>"
NEXT_PUBLIC_BASE_URL=<base_url>
JWT_SECRET=<jwt_secret>
```

Replace:

- `<username>` – your MongoDB user
- `<password>` – your MongoDB password
- `<database>` – database name
- `<Google_username>` – your Google username
- `<Google_app_password>` – your Google app password (not your login password)
- `<base_url>` – you base url or "http://localhost:3000" (for development)
- `<jwt_secret>` – you jwt secret

---

## 4. Install Dependencies

Install project dependencies:

```bash
npm install
```

Install Prisma Client:

```bash
npm install @prisma/client
```

---

## 5. Create Database & Collections

```bash
npx prisma db push
```

This will:

- Create the database if it does not exist
- Create collections
- Apply indexes and constraints

---

## 6. Generate Prisma Client

```bash
npx prisma generate
```

Prisma Client will now be available throughout the project.

---

## 7. Populate Initial Data

```bash
npx prisma db seed
```

This will create a new admin account.

---

## 8. Start The application

```bash
npm run dev
```

The application should now run successfully at your base url.

---
