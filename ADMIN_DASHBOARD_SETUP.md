# SHIVRAM E-Commerce Admin Dashboard

## Features added

- Admin-only `/AdminDashboard` route.
- Overview cards for revenue, orders, pending orders, product count and customer count.
- Recent orders list.
- Product catalogue management: add, edit, delete, category, price, discount, image URL and description.
- Order management: inspect order/customer/payment details and update order status.
- Customer directory with profile, contact, location, coin balance and join date.
- Customer review overview.
- Search/filter for products, orders, customers and reviews.
- Admin API routes protected by JWT authentication and database-backed `role === "admin"` checks.

## One-time admin setup

1. Start the backend and ensure `backend/.env` has `MONGODB_URI` and `JWT_SECRET`.
2. Register a normal account in the app first.
3. Open a terminal in the `backend` folder and run:

   ```bash
   node Scripts/promoteAdmin.js your-registered-email@example.com
   ```

4. Log out from the website and log in again using that account. The login response now includes the user's role.
5. Open `/AdminDashboard` or choose **Admin Dashboard** from the profile dropdown.

Do not make a public registration form that accepts a `role` field. Admin access is assigned through the backend script and checked again on every admin API request.

## API routes

All routes below are mounted under `/api/admin` and require a valid Bearer token for an admin account.

- `GET /summary`
- `GET /products`
- `POST /products`
- `PUT /products/:productId`
- `DELETE /products/:productId`
- `GET /orders`
- `PATCH /orders/:orderId/status`
- `GET /customers`
- `GET /reviews`

Supported order statuses: `Order Placed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`.

## Environment / deployment note

The frontend uses `VITE_API_URL` when set and otherwise falls back to `http://localhost:5000`. For a deployed frontend, configure `VITE_API_URL` to the deployed backend's base URL and redeploy the frontend. Never commit `.env` files or database credentials.
