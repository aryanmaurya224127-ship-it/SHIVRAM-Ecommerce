import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../Layout/MainLayout.jsx";

import "bootstrap/dist/css/bootstrap.min.css";


// =====================================================
// API URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


// =====================================================
// MY ORDERS
// =====================================================

const MyOrders = () => {

  const { user, isLoggedIn, token } = useAuth();

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ===================================================
  // GET USER ID
  // ===================================================

  const userId =
    user?._id ||
    user?.id;


  // ===================================================
  // FETCH ORDERS
  // ===================================================

  useEffect(() => {

    const fetchOrders = async () => {

      // -----------------------------------------------
      // LOGIN CHECK
      // -----------------------------------------------

      if (!isLoggedIn || !userId) {

        setLoading(false);

        setError("Please login to see your orders.");

        return;
      }


      try {

        setLoading(true);

        setError("");


        // ---------------------------------------------
        // API REQUEST
        // ---------------------------------------------

        const response = await fetch(
          `${API_BASE_URL}/api/orders/user/${userId}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        const data = await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
            "Orders fetch nahi ho paye."
          );

        }


        // ---------------------------------------------
        // SAVE ORDERS
        // ---------------------------------------------

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "My Orders Error:",
          error
        );

        setError(
          error.message ||
          "Orders load nahi ho paye."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrders();

  }, [isLoggedIn, userId, token]);


  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {

      return "N/A";

    }

  };


  // ===================================================
  // FORMAT TIME
  // ===================================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }

    try {

      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {

      return "";

    }

  };


  // ===================================================
  // PRICE FORMAT
  // ===================================================

  const formatPrice = (price) => {

    return Number(price || 0).toLocaleString(
      "en-IN"
    );

  };


  // ===================================================
  // LOGIN REDIRECT
  // ===================================================

  const handleLogin = () => {

    navigate("/Login", {
      state: {
        from: "/MyOrders",
      },
    });

  };


  // ===================================================
  // CONTINUE SHOPPING
  // ===================================================

  const handleContinueShopping = () => {

    navigate("/");

  };


  // ===================================================
  // VIEW PRODUCT
  // ===================================================

  const handleProductClick = (productId) => {

    if (!productId) {
      return;
    }

    navigate(
      `/ProductDetail/${productId}`
    );

  };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <MainLayout>

        <div
          className="container py-5"
          style={{
            minHeight: "60vh",
          }}
        >

          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            >

              <span className="visually-hidden">
                Loading...
              </span>

            </div>

            <p className="mt-3 text-muted">
              Your orders are loading...
            </p>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ===================================================
  // NOT LOGGED IN
  // ===================================================

  if (!isLoggedIn || !userId) {

    return (

      <MainLayout>

        <div
          className="container py-5"
          style={{
            minHeight: "60vh",
          }}
        >

          <div
            className="card shadow-sm border-0 mx-auto"
            style={{
              maxWidth: "600px",
            }}
          >

            <div className="card-body text-center p-5">

              <div
                style={{
                  fontSize: "60px",
                }}
              >
                🛍️
              </div>

              <h3 className="mt-3">
                Please Login
              </h3>

              <p className="text-muted">
                Login to your account to see
                your orders.
              </p>

              <button
                className="btn btn-primary px-4"
                onClick={handleLogin}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (

      <MainLayout>

        <div
          className="container py-5"
          style={{
            minHeight: "60vh",
          }}
        >

          <div
            className="alert alert-danger text-center"
            role="alert"
          >

            <h5>
              Unable to load orders
            </h5>

            <p className="mb-3">
              {error}
            </p>

            <button
              className="btn btn-outline-danger"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ===================================================
  // NO ORDERS
  // ===================================================

  if (orders.length === 0) {

    return (

      <MainLayout>

        <div
          className="container py-5"
          style={{
            minHeight: "60vh",
          }}
        >

          <div
            className="card shadow-sm border-0 mx-auto"
            style={{
              maxWidth: "650px",
            }}
          >

            <div className="card-body text-center p-5">

              <div
                style={{
                  fontSize: "70px",
                }}
              >
                📦
              </div>

              <h3 className="mt-3">
                No Orders Yet
              </h3>

              <p className="text-muted">
                You haven't placed any orders yet.
                Start shopping and your orders
                will appear here.
              </p>

              <button
                className="btn btn-primary px-4"
                onClick={
                  handleContinueShopping
                }
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </MainLayout>

    );

  }


  // ===================================================
  // ORDERS PAGE
  // ===================================================

  return (

    <MainLayout>

      <div
        className="container py-4"
        style={{
          minHeight: "70vh",
        }}
      >

        {/* ============================================
            PAGE HEADER
        ============================================ */}

        <div
          className="d-flex justify-content-between
                     align-items-center mb-4
                     flex-wrap gap-2"
        >

          <div>

            <h2 className="fw-bold mb-1">
              My Orders
            </h2>

            <p className="text-muted mb-0">
              View and track your orders
            </p>

          </div>


          <button
            className="btn btn-outline-primary"
            onClick={
              handleContinueShopping
            }
          >
            Continue Shopping
          </button>

        </div>


        {/* ============================================
            ORDER COUNT
        ============================================ */}

        <div className="mb-3">

          <span className="text-muted">
            Total Orders:{" "}
          </span>

          <strong>
            {orders.length}
          </strong>

        </div>


        {/* ============================================
            ORDER LIST
        ============================================ */}

        <div className="row">

          {orders.map((order) => (

            <div
              className="col-12 mb-4"
              key={order._id || order.orderId}
            >

              <div className="card border-0 shadow-sm">


                {/* ==================================
                    ORDER HEADER
                ================================== */}

                <div
                  className="card-header bg-white
                             border-bottom
                             py-3"
                >

                  <div
                    className="row
                               align-items-center"
                  >

                    <div className="col-md-4 mb-2 mb-md-0">

                      <small className="text-muted d-block">
                        Order ID
                      </small>

                      <strong>
                        {order.orderId ||
                          "N/A"}
                      </strong>

                    </div>


                    <div className="col-md-3 mb-2 mb-md-0">

                      <small className="text-muted d-block">
                        Order Date
                      </small>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>

                      <small className="text-muted d-block">
                        {formatTime(
                          order.createdAt
                        )}
                      </small>

                    </div>


                    <div className="col-md-3 mb-2 mb-md-0">

                      <small className="text-muted d-block">
                        Payment
                      </small>

                      <strong>
                        {order.shippingDetails
                          ?.paymentMethod ||
                          "Cash on Delivery"}
                      </strong>

                    </div>


                    <div className="col-md-2">

                      <span
                        className="badge bg-success
                                   px-3 py-2"
                      >
                        {order.orderStatus ||
                          "Order Placed"}
                      </span>

                    </div>

                  </div>

                </div>


                {/* ==================================
                    ORDER BODY
                ================================== */}

                <div className="card-body">

                  {/* --------------------------------
                      PRODUCTS
                  -------------------------------- */}

                  {Array.isArray(order.items) &&
                    order.items.map(
                      (item, index) => (

                        <div
                          key={
                            `${order._id}-${index}`
                          }
                          className="row
                                     align-items-center
                                     border-bottom
                                     pb-3 mb-3"
                        >

                          {/* PRODUCT IMAGE */}

                          <div
                            className="col-4
                                       col-md-2
                                       text-center"
                          >

                            <img
                              src={item.image}
                              alt={
                                item.title ||
                                "Product"
                              }
                              className="img-fluid"
                              style={{
                                maxHeight: "120px",
                                width: "100%",
                                objectFit: "contain",
                                cursor: item.productId
                                  ? "pointer"
                                  : "default",
                              }}
                              onClick={() =>
                                handleProductClick(
                                  item.productId
                                )
                              }
                            />

                          </div>


                          {/* PRODUCT DETAILS */}

                          <div
                            className="col-8
                                       col-md-5"
                          >

                            <h5
                              className="mb-2"
                            >
                              {item.title ||
                                "Product"}
                            </h5>

                            <p className="text-muted mb-1">

                              Product ID:{" "}

                              {item.productId ||
                                "N/A"}

                            </p>

                            <p className="mb-1">

                              Quantity:{" "}

                              <strong>
                                {item.quantity ||
                                  1}
                              </strong>

                            </p>

                          </div>


                          {/* PRICE */}

                          <div
                            className="col-6
                                       col-md-2
                                       mt-3 mt-md-0"
                          >

                            <small className="text-muted d-block">
                              Price
                            </small>

                            <strong>
                              ₹
                              {formatPrice(
                                item.price
                              )}
                            </strong>

                          </div>


                          {/* ITEM TOTAL */}

                          <div
                            className="col-6
                                       col-md-3
                                       text-md-end
                                       mt-3 mt-md-0"
                          >

                            <small className="text-muted d-block">
                              Item Total
                            </small>

                            <strong className="fs-5">

                              ₹
                              {formatPrice(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 1
                                )
                              )}

                            </strong>

                          </div>

                        </div>

                      )
                    )}


                  {/* =================================
                      SHIPPING DETAILS
                  ================================= */}

                  <div className="row mt-3">

                    <div className="col-md-7">

                      <h6 className="fw-bold">
                        Delivery Address
                      </h6>

                      <p className="mb-1">

                        <strong>
                          {order.shippingDetails
                            ?.fullName ||
                            "N/A"}
                        </strong>

                      </p>

                      <p className="mb-1 text-muted">

                        {order.shippingDetails
                          ?.phone ||
                          "N/A"}

                      </p>

                      <p className="mb-1">

                        {order.shippingDetails
                          ?.address ||
                          ""}

                      </p>

                      <p className="mb-0">

                        {order.shippingDetails
                          ?.city ||
                          ""}

                        {order.shippingDetails
                          ?.state
                          ? `, ${order.shippingDetails.state}`
                          : ""}

                        {order.shippingDetails
                          ?.pincode
                          ? ` - ${order.shippingDetails.pincode}`
                          : ""}

                      </p>

                    </div>


                    {/* =================================
                        ORDER TOTAL
                    ================================= */}

                    <div
                      className="col-md-5
                                 text-md-end
                                 mt-4 mt-md-0"
                    >

                      <p className="mb-1 text-muted">
                        Order Total
                      </p>

                      <h4 className="fw-bold">

                        ₹
                        {formatPrice(
                          order.totalAmount
                        )}

                      </h4>

                      <p className="text-muted mb-0">

                        Payment:{" "}

                        <strong>
                          {order.shippingDetails
                            ?.paymentMethod ||
                            "Cash on Delivery"}
                        </strong>

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </MainLayout>

  );

};


export default MyOrders;