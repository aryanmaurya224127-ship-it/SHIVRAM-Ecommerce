import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout.jsx";
import "../Style/OrderConfirmation.css";

function OrderPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <MainLayout>
        <main className="order-confirmation empty-confirmation">
          <h2>No recent order details found</h2>
          <p>You can view placed orders from your account.</p>
          <button type="button" onClick={() => navigate("/MyOrders")}>View my orders</button>
          <button type="button" className="secondary-confirmation-button" onClick={() => navigate("/")}>Continue shopping</button>
        </main>
      </MainLayout>
    );
  }

  const isPaid = order.paymentStatus === "PAID";
  const items = Array.isArray(order.items) ? order.items : [];
  const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();

  return (
    <MainLayout>
      <main className="order-confirmation">
        <section className="confirmation-hero">
          <div className="confirmation-check">✓</div>
          <p className="confirmation-eyebrow">SHIVRAM ORDER CONFIRMATION</p>
          <h1>Thank you for your order!</h1>
          <p>{isPaid ? "Your payment has been verified and your order is confirmed." : "Your Cash on Delivery order has been placed successfully."}</p>
          <div className="confirmation-order-id">Order ID <strong>{order.orderId}</strong></div>
          <span className={`payment-status-pill ${isPaid ? "paid" : "cod"}`}>{isPaid ? "Payment successful" : "Cash on Delivery"}</span>
        </section>

        <div className="confirmation-grid">
          <section className="confirmation-card">
            <div className="confirmation-card-heading"><h2>Items ordered</h2><span>{items.length} product(s)</span></div>
            {items.map((item) => (
              <div className="confirmed-item" key={item.productId}>
                <img src={item.image} alt={item.title} />
                <div className="confirmed-item-info"><strong>{item.title}</strong><small>Quantity: {item.quantity}</small><small>Unit price: {formatMoney(item.price)}</small></div>
                <b>{formatMoney(Number(item.price) * Number(item.quantity))}</b>
              </div>
            ))}
            <div className="confirmed-total"><span>Amount paid / payable</span><strong>{formatMoney(order.totalAmount)}</strong></div>
            {Number(order.coinsUsed) > 0 && <p className="confirmed-coins">SHIVRAM Coins redeemed: {order.coinsUsed} (−{formatMoney(order.coinsUsed)})</p>}
            {Number(order.coinsEarned) > 0 && <p className="confirmed-coins">Coins earned: {order.coinsEarned}</p>}
          </section>

          <section className="confirmation-card">
            <h2>Delivery details</h2>
            <div className="delivery-details">
              <strong>{order.shippingDetails?.fullName}</strong>
              <p>{order.shippingDetails?.address}</p>
              <p>{order.shippingDetails?.city}, {order.shippingDetails?.state} – {order.shippingDetails?.pincode}</p>
              <p>Phone: {order.shippingDetails?.phone}</p>
            </div>
            <h2 className="payment-detail-heading">Payment details</h2>
            <div className="payment-detail-row"><span>Method</span><strong>{order.paymentMethod || order.shippingDetails?.paymentMethod || "Cash on Delivery"}</strong></div>
            <div className="payment-detail-row"><span>Status</span><strong>{isPaid ? "Paid" : "Pay on delivery"}</strong></div>
            {order.razorpayPaymentId && <div className="payment-detail-row"><span>Payment reference</span><strong className="reference-id">{order.razorpayPaymentId}</strong></div>}
            <div className="payment-detail-row"><span>Order date</span><strong>{createdAt.toLocaleString("en-IN")}</strong></div>
            <div className="payment-detail-row"><span>Order status</span><strong>{order.orderStatus || "Order Placed"}</strong></div>
          </section>
        </div>

        <div className="confirmation-actions">
          <button type="button" onClick={() => navigate("/MyOrders")}>Track / view orders</button>
          <button type="button" className="secondary-confirmation-button" onClick={() => navigate("/")}>Continue shopping</button>
        </div>
      </main>
    </MainLayout>
  );
}

export default OrderPage;
