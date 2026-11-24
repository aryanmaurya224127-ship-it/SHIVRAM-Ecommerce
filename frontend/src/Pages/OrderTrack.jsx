
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../Layout/MainLayout.jsx";
import "../Style/OrderTrack.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://shivram-backend.onrender.com";

const DELIVERY_STEPS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderTrack = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, token } = useAuth();

  const userId = user?._id || user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(
    async (showLoader = false) => {
      if (!userId) return;

      if (showLoader) setLoading(true);
      else setRefreshing(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Orders load nahi ho paye."
          );
        }

        const orderList = Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : [];

        // Delivered aur Cancelled orders bhi list mein rahenge.
        setOrders(orderList);
        setError("");
      } catch (err) {
        console.error("Order fetch error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId, token]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login", {
        state: { from: "/OrderTrack" },
        replace: true,
      });
      return;
    }

    if (!userId) return;

    fetchOrders(true);

    // Automatically refresh order status every 15 seconds.
    const intervalId = setInterval(() => {
      fetchOrders(false);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, userId, navigate, fetchOrders]);

  const handleRefresh = () => {
    fetchOrders(false);
  };

  const getStatusIndex = (status) => {
    return DELIVERY_STEPS.indexOf(status);
  };

  const renderDeliveryTracker = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="ot-cancelled">
          <div className="ot-cancelled-icon">✕</div>
          <div>
            <h4>Order Cancelled</h4>
            <p>
              This order has been cancelled and will not be
              delivered.
            </p>
          </div>
        </div>
      );
    }

    const activeIndex = Math.max(0, getStatusIndex(status));

    return (
      <div className="ot-tracker">
        <div className="ot-tracker-heading">
          <h4>Delivery Progress</h4>
          <span className="ot-current-status">{status || "Order Placed"}</span>
        </div>

        <div className="ot-timeline">
          {DELIVERY_STEPS.map((step, index) => {
            const completed = index < activeIndex;
            const current = index === activeIndex;
            const isDone = completed || (status === "Delivered" && index === 4);

            return (
              <div
                className={`ot-step ${
                  isDone ? "completed" : ""
                } ${current ? "current" : ""}`}
                key={step}
              >
                <div className="ot-step-marker">
                  {isDone ? "✓" : index + 1}
                </div>

                <div className="ot-step-label">{step}</div>
              </div>
            );
          })}
        </div>

        {status === "Delivered" && (
          <div className="ot-delivered-message">
            <span>✓</span>
            Your order has been successfully delivered!
          </div>
        )}
      </div>
    );
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <MainLayout>
      <div className="order-track-page">
        <div className="ot-container">
          <div className="ot-page-header">
            <div>
              <p className="ot-eyebrow">SHIVRAM E-COMMERCE</p>
              <h1>My Orders</h1>
              <p className="ot-subtitle">
                Track your orders and check their delivery progress.
              </p>
            </div>

            <button
              className="ot-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span className={refreshing ? "ot-spinning" : ""}>↻</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="ot-auto-refresh">
            <span className="ot-live-dot"></span>
            Order status automatically updates every 15 seconds.
          </div>

          {error && (
            <div className="ot-error">
              <span>⚠</span>
              {error}
              <button onClick={() => fetchOrders(true)}>
                Try Again
              </button>
            </div>
          )}

          {loading ? (
            <div className="ot-loading">
              <div className="ot-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="ot-empty">
              <div className="ot-empty-icon">🛍️</div>
              <h2>No Orders Yet</h2>
              <p>
                You haven't placed any orders yet. Start shopping
                to see your orders here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="ot-shop-btn"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="ot-order-count">
                <h2>Your Orders</h2>
                <span>{orders.length} Orders</span>
              </div>

              <div className="ot-orders-list">
                {orders.map((order) => {
                  const status = order.orderStatus || "Order Placed";
                  const isCancelled = status === "Cancelled";
                  const isDelivered = status === "Delivered";

                  return (
                    <article
                      className="ot-order-card"
                      key={order._id || order.orderId}
                    >
                      <div className="ot-order-header">
                        <div>
                          <span className="ot-order-label">
                            ORDER ID
                          </span>
                          <h3>{order.orderId || order._id}</h3>
                          <p>{formatDate(order.createdAt)}</p>
                        </div>

                        <span
                          className={`ot-status-badge ${
                            isDelivered
                              ? "delivered"
                              : isCancelled
                              ? "cancelled"
                              : "active"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {renderDeliveryTracker(status)}

                      <div className="ot-section-title">
                        <h4>Ordered Products</h4>
                      </div>

                      <div className="ot-products">
                        {(order.items || []).map((item, index) => (
                          <div
                            className="ot-product"
                            key={`${item.productId || item.title}-${index}`}
                          >
                            <div className="ot-product-image">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title || "Product"}
                                />
                              ) : (
                                <span>📦</span>
                              )}
                            </div>

                            <div className="ot-product-info">
                              <h5>{item.title || "Product"}</h5>
                              <p>Quantity: {item.quantity || 1}</p>
                            </div>

                            <div className="ot-product-price">
                              {formatPrice(
                                Number(item.price || 0) *
                                  Number(item.quantity || 1)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="ot-order-details">
                        <div className="ot-detail-box">
                          <h4>Delivery Address</h4>
                          <p>
                            <strong>
                              {order.shippingDetails?.fullName}
                            </strong>
                          </p>
                          <p>{order.shippingDetails?.phone}</p>
                          <p>
                            {order.shippingDetails?.address}
                            {order.shippingDetails?.city
                              ? `, ${order.shippingDetails.city}`
                              : ""}
                            {order.shippingDetails?.state
                              ? `, ${order.shippingDetails.state}`
                              : ""}
                            {order.shippingDetails?.pincode
                              ? ` - ${order.shippingDetails.pincode}`
                              : ""}
                          </p>
                        </div>

                        <div className="ot-detail-box">
                          <h4>Payment Details</h4>
                          <p>
                            Payment Method:{" "}
                            <strong>
                              {order.paymentMethod ||
                                order.shippingDetails?.paymentMethod ||
                                "Not available"}
                            </strong>
                          </p>
                          <p>
                            Payment Status:{" "}
                            <strong>
                              {order.paymentStatus || "Pending"}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="ot-order-footer">
                        <div>
                          <span>Total Amount</span>
                          <strong>
                            {formatPrice(order.totalAmount)}
                          </strong>
                        </div>

                        <span
                          className={`ot-footer-status ${
                            isDelivered
                              ? "success"
                              : isCancelled
                              ? "danger"
                              : ""
                          }`}
                        >
                          {isDelivered
                            ? "✓ Delivered"
                            : isCancelled
                            ? "✕ Cancelled"
                            : "● In Progress"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderTrack;
