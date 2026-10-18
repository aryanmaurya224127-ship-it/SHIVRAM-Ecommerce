# SHIVRAM Coins

- Earn 5% of the amount payable after coin redemption as SHIVRAM Coins.
- 1 SHIVRAM Coin = ₹1.
- At Product Detail checkout, enter the number of coins to redeem. The UI caps redemption to the wallet balance and order total; the backend independently validates available balance and deducts coins atomically.
- The saved order records `originalAmount`, `coinsUsed`, `coinsEarned`, and final `totalAmount` (amount payable after coins).
- The wallet endpoint is `GET /api/orders/wallet/:userId`.
- Coins are credited after order save; if order save fails after deduction, the backend attempts to restore the deducted coins.

Note: this is a store loyalty wallet, not cash or a UPI/bank balance. UPI payment collection still needs a real payment gateway integration; coin redemption only reduces the order amount due.

## My Account page
- Added protected `/MyAccount` page with the signed-in user's profile details, active account status, current coin balance, and shortcuts to My Orders and product browsing.
- Added My Account and My Orders shortcuts to the logged-in profile dropdown.
- Profile and coin values are read from the signed-in user object stored by the existing authentication flow.
