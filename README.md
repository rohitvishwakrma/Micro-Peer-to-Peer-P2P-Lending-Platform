# Micro P2P Lending Platform

## Overview
Peer-to-peer micro lending platform connecting borrowers and lenders.

## Tech Stack

Frontend
- React
- Context API
- Tailwind

Backend
- Node
- Express
- MongoDB

## Features (Week 1)

- User Authentication
- Role Based Access
- Borrower Loan Requests
- Lender Marketplace
- Protected Routes

## Installation

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Environment:

```env
MONGO_URI=
JWT_SECRET=
```

## API Endpoints

Register

POST

```http
/api/auth/register
```

Login

```http
/api/auth/login
```

Create Loan

```http
/api/loans/create
```

Marketplace

```http
/api/loans/marketplace
```

## User Roles

Borrower:
- Create loans
- Manage loans

Lender:
- View loans
- Fund loans (Week 2)

## Week 2 Coming
- Funding Engine
- Stripe Integration