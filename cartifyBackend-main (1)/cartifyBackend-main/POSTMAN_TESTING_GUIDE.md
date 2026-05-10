# Postman Testing Guide (Server)

## 1) Start Server

```bash
npm install
npm run build
npm run dev
```

Base URL:

```text
http://localhost:5000/api
```

Health check:

- `GET /`
- URL: `http://localhost:5000/`
- Expected: `200` with `{"success": true, "message": "Server is running successfully!"}`

## 2) Required Environment Variables

Set these in `.env` before starting:

- `PORT` (example `5000`)
- `NODE_ENV` (`development` | `test` | `production`)
- `MONGO_URI`
- `JWT_ACCESS_SECRET` (min 16 chars)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CORS_ORIGIN` (optional, comma-separated)

## 3) Postman Environment Variables

Create these Postman variables:

- `baseUrl` = `http://localhost:5000/api`
- `userToken`
- `adminToken`
- `superToken`
- `productId`
- `orderId`
- `paymentId`
- `sellerRequestId`
- `userId`

Set auth header for protected requests:

```text
Authorization: Bearer {{userToken}}
```

(or `{{adminToken}}`, `{{superToken}}`)

## 4) Auth Endpoints

Note: Both endpoints work:

- `POST {{baseUrl}}/auth`
- `POST {{baseUrl}}/public/auth`

### Register User

`POST {{baseUrl}}/auth`

```json
{
  "mode": "register",
  "name": "User One",
  "email": "user1@test.com",
  "password": "Password123"
}
```

Expected: `200`, returns `data.token` and `data.user`.

### Login User

```json
{
  "mode": "login",
  "email": "user1@test.com",
  "password": "Password123"
}
```

Save `data.token` into `userToken`.

Repeat similarly for admin and super admin accounts. If needed, promote role using super admin endpoint in section 10.

## 5) Product Endpoints

### Public Product List

- `GET {{baseUrl}}/products?page=1&limit=10&search=&category=`
- Also available at `GET {{baseUrl}}/public/products`

Expected: `200`, `data.products[]` and `data.pagination`.

### Create Product (Admin/Super Admin)

- `POST {{baseUrl}}/products`
- Auth: `adminToken` or `superToken`
- Body: `form-data`

Fields:

- `title` (text)
- `brand` (text)
- `sku` (text, unique)
- `category` (`Electronics|Fashion|Home|Books|Other`)
- `description` (text)
- `mrp` (number)
- `sellingPrice` (number)
- `quantity` (integer)
- `images` (file, optional, can add multiple)

Expected: `201`, returns created product. Save `_id` to `productId`.

### My Products

- `GET {{baseUrl}}/products/my`
- Auth: admin/super

### Update Product

- `PATCH {{baseUrl}}/products/{{productId}}`
- Auth: admin/super

```json
{
  "sellingPrice": 999,
  "quantity": 8
}
```

### Delete Product (soft delete)

- `DELETE {{baseUrl}}/products/{{productId}}`
- Auth: admin/super

## 6) Cart Endpoints (USER role)

### Add to Cart

- `POST {{baseUrl}}/user/cart`
- Auth: user

```json
{
  "productId": "{{productId}}"
}
```

### Get Cart

- `GET {{baseUrl}}/cart`
- Auth: user

### Update Quantity

- `PATCH {{baseUrl}}/cart/{{productId}}`
- Auth: user

```json
{
  "quantity": 2
}
```

### Remove Item

- `DELETE {{baseUrl}}/cart/{{productId}}`
- Auth: user

## 7) Order Endpoints

### Checkout (from cart)

Use one of:

- `POST {{baseUrl}}/orders`
- `POST {{baseUrl}}/user/checkout` (legacy path)

Auth: user/admin/super (normally user)

```json
{
  "address": {
    "fullName": "User One",
    "address": "221B Baker Street",
    "city": "Mumbai",
    "pincode": "400001"
  }
}
```

Expected: `201`, status `PENDING`. Save `_id` to `orderId`.

### My Orders

Use one of:

- `GET {{baseUrl}}/orders`
- `GET {{baseUrl}}/user/orders` (legacy path)

