# BulkBridge — Professional B2B Agri Marketplace

BulkBridge connects farmers and bulk buyers through a role-based marketplace for produce discovery, orders and direct communication.

## What is included in this final build

### 1. Security foundation
- bcrypt password hashing (12 rounds)
- JWT authentication with 7-day expiry
- protected API routes and role authorization
- ownership checks for profiles, produce and orders
- automatic migration of old plain-text passwords on successful legacy login
- password values are never returned by API responses

### 2. Profile and account management
- real MongoDB profile data
- editable farmer/business information
- saved settings
- persistent language preference
- local notification preferences

### 3. Produce marketplace
- create, edit and delete listings
- category, description, image URL, grade, location, harvest date
- quantity, unit, minimum order and price
- availability status
- buyer search, category, location and sorting filters
- professional marketplace cards and detail page

### 4. Orders
- atomic stock deduction when placing an order
- minimum order validation
- farmer workflow: Pending → Accepted → Processing → Ready for Pickup → Completed
- buyer cancellation
- farmer rejection
- stock restoration after cancellation/rejection
- buyer/farmer order history
- notifications for order events

### 5. Real messaging
- MongoDB-backed conversations
- farmer ↔ buyer messages
- unread counts
- read tracking
- direct message button from produce details

### 6. Notifications
- database-backed notifications
- unread count
- notification dropdown
- mark individual/all as read
- order and message notifications

### 7. Forgot password
- secure random reset token
- SHA-256 token storage
- 15-minute expiry
- one-time token use
- bcrypt password reset
- optional SMTP email delivery
- safe local development reset-link mode

### 8. Admin control center
- admin role
- platform statistics
- user management
- activate/suspend users
- order overview
- contact-message overview

### 9. UX improvements
- responsive marketplace cards
- professional order cards
- loading and empty states
- inline errors and success messages
- password visibility control
- 404 page
- no hard-coded localhost URLs in page components
- centralized API client

### 10. Production-readiness foundation
- environment variables
- configurable client/API URL
- CORS allow-list
- backend health endpoint
- validation and error handling
- indexes for commonly queried MongoDB fields
- `.gitignore` excludes environment secrets

## Run locally

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection

### Terminal 1 — Backend

```bash
cd Backend
npm install
```

Copy `Backend/.env.example` to `Backend/.env` and set at least:

```env
MONGO_URI=mongodb://127.0.0.1:27017/bulkbridge
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
DEV_RESET_MODE=true
```

Then run:

```bash
npm run dev
```

### Terminal 2 — Frontend

```bash
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Forgot password

The Forgot Password page is available from Login.

### Local development

With `DEV_RESET_MODE=true`, if SMTP is not configured, the UI shows a development-only reset link after requesting a reset. This keeps the feature usable without exposing reset tokens in production.

### Real email delivery

Configure these in `Backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
MAIL_FROM=your-email@gmail.com
```

For Gmail, use an **App Password**, not your normal Google account password.

Set `DEV_RESET_MODE=false` for production.

## Create the first admin

Set a strong bootstrap key in `Backend/.env`:

```env
ADMIN_BOOTSTRAP_KEY=your-random-bootstrap-key
```

Start the backend and send a POST request to:

```text
POST http://localhost:5000/api/users/admin/bootstrap
Header: x-admin-bootstrap-key: your-random-bootstrap-key
Content-Type: application/json
```

Body:

```json
{
  "name": "BulkBridge Admin",
  "phone": "9876543210",
  "email": "admin@example.com",
  "password": "change-this-password"
}
```

After creating the admin, remove or rotate `ADMIN_BOOTSTRAP_KEY`.

## Important security notes

- Never commit `.env` files.
- Never use a real password as `JWT_SECRET`.
- Do not enable `DEV_RESET_MODE` in production.
- Use HTTPS and secure hosting before deploying publicly.
- The current app stores JWTs in localStorage for simplicity. For a production deployment, consider moving authentication to secure, HttpOnly cookies.

## Test checklist

1. Signup farmer
2. Confirm password is bcrypt-hashed in MongoDB
3. Login with correct password
4. Confirm wrong password is rejected
5. Open farmer dashboard
6. Add produce
7. Edit produce
8. Login as buyer in another account
9. Browse/filter produce
10. Place an order
11. Confirm stock decreases
12. Confirm farmer receives notification
13. Accept → Processing → Ready for Pickup → Completed
14. Confirm buyer sees status changes
15. Open Messages and send a message
16. Open Forgot Password
17. Reset password using local development link or SMTP email
18. Login with the new password
19. Test mobile/responsive layout
20. Test logout and protected routes
