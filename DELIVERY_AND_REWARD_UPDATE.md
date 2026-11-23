# Delivery Date & SHIVRAM Coin Reward Update

## Expected delivery date
- New orders receive an expected delivery date five calendar days after placement.
- Admins can edit the date from Admin Dashboard → Orders → Expected Delivery.
- Customers can see the expected date in My Orders and on the order confirmation page.
- My Orders refreshes order data every 15 seconds.
- Older orders without a stored expected date display a fallback of order date + five days.

## SHIVRAM Coins
- Checkout now deducts only coins redeemed by the customer.
- Reward coins are stored as pending on the order and are not added to the wallet at order placement.
- Admin can configure the reward percentage in Admin Dashboard → Settings (0%–20%, default 5%).
- The percentage is snapshotted on each new order. Changing the setting affects only future orders.
- When an eligible order is marked Delivered, its reward is credited once.
- Cancelled orders cannot be reopened or delivered and do not receive reward coins.
- Older orders without a saved reward percentage are treated as legacy orders and are not credited again, because the previous checkout flow may already have awarded their coins.

## Manual verification
1. Place a new order and check that the wallet does not increase by the pending reward.
2. Confirm My Orders shows the expected delivery date and pending coins.
3. Change the admin reward percentage and place another order; verify the first order's saved reward amount does not change.
4. In Admin Dashboard → Orders, edit the expected delivery date and verify it appears in My Orders.
5. Mark an eligible order Delivered. Verify the customer's wallet increases by the order's saved reward exactly once.
6. Try to deliver a cancelled order; the backend should reject it.
