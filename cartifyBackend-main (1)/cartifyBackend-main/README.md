# E-Commerce Backend (Express + TypeScript)

Small, modular e‑commerce backend (JWT auth, role-based access, Cloudinary uploads, cart → checkout → orders, mock payments).

---

## Quick Start

1. Install
    ```sh
    npm install
    ```
2. Copy env
    ```sh
    cp .env.example .env
    ```
   Required env variables (examples)
    - PORT=4000
    - MONGO_URI=mongodb://localhost:27017/shop
    - JWT_SECRET=your_jwt_secret
    - JWT_EXPIRES_IN=1d
    - CLOUDINARY_CLOUD_NAME=...
    - CLOUDINARY_API_KEY=...
    - CLOUDINARY_API_SECRET=...
3. Run (dev)
    ```sh
    npm run dev
    ```
   Build / run production:
    ```sh
    npm run build
    npm start
    ```

---

## Project layout (src)
- [app.ts](http://_vscodecontentref_/0) — express setup, middleware, routes
- [server.ts](http://_vscodecontentref_/1) — server entry
- src/config/
  - db.ts — MongoDB connection
  - cloudinary.ts — Cloudinary config
- src/middlewares/
  - auth.middleware.ts — JWT auth
  - role.middleware.ts — role check (PUBLIC / USER / ADMIN / SUPER_ADMIN)
  - error.middleware.ts — centralized errors
- src/modules/
  - auth/ — signup/login, user model
  - products/ — product CRUD, Cloudinary upload
  - cart/ — user cart management
  - orders/ — checkout, order model, transaction logic
  - payments/ — mock payment flow
  - seller/ — seller onboarding & admin approvals
  - users/ — user admin controllers
- src/routes/ — route registration (admin, super, user, public)
- src/utils/ — AppError, upload helpers, etc.

---

## API Endpoints (summary)

Base prefix: /api

Authentication (PUBLIC)
- POST /api/auth/signup — create user (body: name, email, password)
- POST /api/auth/login — login (body: email, password) → returns JWT
- GET /api/auth/me — current user (Auth required)

Products
- GET /api/products — list products (public; query: page, limit, q, category)
- GET /api/products/:id — get product detail (public)
- POST /api/products — create product (multipart/form-data; ADMIN/SELLER)
- PUT /api/products/:id — update product (ADMIN/SELLER)
- DELETE /api/products/:id — delete product (ADMIN/SELLER)

Cart (USER)
- GET /api/cart — get current user's cart
- POST /api/cart — add item to cart (body: productId, qty)
- PUT /api/cart — update cart item (body: productId, qty)
- DELETE /api/cart/:productId — remove item

Orders (USER)
- POST /api/orders/checkout — checkout current cart → creates order (initiates transaction)
- GET /api/orders — list user's orders
- GET /api/orders/:id — order detail

Payments
- POST /api/payments/confirm — mock payment confirm (body: orderId, status) — marks order PAID/FAILED

Seller
- POST /api/seller/apply — user applies to become seller (USER)
- GET /api/seller — (ADMIN/SUPER_ADMIN) list seller applications
- POST /api/seller/:id/approve — (SUPER_ADMIN) approve seller → update user role

Users & Admin
- GET /api/users — (ADMIN/SUPER_ADMIN) list users
- GET /api/users/:id — (ADMIN/SUPER_ADMIN) user detail
- PATCH /api/users/:id/role — (SUPER_ADMIN) change role

Super / Admin routes (management)
- Routes under /api/super or /api/admin for elevated workflows (approve sellers, manage products/users)

Notes:
- Endpoints that modify resources require Authorization: Bearer <token>.
- Role checks enforced by role.middleware.

---

## How to test

Using curl / HTTP client (replace host/port and tokens):

1. Signup
    ```sh
    curl -X POST http://localhost:4000/api/auth/signup \
      -H "Content-Type: application/json" \
      -d '{"name":"Alice","email":"a@ex.com","password":"pass123"}'
    ```

2. Login → get token
    ```sh
    curl -X POST http://localhost:4000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"a@ex.com","password":"pass123"}'
    ```
    Save token from response: TOKEN="ey..."

3. Create product (multipart, ADMIN/SELLER)
    ```sh
    curl -X POST http://localhost:4000/api/products \
      -H "Authorization: Bearer $TOKEN" \
      -F "name=Sample Product" \
      -F "price=19.99" \
      -F "stock=10" \
      -F "image=@/path/to/file.jpg"
    ```

4. Add to cart (USER)
    ```sh
    curl -X POST http://localhost:4000/api/cart \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"productId":"<id>","qty":2}'
    ```

5. Checkout
    ```sh
    curl -X POST http://localhost:4000/api/orders/checkout \
      -H "Authorization: Bearer $TOKEN"
    ```

6. Confirm payment (mock)
    ```sh
    curl -X POST http://localhost:4000/api/payments/confirm \
      -H "Content-Type: application/json" \
      -d '{"orderId":"<orderId>","status":"SUCCESS"}'
    ```

Use Postman or Insomnia to build requests, add Bearer token to Authorization header.

---

## Notes & Troubleshooting

- Cloudinary: image upload requires valid Cloudinary credentials in env.
- DB transactions: ensure MongoDB replica set or transaction support for checkout flows. For local dev, use a single-node replica set or disable transactions if not available.
- Logs & errors are printed to server console; see src/middlewares/error.middleware.ts.

---

## Where to look (key files)
- src/modules/auth/auth.routes.ts, auth.service.ts
- src/modules/products/product.routes.ts, product.service.ts
- src/modules/cart/cart.routes.ts, cart.service.ts
- src/modules/orders/order.routes.ts, order.service.ts
- src/modules/payments/payment.routes.ts, payment.service.ts
- src/modules/seller/seller.routes.ts, seller.service.ts
- src/middlewares/* (auth, role, error)

If you want, I can generate a full API reference by reading each route file and producing exact method signatures and request/response schemas.