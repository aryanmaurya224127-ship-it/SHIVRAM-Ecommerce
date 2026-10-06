import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../Layout/MainLayout.jsx";

import "../Style/ProductCheckout.css";
import "bootstrap/dist/css/bootstrap.min.css";

// =====================================================
// API URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


// =====================================================
// PRODUCT DETAIL
// =====================================================

function ProductDetail() {

  const { addToCart } = useCart();

  const {
    isLoggedIn,
    user,
  } = useAuth();

  const { productId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();


  // ===================================================
  // PRODUCT STATE
  // ===================================================

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);


  // ===================================================
  // QUANTITY
  // ===================================================

  const [quantity, setQuantity] = useState(() => {

    const savedQuantity =
      Number(location.state?.quantity);

    return Number.isInteger(savedQuantity) &&
      savedQuantity >= 1
      ? savedQuantity
      : 1;

  });


  // ===================================================
  // PAYMENT
  // ===================================================

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");


  // ===================================================
  // ADDRESS FORM
  // ===================================================

  const [showAddressForm, setShowAddressForm] =
    useState(false);


  // ===================================================
  // ADDRESS
  // ===================================================

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    houseAreaStreet: "",
    city: "",
    state: "",
    pincode: "",
  });


  // ===================================================
  // SUCCESS / ERROR MESSAGE
  // ===================================================

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");


  // ===================================================
  // ACTION LOADING
  // ===================================================

  const [cartLoading, setCartLoading] =
    useState(false);

  const [orderLoading, setOrderLoading] =
    useState(false);


  // ===================================================
  // ADDRESS VALIDATION ERROR
  // ===================================================

  const [addressErrors, setAddressErrors] =
    useState({});


  // ===================================================
  // AUTO FILL REGISTERED USER ADDRESS
  // ===================================================

  useEffect(() => {

    if (!user) {
      return;
    }

    setAddress({
      name: user.name || "",
      phone: user.phone || "",
      houseAreaStreet:
        user.houseAreaStreet || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
    });

  }, [user]);


  // ===================================================
  // FETCH PRODUCT
  // ===================================================

  useEffect(() => {

    const fetchProduct = async () => {

      setLoading(true);

      try {

        const response = await fetch(
          `${API_BASE_URL}/api/products/${productId}`
        );


        let data = null;

        try {

          data = await response.json();

        } catch {

          data = null;

        }


        if (!response.ok) {

          throw new Error(
            data?.message ||
            "Product not found."
          );

        }


        setProduct(data);

      } catch (error) {

        console.error(
          "Error fetching product:",
          error
        );

        setProduct(null);

        setErrorMessage(
          error.message ||
          "Unable to load product."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProduct();

  }, [productId]);


  // ===================================================
  // QUANTITY
  // ===================================================

  const increaseQuantity = () => {

    setQuantity((prev) => {

      const current =
        Number(prev);

      if (!Number.isInteger(current)) {
        return 1;
      }

      return current + 1;

    });

  };


  const decreaseQuantity = () => {

    setQuantity((prev) => {

      const current =
        Number(prev);

      if (!Number.isInteger(current)) {
        return 1;
      }

      return Math.max(
        1,
        current - 1
      );

    });

  };


  // ===================================================
  // LOGIN CHECK
  // ===================================================

  const requireLogin = (action) => {

    if (isLoggedIn) {
      return true;
    }


    const shouldLogin =
      window.confirm(
        `🔐 Login Required\n\nPlease login to ${action}.\n\nClick OK to login.`
      );


    if (shouldLogin) {

      window.location.href =
        "/Login";

    }


    return false;

  };


  // ===================================================
  // ADDRESS VALIDATION
  // ===================================================

  const validateAddress = () => {

    const errors = {};


    // -----------------------------------------------
    // NAME
    // -----------------------------------------------

    const name =
      address.name.trim();

    if (!name) {

      errors.name =
        "Full name is required.";

    } else if (name.length < 2) {

      errors.name =
        "Please enter a valid name.";

    }


    // -----------------------------------------------
    // PHONE
    // -----------------------------------------------

    const phone =
      address.phone.trim();

    if (!phone) {

      errors.phone =
        "Phone number is required.";

    } else if (!/^[6-9]\d{9}$/.test(phone)) {

      errors.phone =
        "Enter a valid 10-digit Indian mobile number.";

    }


    // -----------------------------------------------
    // HOUSE / STREET
    // -----------------------------------------------

    const houseAreaStreet =
      address.houseAreaStreet.trim();

    if (!houseAreaStreet) {

      errors.houseAreaStreet =
        "House number / street / area is required.";

    } else if (
      houseAreaStreet.length < 5
    ) {

      errors.houseAreaStreet =
        "Please enter a complete address.";

    }


    // -----------------------------------------------
    // CITY
    // -----------------------------------------------

    const city =
      address.city.trim();

    if (!city) {

      errors.city =
        "City is required.";

    }


    // -----------------------------------------------
    // STATE
    // -----------------------------------------------

    const state =
      address.state.trim();

    if (!state) {

      errors.state =
        "State is required.";

    }


    // -----------------------------------------------
    // PINCODE
    // -----------------------------------------------

    const pincode =
      address.pincode.trim();

    if (!pincode) {

      errors.pincode =
        "PIN code is required.";

    } else if (!/^\d{6}$/.test(pincode)) {

      errors.pincode =
        "PIN code must contain exactly 6 digits.";

    }


    setAddressErrors(errors);


    return (
      Object.keys(errors).length === 0
    );

  };


  // ===================================================
  // ADDRESS INPUT
  // ===================================================

  const handleAddressChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    let updatedValue = value;


    // -----------------------------------------------
    // PHONE
    // -----------------------------------------------

    if (name === "phone") {

      updatedValue =
        value
          .replace(/\D/g, "")
          .slice(0, 10);

    }


    // -----------------------------------------------
    // PINCODE
    // -----------------------------------------------

    if (name === "pincode") {

      updatedValue =
        value
          .replace(/\D/g, "")
          .slice(0, 6);

    }


    setAddress((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));


    // -----------------------------------------------
    // REMOVE FIELD ERROR
    // -----------------------------------------------

    setAddressErrors((prev) => {

      if (!prev[name]) {
        return prev;
      }


      const updatedErrors = {
        ...prev,
      };

      delete updatedErrors[name];


      return updatedErrors;

    });


    // -----------------------------------------------
    // CLEAR GENERAL ERROR
    // -----------------------------------------------

    setErrorMessage("");

  };


  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddToCart = async () => {

    if (
      !requireLogin(
        "continue shopping"
      )
    ) {
      return;
    }


    // -----------------------------------------------
    // QUANTITY SAFETY
    // -----------------------------------------------

    const safeCartQuantity =
      Math.max(
        1,
        Number(quantity) || 1
      );


    setQuantity(safeCartQuantity);

    setSuccessMessage("");
    setErrorMessage("");
    setCartLoading(true);


    try {

      const result =
        await addToCart({
          ...product,
          quantity: safeCartQuantity,
        });


      if (!result?.success) {

        throw new Error(
          result?.message ||
          "Unable to add product to cart."
        );

      }


      setSuccessMessage(
        "✓ Product added to cart successfully."
      );


      // ---------------------------------------------
      // AUTO HIDE SUCCESS MESSAGE
      // ---------------------------------------------

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );


      setErrorMessage(
        error.message ||
        "Unable to add product to cart."
      );

    } finally {

      setCartLoading(false);

    }

  };


  // ===================================================
  // BUY NOW
  // ===================================================

  const handleBuyNow = () => {

    if (
      !requireLogin(
        "buy this product"
      )
    ) {
      return;
    }


    // -----------------------------------------------
    // CLEAR OLD MESSAGES
    // -----------------------------------------------

    setSuccessMessage("");
    setErrorMessage("");


    // -----------------------------------------------
    // QUANTITY SAFETY
    // -----------------------------------------------

    setQuantity((prev) =>
      Math.max(
        1,
        Number(prev) || 1
      )
    );


    // -----------------------------------------------
    // OPEN ADDRESS
    // -----------------------------------------------

    setShowAddressForm(true);


    // -----------------------------------------------
    // SCROLL TO ADDRESS
    // -----------------------------------------------

    setTimeout(() => {

      document
        .getElementById(
          "address-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

    }, 100);

  };


  // ===================================================
  // SAVE / VALIDATE ADDRESS + PLACE ORDER
  // ===================================================

  const handleAddressContinue = async () => {

    // -----------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------

    if (
      !requireLogin(
        "place this order"
      )
    ) {
      return false;
    }


    // -----------------------------------------------
    // VALIDATE ADDRESS
    // -----------------------------------------------

    const isValid =
      validateAddress();


    if (!isValid) {

      setErrorMessage(
        "Please correct the highlighted address fields."
      );

      return false;

    }


    // -----------------------------------------------
    // CLEAR OLD MESSAGES
    // -----------------------------------------------

    setSuccessMessage("");
    setErrorMessage("");


    // -----------------------------------------------
    // PREVENT DOUBLE CLICK
    // -----------------------------------------------

    if (orderLoading) {
      return false;
    }


    setOrderLoading(true);


    try {

      // ---------------------------------------------
      // SAFE QUANTITY
      // ---------------------------------------------

      const safeOrderQuantity =
        Math.max(
          1,
          Number(quantity) || 1
        );


      // ---------------------------------------------
      // USER ID
      // ---------------------------------------------

      const userId =
        user?._id ||
        user?.id;


      if (!userId) {

        throw new Error(
          "User information nahi mili. Please login again."
        );

      }


      // ---------------------------------------------
      // PRODUCT ID
      // ---------------------------------------------

      const safeProductId =
        Number(product.productId);


      if (!Number.isFinite(safeProductId)) {

        throw new Error(
          "Product ID invalid hai."
        );

      }


      // ---------------------------------------------
      // ORDER DATA
      // ---------------------------------------------

      const orderData = {

        userId: userId,

        items: [

          {

            productId:
              safeProductId,

            title:
              product.CardTitle,

            image:
              product.image,

            price:
              Math.round(finalPrice),

            quantity:
              safeOrderQuantity

          }

        ],

        totalAmount:
          Math.round(totalPrice),


        shippingDetails: {

          fullName:
            address.name.trim(),

          phone:
            address.phone.trim(),

          address:
            address.houseAreaStreet.trim(),

          city:
            address.city.trim(),

          state:
            address.state.trim(),

          pincode:
            address.pincode.trim(),

          paymentMethod:
            paymentMethod === "COD"
              ? "Cash on Delivery"
              : paymentMethod

        }

      };


      console.log(
        "Sending Order:",
        orderData
      );


      // ---------------------------------------------
      // SAVE ORDER IN MONGODB
      // ---------------------------------------------

      const response =
        await fetch(
          `${API_BASE_URL}/api/orders`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify(orderData)

          }
        );


      // ---------------------------------------------
      // READ BACKEND RESPONSE
      // ---------------------------------------------

      let data = null;


      try {

        data =
          await response.json();

      } catch {

        data = null;

      }


      // ---------------------------------------------
      // BACKEND ERROR
      // ---------------------------------------------

      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Order save nahi ho paya."
        );

      }


      // ---------------------------------------------
      // SAVED ORDER
      // ---------------------------------------------

      const savedOrder =
        data?.order;


      if (!savedOrder) {

        throw new Error(
          "Server se saved order details nahi mili."
        );

      }


      // ---------------------------------------------
      // CREATED DATE
      // ---------------------------------------------

      const createdDate =
        new Date(
          savedOrder.createdAt
        );


      const orderDate =
        createdDate.toLocaleDateString(
          "en-IN"
        );


      const orderTime =
        createdDate.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );


      // ---------------------------------------------
      // SUCCESS MESSAGE
      // ---------------------------------------------

      setSuccessMessage(
        "✓ Order successfully placed."
      );


      // ---------------------------------------------
      // NAVIGATE TO ORDER PAGE
      // ---------------------------------------------

      navigate(
        "/order",
        {

          state: {

            // ---------------------------------------
            // ORDER INFORMATION
            // ---------------------------------------

            orderId:
              savedOrder.orderId,

            orderDate:
              orderDate,

            orderTime:
              orderTime,


            // ---------------------------------------
            // PRODUCT INFORMATION
            // ---------------------------------------

            product: {

              image:
                savedOrder.items?.[0]?.image ||
                product.image,

              title:
                savedOrder.items?.[0]?.title ||
                product.CardTitle,

              price:
                savedOrder.items?.[0]?.price ||
                Math.round(finalPrice)

            },


            // ---------------------------------------
            // QUANTITY
            // ---------------------------------------

            quantity:
              savedOrder.items?.[0]?.quantity ||
              safeOrderQuantity,


            // ---------------------------------------
            // TOTAL AMOUNT
            // ---------------------------------------

            totalAmount:
              savedOrder.totalAmount,


            // ---------------------------------------
            // SHIPPING DETAILS
            // ---------------------------------------

            shippingDetails:
              savedOrder.shippingDetails

          }

        }
      );


      return true;


    } catch (error) {

      console.error(
        "Place Order Error:",
        error
      );


      setErrorMessage(
        error.message ||
        "Order place nahi ho paya."
      );


      return false;


    } finally {

      setOrderLoading(false);

    }

  };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <MainLayout>

        <div className="product-loading">

          <h3>
            Loading Product...
          </h3>

        </div>

      </MainLayout>
    );

  }


  // ===================================================
  // PRODUCT NOT FOUND
  // ===================================================

  if (!product) {

    return (
      <MainLayout>

        <div className="product-loading">

          <h2 className="text-danger">
            Product Not Found
          </h2>

          {errorMessage && (

            <p className="text-danger mt-2">
              {errorMessage}
            </p>

          )}

        </div>

      </MainLayout>
    );

  }


  // ===================================================
  // PRICE CALCULATION
  // ===================================================

  const productPrice =
    Number(product.Price || 0);


  const productDiscount =
    Number(product.Discount || 0);


  const safeQuantity =
    Math.max(
      1,
      Number(quantity) || 1
    );


  const finalPrice =
    productPrice -
    (productPrice * productDiscount) /
    100;


  const totalPrice =
    finalPrice * safeQuantity;


  const discountAmount =
    productPrice * safeQuantity -
    totalPrice;


  // ===================================================
  // UI
  // ===================================================

  return (

    <MainLayout>

      <div className="checkout-page">


        {/* =================================================
            SUCCESS / ERROR MESSAGES
        ================================================= */}

        {successMessage && (

          <div
            className="alert alert-success fw-bold"
            role="alert"
          >
            {successMessage}
          </div>

        )}


        {errorMessage && (

          <div
            className="alert alert-danger fw-bold"
            role="alert"
          >
            {errorMessage}
          </div>

        )}


        {/* =================================================
            CHECKOUT PROGRESS
        ================================================= */}

        <div className="checkout-progress">

          <div className="progress-step active">

            <span>
              1
            </span>

            <strong>
              Product
            </strong>

          </div>


          <div className="progress-line"></div>


          <div className="progress-step">

            <span>
              2
            </span>

            <strong>
              Payment
            </strong>

          </div>


          <div className="progress-line"></div>


          <div className="progress-step">

            <span>
              3
            </span>

            <strong>
              Review & Place Order
            </strong>

          </div>

        </div>


        {/* =================================================
            MAIN TWO COLUMN
        ================================================= */}

        <div className="checkout-grid">


          {/* =================================================
              LEFT SIDE - PRODUCT
          ================================================= */}

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
                  ₹{productPrice}
                </del>

                <span className="discount-badge">
                  {productDiscount}% OFF
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
                    disabled={
                      safeQuantity <= 1 ||
                      cartLoading ||
                      orderLoading
                    }
                  >
                    −
                  </button>


                  <span>
                    {safeQuantity}
                  </span>


                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      cartLoading ||
                      orderLoading
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE - CHECKOUT SIDEBAR
          ================================================= */}

          <div className="checkout-sidebar">


            {/* =================================================
                PAYMENT METHOD
            ================================================= */}

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
                    disabled={orderLoading}
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
                    disabled={orderLoading}
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
                    disabled={orderLoading}
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
                    disabled={orderLoading}
                  />

                  <span>
                    Cash on Delivery
                  </span>

                </label>

              </div>

            </div>


            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <div className="checkout-card">

              <div className="summary-heading">

                <h2>
                  📋 Order Summary
                </h2>

                <span>
                  {safeQuantity} Item
                  {safeQuantity > 1
                    ? "s"
                    : ""}
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
                    Qty: {safeQuantity}
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
                    productPrice *
                    safeQuantity
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


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

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
                  onClick={() => {

                    setShowAddressForm(
                      !showAddressForm
                    );

                    setErrorMessage("");

                  }}
                  disabled={orderLoading}
                >
                  ✎{" "}
                  {showAddressForm
                    ? "Cancel"
                    : "Edit"}
                </button>

              </div>


              {/* =================================================
                  SAVED ADDRESS
              ================================================= */}

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


              {/* =================================================
                  ADDRESS FORM
              ================================================= */}

              {showAddressForm && (

                <div className="address-form">


                  {/* NAME */}

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={
                      handleAddressChange
                    }
                    disabled={orderLoading}
                  />

                  {addressErrors.name && (

                    <small className="text-danger fw-bold">
                      {addressErrors.name}
                    </small>

                  )}


                  {/* PHONE */}

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={
                      handleAddressChange
                    }
                    inputMode="numeric"
                    maxLength={10}
                    disabled={orderLoading}
                  />

                  {addressErrors.phone && (

                    <small className="text-danger fw-bold">
                      {addressErrors.phone}
                    </small>

                  )}


                  {/* HOUSE / STREET */}

                  <textarea
                    name="houseAreaStreet"
                    placeholder="House No. / Street / Area"
                    value={
                      address.houseAreaStreet
                    }
                    onChange={
                      handleAddressChange
                    }
                    disabled={orderLoading}
                  />

                  {addressErrors.houseAreaStreet && (

                    <small className="text-danger fw-bold">
                      {addressErrors.houseAreaStreet}
                    </small>

                  )}


                  {/* CITY + STATE */}

                  <div className="address-row">


                    {/* CITY */}

                    <div>

                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={
                          handleAddressChange
                        }
                        disabled={orderLoading}
                      />

                      {addressErrors.city && (

                        <small className="text-danger fw-bold">
                          {addressErrors.city}
                        </small>

                      )}

                    </div>


                    {/* STATE */}

                    <div>

                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={
                          handleAddressChange
                        }
                        disabled={orderLoading}
                      />

                      {addressErrors.state && (

                        <small className="text-danger fw-bold">
                          {addressErrors.state}
                        </small>

                      )}

                    </div>

                  </div>


                  {/* PINCODE */}

                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code"
                    value={address.pincode}
                    onChange={
                      handleAddressChange
                    }
                    inputMode="numeric"
                    maxLength={6}
                    disabled={orderLoading}
                  />

                  {addressErrors.pincode && (

                    <small className="text-danger fw-bold">
                      {addressErrors.pincode}
                    </small>

                  )}


                  {/* PLACE ORDER */}

                  <button
                    type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={
                      handleAddressContinue
                    }
                    disabled={orderLoading}
                  >

                    {orderLoading
                      ? "Saving Order..."
                      : "Place Order"}

                  </button>

                </div>

              )}


              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="product-buttons">


                {/* ADD TO CART */}

                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={handleAddToCart}
                  disabled={
                    cartLoading ||
                    orderLoading
                  }
                >

                  {cartLoading
                    ? "Adding..."
                    : "🛒 Add to Cart"}

                </button>


                {/* BUY NOW */}

                <button
                  type="button"
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={
                    cartLoading ||
                    orderLoading
                  }
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

