import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../Layout/MainLayout.jsx";

import "../Style/ProductCheckout.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductDetail() {
  const { addToCart } = useCart();
  const { isLoggedIn, user } = useAuth();

  const { productId } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(
    location.state?.quantity || 1
  );

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // =========================================
  // ADDRESS SECTION
  // =========================================

  const [showAddressForm, setShowAddressForm] = useState(false);

  // =========================================
  // REGISTERED USER ADDRESS
  // =========================================

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    houseAreaStreet: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================================
  // AUTO FILL REGISTERED USER ADDRESS
  // =========================================

  useEffect(() => {
    if (user) {
      setAddress({
        name: user.name || "",
        phone: user.phone || "",
        houseAreaStreet: user.houseAreaStreet || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <MainLayout>
        <div className="product-loading">
          <h3>Loading Product...</h3>
        </div>
      </MainLayout>
    );
  }

  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {
    return (
      <MainLayout>
        <div className="product-loading">
          <h2 className="text-danger">
            Product Not Found
          </h2>
        </div>
      </MainLayout>
    );
  }

  // =========================================
  // PRICE CALCULATION
  // =========================================

  const finalPrice =
    product.Price -
    (product.Price * product.Discount) / 100;

  const totalPrice = finalPrice * quantity;

  const discountAmount =
    product.Price * quantity - totalPrice;

  // =========================================
  // QUANTITY
  // =========================================

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // =========================================
  // LOGIN CHECK
  // =========================================

  const requireLogin = (action) => {
    if (!isLoggedIn) {
      const shouldLogin = window.confirm(
        `🔐 Login Required\n\nPlease login to ${action}.\n\nClick OK to login.`
      );

      if (shouldLogin) {
        window.location.href = "/Login";
      }

      return false;
    }

    return true;
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {
    if (!requireLogin("continue shopping")) {
      return;
    }

    addToCart({
      ...product,
      quantity: quantity,
    });
  };

  // =========================================
  // BUY NOW
  // =========================================

  const handleBuyNow = () => {
    if (!requireLogin("buy this product")) {
      return;
    }

    // Open address form
    setShowAddressForm(true);

    // Scroll to address section
    setTimeout(() => {
      document
        .getElementById("address-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  // =========================================
  // ADDRESS INPUT
  // =========================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // UI
  // =========================================

  return (
    <MainLayout>

      <div className="checkout-page">

        {/* ================================= */}
        {/* CHECKOUT PROGRESS */}
        {/* ================================= */}

        <div className="checkout-progress">

          <div className="progress-step active">
            <span>1</span>
            <strong>Product</strong>
          </div>

          <div className="progress-line"></div>

          <div className="progress-step">
            <span>2</span>
            <strong>Payment</strong>
          </div>

          <div className="progress-line"></div>

          <div className="progress-step">
            <span>3</span>
            <strong>Review & Place Order</strong>
          </div>

        </div>


        {/* ================================= */}
        {/* MAIN TWO COLUMN */}
        {/* ================================= */}

        <div className="checkout-grid">


          {/* ================================= */}
          {/* LEFT SIDE - PRODUCT */}
          {/* ================================= */}

          <div className="product-main-card">

            {/* PRODUCT IMAGE */}

            <div className="product-image-section">

              <div className="main-product-image">

                <img
                  src={product.image}
                  alt={product.CardTitle}
                />

              </div>

            </div>


            {/* PRODUCT INFORMATION */}

            <div className="product-info-section">

              <h1>
                {product.CardTitle}
              </h1>


              {/* RATING */}

              <div className="product-rating">

                <span className="rating-star">
                  ★
                </span>

                <strong>
                  {product.Rating}
                </strong>

                <span>
                  ({product.Reviews} Reviews)
                </span>

              </div>


              {/* PRICE */}

              <div className="price-section">

                <span className="current-price">
                  ₹{Math.round(finalPrice)}
                </span>

                <del>
                  ₹{product.Price}
                </del>

                <span className="discount-badge">
                  {product.Discount}% OFF
                </span>

              </div>


              {/* DESCRIPTION */}

              <p className="product-description">
                {product.ItemContent}
              </p>


              {/* FEATURES */}

              <div className="product-features">

                <div>
                  ✓ Lightweight Design
                </div>

                <div>
                  ✓ Durable Quality
                </div>

                <div>
                  ✓ Comfortable for Everyday Use
                </div>

                <div>
                  ✓ Free Delivery
                </div>

              </div>


              {/* QUANTITY */}

              <div className="quantity-section">

                <strong>
                  Quantity
                </strong>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* ================================= */}
          {/* RIGHT SIDE - SCROLLABLE SIDEBAR */}
          {/* ================================= */}

          <div className="checkout-sidebar">


            {/* ================================= */}
            {/* PAYMENT METHOD */}
            {/* ================================= */}

            <div className="checkout-card">

              <h2>
                💳 Payment Method
              </h2>

              <div className="payment-options">


                {/* UPI */}

                <label
                  className={
                    paymentMethod === "UPI"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={
                      paymentMethod === "UPI"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    UPI
                  </span>

                  <small>
                    Google Pay, PhonePe, Paytm
                  </small>

                </label>


                {/* CARD */}

                <label
                  className={
                    paymentMethod === "CARD"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={
                      paymentMethod === "CARD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    Credit / Debit Card
                  </span>

                </label>


                {/* NET BANKING */}

                <label
                  className={
                    paymentMethod === "NETBANKING"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="NETBANKING"
                    checked={
                      paymentMethod ===
                      "NETBANKING"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    Net Banking
                  </span>

                </label>


                {/* COD */}

                <label
                  className={
                    paymentMethod === "COD"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    Cash on Delivery
                  </span>

                </label>

              </div>

            </div>


            {/* ================================= */}
            {/* ORDER SUMMARY */}
            {/* ================================= */}

            <div className="checkout-card">

              <div className="summary-heading">

                <h2>
                  📋 Order Summary
                </h2>

                <span>
                  {quantity} Item
                  {quantity > 1 ? "s" : ""}
                </span>

              </div>


              {/* SUMMARY PRODUCT */}

              <div className="summary-product">

                <img
                  src={product.image}
                  alt={product.CardTitle}
                />

                <div>

                  <h4>
                    {product.CardTitle}
                  </h4>

                  <p>
                    Qty: {quantity}
                  </p>

                  <strong>
                    ₹{Math.round(totalPrice)}
                  </strong>

                </div>

              </div>


              <hr />


              {/* SUBTOTAL */}

              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {Math.round(
                    product.Price * quantity
                  )}
                </strong>

              </div>


              {/* DISCOUNT */}

              <div className="summary-row discount-row">

                <span>
                  Discount
                </span>

                <strong>
                  - ₹
                  {Math.round(
                    discountAmount
                  )}
                </strong>

              </div>


              {/* SHIPPING */}

              <div className="summary-row">

                <span>
                  Shipping Charges
                </span>

                <strong>
                  ₹0
                </strong>

              </div>


              <hr />


              {/* TOTAL */}

              <div className="total-row">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{Math.round(totalPrice)}
                </strong>

              </div>

            </div>


            {/* ================================= */}
            {/* DELIVERY ADDRESS */}
            {/* ================================= */}

            <div
              className="checkout-card"
              id="address-section"
            >

              <div className="address-heading">

                <h2>
                  📍 Delivery Address
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddressForm(
                      !showAddressForm
                    )
                  }
                >
                  ✎{" "}
                  {showAddressForm
                    ? "Cancel"
                    : "Edit"}
                </button>

              </div>


              {/* ================================= */}
              {/* SAVED ADDRESS */}
              {/* ================================= */}

              {!showAddressForm && (

                <div className="saved-address">

                  {address.name ? (

                    <>

                      <h4>
                        {address.name}
                      </h4>

                      <p>
                        📞 {address.phone}
                      </p>

                      <p>
                        {address.houseAreaStreet}
                      </p>

                      <p>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>

                    </>

                  ) : (

                    <div className="address-placeholder">

                      <p>
                        Please add your delivery
                        address.
                      </p>

                      <small>
                        Click Edit to enter your
                        address.
                      </small>

                    </div>

                  )}

                </div>

              )}


              {/* ================================= */}
              {/* ADDRESS FORM */}
              {/* ================================= */}

              {showAddressForm && (

                <div className="address-form">

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={
                      handleAddressChange
                    }
                  />


                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={
                      handleAddressChange
                    }
                  />


                  <textarea
                    name="houseAreaStreet"
                    placeholder="House No. / Street / Area"
                    value={
                      address.houseAreaStreet
                    }
                    onChange={
                      handleAddressChange
                    }
                  />


                  <div className="address-row">

                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={
                        handleAddressChange
                      }
                    />

                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={address.state}
                      onChange={
                        handleAddressChange
                      }
                    />

                  </div>


                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={address.pincode}
                    onChange={
                      handleAddressChange
                    }
                    maxLength="6"
                  />

                </div>

              )}


              {/* ================================= */}
              {/* ACTION BUTTONS */}
              {/* ================================= */}

              <div className="product-buttons">

                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>

                <button
                  type="button"
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                >
                  🛒 Buy Now
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default ProductDetail;