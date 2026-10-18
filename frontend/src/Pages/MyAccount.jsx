import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../Layout/MainLayout.jsx";
import "../Style/MyAccount.css";

export default function MyAccount() {
  const { user, isLoggedIn, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [walletCoins, setWalletCoins] = useState(Number(user?.coins || 0));
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [walletUpdatedAt, setWalletUpdatedAt] = useState(null);
  const [reviewRequests, setReviewRequests] = useState([]);
  const [reviewForms, setReviewForms] = useState({});
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const userId = user?._id || user?.id;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const refreshWallet = useCallback(async () => {
    if (!userId) return;
    setWalletLoading(true);
    setWalletError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/wallet/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Wallet balance load nahi hua.");
      const latestCoins = Math.max(0, Number(data.coins || 0));
      setWalletCoins(latestCoins);
      updateUser?.({ coins: latestCoins });
      setWalletUpdatedAt(new Date());
    } catch (error) {
      setWalletError("Latest balance load nahi hua. Backend connection check karke retry karein.");
    } finally {
      setWalletLoading(false);
    }
  }, [API_BASE_URL, token, updateUser, userId]);

  useEffect(() => {
    refreshWallet();
  }, [refreshWallet]);

  const loadReviewRequests = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/review-requests/${userId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review requests load nahi hue.");
      setReviewRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setReviewError(error.message || "Review requests load nahi hue.");
    }
  }, [API_BASE_URL, userId]);

  useEffect(() => { loadReviewRequests(); }, [loadReviewRequests]);

  const submitReview = async (item) => {
    const form = reviewForms[item.productId] || { rating: 5, comment: "" };
    setReviewLoading(true);
    setReviewMessage("");
    setReviewError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${item.productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ userId, orderId: item.orderId, rating: Number(form.rating), comment: form.comment || "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review submit nahi ho paya.");
      setReviewMessage(`${item.title}: ${data.message} Product rating ab ${data.Rating} ⭐ (${data.Reviews} reviews) hai.`);
      await loadReviewRequests();
    } catch (error) {
      setReviewError(error.message || "Review submit nahi ho paya.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <MainLayout>
        <section className="account-page">
          <div className="account-empty">
            <div className="account-icon">👤</div>
            <h2>My Account</h2>
            <p>Please log in to see your profile, account status and SHIVRAM Coins.</p>
            <button className="account-primary-btn" onClick={() => navigate("/Login")}>Login</button>
          </div>
        </section>
      </MainLayout>
    );
  }

  const name = user.name || "SHIVRAM Customer";
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const coins = walletCoins;
  const address = [user.houseAreaStreet, user.city, user.state, user.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <MainLayout>
      <main className="account-page">
        <header className="account-heading">
          <div>
            <p className="account-eyebrow">YOUR SHIVRAM SPACE</p>
            <h1>My Account</h1>
            <p className="account-subtitle">Manage your profile, check your account status and view your rewards.</p>
          </div>
          <span className="account-status"><span /> Active Account</span>
        </header>

        <section className="account-profile-card">
          <div className="account-avatar">{initial}</div>
          <div className="account-profile-info">
            <h2>{name}</h2>
            <p>{user.email || "Email not available"}</p>
            {user.phone && <p>{user.phone}</p>}
            <span className="account-member-badge">SHIVRAM Member</span>
          </div>
          <div className="account-profile-actions">
            <NavLink className="account-outline-btn" to="/MyOrders">My Orders</NavLink>
          </div>
        </section>

        <section className="account-summary-grid">
          <article className="account-summary-card coins-card">
            <div className="summary-icon">🪙</div>
            <p className="summary-label">SHIVRAM Coins Balance</p>
            <div className="summary-value">{coins.toLocaleString("en-IN")} <span>coins</span></div>
            <p className="summary-note">Use your available coins for eligible purchases at checkout. 1 coin = ₹1.</p>
            <button type="button" className="account-outline-btn wallet-refresh-btn" onClick={refreshWallet} disabled={walletLoading}>
              {walletLoading ? "Refreshing…" : "↻ Refresh balance"}
            </button>
            {walletError && <p className="wallet-error" role="alert">{walletError}</p>}
            {walletUpdatedAt && <p className="wallet-updated">Updated at {walletUpdatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>}
            <NavLink to="/" className="account-text-link">Explore products <span>→</span></NavLink>
          </article>
          <article className="account-summary-card">
            <div className="summary-icon status-icon">✓</div>
            <p className="summary-label">Account Status</p>
            <div className="summary-value status-value">Active</div>
            <p className="summary-note">You are signed in and can shop with your account.</p>
          </article>
          <article className="account-summary-card">
            <div className="summary-icon">📦</div>
            <p className="summary-label">Orders & Purchases</p>
            <div className="summary-value summary-word">Track your orders</div>
            <p className="summary-note">Check order details and delivery updates.</p>
            <NavLink to="/MyOrders" className="account-text-link">View orders <span>→</span></NavLink>
          </article>
        </section>

        <section className="account-details-card">
          <div className="account-section-heading">
            <div><p className="account-eyebrow">PERSONAL INFORMATION</p><h2>Profile Details</h2></div>
            <span className="account-readonly-label">Registered details</span>
          </div>
          <div className="account-details-grid">
            <div className="account-detail"><span>Full Name</span><strong>{name}</strong></div>
            <div className="account-detail"><span>Email Address</span><strong>{user.email || "Not provided"}</strong></div>
            <div className="account-detail"><span>Mobile Number</span><strong>{user.phone || "Not provided"}</strong></div>
            <div className="account-detail"><span>Delivery Address</span><strong>{address || "No address saved"}</strong></div>
          </div>
        </section>

        <section className="account-details-card account-review-section">
          <div className="account-section-heading">
            <div><p className="account-eyebrow">YOUR FEEDBACK MATTERS</p><h2>Product Reviews</h2></div>
            <span className="account-readonly-label">Purchased products only</span>
          </div>
          <p className="review-intro">{reviewRequests.length ? "Aapne product purchase kiya hai! Neeche message ke through apna experience share karein. Aapka review product ki public rating update karega." : "Abhi koi pending review nahi hai. Product purchase karne ke baad yahan review request message milega."}</p>
          {reviewMessage && <p className="review-success" role="status">{reviewMessage}</p>}
          {reviewError && <p className="review-error" role="alert">{reviewError}</p>}
          {reviewRequests.map((item) => {
            const form = reviewForms[item.productId] || { rating: 5, comment: "" };
            return <article className="review-request-card" key={`${item.productId}-${item.orderId}`}>
              <div className="review-product-info">
                {item.image && <img src={item.image} alt={item.title} />}
                <div><strong>{item.title}</strong><p>{item.message}</p><small>Order: {item.orderId}</small></div>
              </div>
              <label className="review-field-label" htmlFor={`review-rating-${item.productId}`}>Your rating</label>
              <select id={`review-rating-${item.productId}`} value={form.rating} onChange={(e) => setReviewForms((prev) => ({ ...prev, [item.productId]: { ...form, rating: e.target.value } }))}>
                <option value="5">★★★★★ — Excellent</option><option value="4">★★★★ — Very good</option><option value="3">★★★ — Good</option><option value="2">★★ — Fair</option><option value="1">★ — Poor</option>
              </select>
              <label className="review-field-label" htmlFor={`review-comment-${item.productId}`}>Your review (optional)</label>
              <textarea id={`review-comment-${item.productId}`} rows="3" maxLength="1000" placeholder="Product kaisa laga? Apna experience batayein..." value={form.comment} onChange={(e) => setReviewForms((prev) => ({ ...prev, [item.productId]: { ...form, comment: e.target.value } }))} />
              <button type="button" className="account-primary-btn review-submit-btn" disabled={reviewLoading} onClick={() => submitReview(item)}>{reviewLoading ? "Submitting…" : "Submit review"}</button>
            </article>;
          })}
        </section>

        <section className="account-coins-note">
          <span className="coins-note-icon">💡</span>
          <div><strong>Make every purchase count</strong><p>Earn SHIVRAM Coins on eligible orders and redeem your available balance on a future purchase. Your balance is refreshed from the server when this page opens. Use Refresh balance to check the latest wallet total.</p></div>
        </section>
      </main>
    </MainLayout>
  );
}
