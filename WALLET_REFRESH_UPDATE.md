# My Account Wallet Refresh

- My Account loads the latest SHIVRAM Coins balance from `GET /api/orders/wallet/:userId` when the page opens.
- The Refresh balance button requests the wallet again and shows loading/error/last-updated feedback.
- The refreshed balance is saved to the existing `shivram_user` local storage entry and AuthContext so the navbar reflects the new balance without re-login.
- The backend must be running and connected to MongoDB for live balance refresh to work.
- Frontend API URL can be configured with `VITE_API_URL`; it defaults to `http://localhost:5000`.
