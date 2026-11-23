
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import "../Style/CheckoutPage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const { user, token, isLoggedIn } = useAuth();
  const { cart, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const directItems = location.state?.items;
  const fromCart =
    location.state?.fromCart === true ||
    !Array.isArray(directItems);

  const sourceItems = fromCart ? cart : directItems || [];

  const items = useMemo(
    () =>
      sourceItems.map((item) => ({
        productId: Number(item.productId),
        quantity: Math.max(1, Number(item.quantity) || 1),
        title: item.CardTitle || item.title || "Product",
        image: item.image || "",
        unitPrice: Number(item.Price || item.price || 0),
        discount: Number(item.Discount || 0),
      })),
    [sourceItems]
  );

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.houseAreaStreet || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  });

  const [walletCoins, setWalletCoins] = useState(
    Number(user?.coins || 0)
  );

  const [coinsToUse, setCoinsToUse] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/Login", {
        replace: true,
        state: { from: "/Checkout" },
      });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!user) return;

    setAddress({
      fullName: user.name || "",
      phone: user.phone || "",
      address: user.houseAreaStreet || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
    });

    setWalletCoins(Number(user.coins || 0));
  }, [user]);

  useEffect(() => {
    const userId = user?._id || user?.id;

    if (!userId || !token) return;

    fetch(`${API_BASE_URL}/api/orders/wallet/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Wallet could not be loaded"
          );
        }

        setWalletCoins(Number(data.coins || 0));
      })
      .catch((err) =>
        console.error("Wallet fetch error:", err)
      );
  }, [user, token]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const discountedUnitPrice = Math.max(
          0,
          Math.round(
            item.unitPrice *
              (1 -
                Math.min(
                  100,
                  Math.max(0, item.discount)
                ) /
                  100)
          )
        );

        return sum + discountedUnitPrice * item.quantity;
      }, 0),
    [items]
  );

  const originalAmount = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Math.round(item.unitPrice) * item.quantity,
        0
      ),
    [items]
  );

  const discountAmount = Math.max(
    0,
    originalAmount - subtotal
  );

  const safeCoins = Math.min(
    Math.max(0, Math.floor(Number(coinsToUse) || 0)),
    walletCoins,
    subtotal
  );

  const payableAmount = Math.max(
    0,
    subtotal - safeCoins
  );

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Expected delivery date: 5 days from today.
  // UTC date is used to avoid timezone date shifting.
  const expectedDeliveryDate = new Date();

  expectedDeliveryDate.setUTCDate(
    expectedDeliveryDate.getUTCDate() + 5
  );

  expectedDeliveryDate.setUTCHours(12, 0, 0, 0);

  const formattedExpectedDeliveryDate =
    expectedDeliveryDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

  const updateAddress = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "phone") {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setAddress((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const validate = () => {
    if (items.length === 0) {
      return "Your cart is empty.";
    }

    if (address.fullName.trim().length < 2) {
      return "Enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (address.address.trim().length < 5) {
      return "Enter your complete house / street address.";
    }

    if (!address.city.trim() || !address.state.trim()) {
      return "Enter your city and state.";
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return "Enter a valid 6-digit PIN code.";
    }

    if (safeCoins > walletCoins) {
      return "Wallet balance is not sufficient.";
    }

    return "";
  };

  const checkoutPayload = () => ({
    items: items.map(({ productId, quantity }) => ({
      productId,
      quantity,
    })),

    coinsToUse: safeCoins,

    shippingDetails: {
      ...address,
      fullName: address.fullName.trim(),
      phone: address.phone.trim(),
      address: address.address.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    },
  });

  const finishOrder = async (result) => {
    const order = result.order;

    if (!order) {
      throw new Error(
        "Order confirmation was not returned by the server."
      );
    }

    if (fromCart) {
      const clearResult = await clearCart();

      if (!clearResult?.success) {
        console.warn(
          "Order is placed, but cart could not be cleared:",
          clearResult?.message
        );
      }
    }

    navigate("/order", {
      replace: true,
      state: {
        order,
        coinsEarned:
          result.coinsEarned ||
          order.coinsEarned ||
          0,
        walletCoins: result.walletCoins,
      },
    });
  };

  const placeCodOrder = async (payload) => {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/checkout/cod`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Could not place Cash on Delivery order."
      );
    }

    await finishOrder(data);
  };

  const placeOnlineOrder = async (payload) => {
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      throw new Error(
        "Razorpay checkout could not load. Check your internet connection and try again."
      );
    }

    const createResponse = await fetch(
      `${API_BASE_URL}/api/orders/checkout/razorpay/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const createData = await createResponse.json().catch(() => ({}));

    if (!createResponse.ok) {
      throw new Error(
        createData.message ||
          "Could not start online payment."
      );
    }

    if (createData.completed) {
      await finishOrder(createData);
      return;
    }

    await new Promise((resolve, reject) => {
      const options = {
        key: createData.keyId,
        amount: createData.gatewayOrder.amount,
        currency:
          createData.gatewayOrder.currency || "INR",

        name: "SHIVRAM",
        description: "Secure order payment",

        order_id: createData.gatewayOrder.id,

        prefill: {
          name: address.fullName,
          email: user?.email || "",
          contact: address.phone,
        },

        notes: {
          deliveryCity: address.city,
          deliveryPincode: address.pincode,
        },

        theme: {
          color: "#1746a2",
        },

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              `${API_BASE_URL}/api/orders/checkout/razorpay/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...payload,
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,
                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,
                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json().catch(() => ({}));

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed."
              );
            }

            await finishOrder(verifyData);
            resolve();
          } catch (verificationError) {
            reject(verificationError);
          }
        },

        modal: {
          ondismiss: () =>
            reject(
              new Error(
                "Payment window closed. No order was placed."
              )
            ),
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (event) => {
        reject(
          new Error(
            event?.error?.description ||
              "Payment failed. Please try again."
          )
        );
      });

      razorpay.open();
    });
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (loading) return;

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const payload = checkoutPayload();

      if (paymentMethod === "COD") {
        await placeCodOrder(payload);
      } else {
        await placeOnlineOrder(payload);
      }
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.message || "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <main className="shiv-checkout empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add products before proceeding to checkout.</p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Continue shopping
          </button>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="shiv-checkout">
        <div className="checkout-heading">
          <div>
            <p className="checkout-eyebrow">
              SHIVRAM SECURE CHECKOUT
            </p>

            <h1>Complete your order</h1>

            <p>
              Review your items, delivery address and payment
              method.
            </p>
          </div>

          <div className="checkout-step-pill">
            1. Delivery <span>→</span> 2. Payment{" "}
            <span>→</span> 3. Confirmation
          </div>
        </div>

        {error && (
          <div className="checkout-alert error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="checkout-alert success" role="status">
            {notice}
          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >
          <section className="checkout-main-column">
            <div className="checkout-panel">
              <div className="panel-title">
                <span className="panel-number">01</span>

                <div>
                  <h2>Delivery address</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <div className="checkout-form-grid">
                <label>
                  Full name
                  <input
                    name="fullName"
                    value={address.fullName}
                    onChange={updateAddress}
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Mobile number
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={address.phone}
                    onChange={updateAddress}
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="full-field">
                  House no., street and area
                  <textarea
                    name="address"
                    rows={3}
                    value={address.address}
                    onChange={updateAddress}
                    autoComplete="street-address"
                    required
                  />
                </label>

                <label>
                  City
                  <input
                    name="city"
                    value={address.city}
                    onChange={updateAddress}
                    autoComplete="address-level2"
                    required
                  />
                </label>

                <label>
                  State
                  <input
                    name="state"
                    value={address.state}
                    onChange={updateAddress}
                    autoComplete="address-level1"
                    required
                  />
                </label>

                <label>
                  PIN code
                  <input
                    name="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={address.pincode}
                    onChange={updateAddress}
                    autoComplete="postal-code"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="checkout-panel">
              <div className="panel-title">
                <span className="panel-number">02</span>

                <div>
                  <h2>Payment method</h2>
                  <p>Choose a secure way to pay.</p>
                </div>
              </div>

              <label
                className={`payment-choice ${
                  paymentMethod === "RAZORPAY" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                />

                <span className="payment-choice-icon">▣</span>

                <span className="payment-choice-copy">
                  <strong>Pay online</strong>
                  <small>
                    UPI, Google Pay, PhonePe, cards and Net
                    Banking via Razorpay
                  </small>
                </span>

                <span className="payment-choice-tag">
                  Secure
                </span>
              </label>

              <label
                className={`payment-choice ${
                  paymentMethod === "COD" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />

                <span className="payment-choice-icon">₹</span>

                <span className="payment-choice-copy">
                  <strong>Cash on Delivery</strong>
                  <small>
                    Pay when your order is delivered.
                  </small>
                </span>
              </label>

              <p className="payment-disclaimer">
                SHIVRAM never stores your card, UPI PIN or
                banking password. Online payment details are
                handled by Razorpay.
              </p>
            </div>
          </section>

          <aside className="checkout-summary-column">
            <div className="checkout-panel order-summary-panel">
              <div className="summary-header">
                <div>
                  <h2>Order summary</h2>
                  <p>{totalQuantity} item(s)</p>
                </div>

                <span className="summary-lock">🔒</span>
              </div>

              <div className="summary-items">
                {items.map((item) => {
                  const unit = Math.max(
                    0,
                    Math.round(
                      item.unitPrice *
                        (1 -
                          Math.min(
                            100,
                            Math.max(0, item.discount)
                          ) /
                            100)
                    )
                  );

                  return (
                    <div
                      className="summary-item"
                      key={item.productId}
                    >
                      <img src={item.image} alt={item.title} />

                      <div className="summary-item-info">
                        <strong>{item.title}</strong>
                        <small>Qty: {item.quantity}</small>
                      </div>

                      <b>
                        ₹
                        {(unit * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </b>
                    </div>
                  );
                })}
              </div>

              {/* Expected Delivery Date */}
              <div
                className="checkout-delivery-estimate"
                aria-label={`Expected delivery ${formattedExpectedDeliveryDate}`}
              >
                <span
                  className="delivery-estimate-icon"
                  aria-hidden="true"
                >
                  🚚
                </span>

                <div className="delivery-estimate-copy">
                  <span className="delivery-estimate-label">
                    EXPECTED DELIVERY
                  </span>

                  <strong>
                    {formattedExpectedDeliveryDate}
                  </strong>

                  <small>
                    Estimated delivery within 5 days
                  </small>
                </div>

                <span
                  className="delivery-estimate-check"
                  aria-hidden="true"
                >
                  ✓
                </span>
              </div>

              <div className="coin-box">
                <div>
                  <strong>SHIVRAM Coins</strong>

                  <small>
                    Available balance: {walletCoins} coins
                    (₹{walletCoins})
                  </small>
                </div>

                <input
                  aria-label="Coins to redeem"
                  type="number"
                  min="0"
                  max={Math.min(walletCoins, subtotal)}
                  step="1"
                  value={coinsToUse}
                  onChange={(event) =>
                    setCoinsToUse(event.target.value)
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setCoinsToUse(
                      String(Math.min(walletCoins, subtotal))
                    )
                  }
                  disabled={
                    loading ||
                    walletCoins <= 0 ||
                    subtotal <= 0
                  }
                >
                  Use max
                </button>
              </div>

              <div className="price-lines">
                <div>
                  <span>Price</span>
                  <b>
                    ₹{originalAmount.toLocaleString("en-IN")}
                  </b>
                </div>

                <div>
                  <span>Product discount</span>
                  <b className="positive">
                    − ₹{discountAmount.toLocaleString("en-IN")}
                  </b>
                </div>

                <div>
                  <span>Delivery</span>
                  <b className="positive">FREE</b>
                </div>

                <div>
                  <span>Coins redeemed</span>
                  <b className="positive">
                    − ₹{safeCoins.toLocaleString("en-IN")}
                  </b>
                </div>
              </div>

              <div className="summary-total">
                <span>Amount payable</span>

                <strong>
                  ₹{payableAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              <p className="coin-earning-note">
                Your eligible SHIVRAM Coins will be credited
                to your wallet after this order is delivered.
              </p>

              <button
                className="place-order-button"
                type="submit"
                disabled={loading || items.length === 0}
              >
                {loading ? (
                  <>
                    <span className="checkout-spinner" />
                    Processing...
                  </>
                ) : paymentMethod === "COD" ? (
                  "Place COD order"
                ) : payableAmount === 0 ? (
                  "Place order using coins"
                ) : (
                  `Pay ₹${payableAmount.toLocaleString("en-IN")}`
                )}
              </button>

              <p className="checkout-terms">
                By placing this order, you confirm that your
                delivery details are correct.
              </p>
            </div>
          </aside>
        </form>
      </main>
    </MainLayout>
  );
}

export default CheckoutPage;