### Seller Orders (admin)

- `GET {{baseUrl}}/orders/seller`
- Auth: admin

### Update Order Status (admin/super)

Use one of:

- `PATCH {{baseUrl}}/orders/{{orderId}}/status`
- `PATCH {{baseUrl}}/admin/orders/{{orderId}}/status`

```json
{
  "status": "PAID"
}
```

Allowed transitions:

- `PENDING -> PAID | CANCELLED`
- `PAID -> SHIPPED | CANCELLED`
- `SHIPPED -> DELIVERED`

## 8) Payment Endpoints

### Create Payment

Use one of:

- `POST {{baseUrl}}/payments/create`
- `POST {{baseUrl}}/user/payments/create` (legacy path)

```json
{
  "orderId": "{{orderId}}"
}
```

Expected: payment with status `CREATED`. Save `_id` to `paymentId`.

### Confirm Payment

Use one of:

- `POST {{baseUrl}}/payments/confirm`
- `POST {{baseUrl}}/user/payments/confirm` (legacy path)

```json
{
  "paymentId": "{{paymentId}}"
}
```

Expected:

- `SUCCESS` or `FAILED` (mock random)
- If success, order becomes `PAID`

## 9) Review Endpoints

### Add Review (USER)

- `POST {{baseUrl}}/products/{{productId}}/reviews`
- Auth: user

```json
{
  "rating": 5,
  "comment": "Great product"
}
```

### List Reviews

- `GET {{baseUrl}}/products/{{productId}}/reviews`

## 10) Seller Request + Super Admin Endpoints

### User Applies as Seller

- `POST {{baseUrl}}/seller/apply`
- Auth: user

```json
{
  "storeName": "User Store",
  "sellerType": "individual",
  "address": "MG Road",
  "city": "Bengaluru",
  "pincode": "560001"
}
```

### User Checks Seller Status

- `GET {{baseUrl}}/seller/status`
- Auth: user/admin

### Super Admin List Users

- `GET {{baseUrl}}/super/users`
- Auth: super

### Super Admin Update Role

- `PATCH {{baseUrl}}/super/users/role`
- Auth: super

```json
{
  "userId": "<targetUserId>",
  "role": "ADMIN"
}
```

### Super Admin Block/Unblock User

- `PATCH {{baseUrl}}/super/users/block/<targetUserId>`
- Auth: super

### Super Admin Seller Requests

- `GET {{baseUrl}}/super/seller-requests`
- Auth: super

- `PATCH {{baseUrl}}/super/seller-requests/<sellerRequestId>`

```json
{
  "status": "APPROVED"
}
```

(or `REJECTED`)

## 11) Suggested End-to-End Test Order

1. Register/login `super`, `admin`, `user`.
2. Promote roles if needed via `super/users/role`.
3. Admin creates product, store `productId`.
4. User adds to cart, updates qty, checks cart.
5. User checkout, store `orderId`.
6. User create payment + confirm payment, store `paymentId`.
7. Verify order status in my orders.
8. User posts review, verify list.
9. User applies seller, super approves.
10. Admin tests seller order view and order status transitions.

## 12) Common Errors You May See

- `401 Unauthorized`: Missing/invalid bearer token.
- `403 Forbidden`: Role mismatch or blocked user.
- `400 Validation failed`: Invalid payload/fields.
- `404 Not found`: Wrong ID or route.
- `409 Duplicate field value`: unique field conflict (e.g., email/sku/payment index).

## 13) Route Summary

Public:

- `GET /`
- `POST /api/auth`
- `POST /api/public/auth`
- `GET /api/products`
- `GET /api/public/products`
- `GET /api/products/:productId/reviews`

Protected:

- Cart: `/api/cart*`
- Orders: `/api/orders*` and `/api/user/orders*` legacy
- Payments: `/api/payments*` and `/api/user/payments*` legacy
- Admin: `/api/admin/*`
- Super admin: `/api/super/*`
- Seller apply/status: `/api/seller/*`
- Reviews create: `POST /api/products/:productId/reviews`
