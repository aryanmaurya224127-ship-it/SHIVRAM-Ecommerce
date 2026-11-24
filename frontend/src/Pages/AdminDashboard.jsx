import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../Layout/MainLayout.jsx";
import "../Style/AdminDashboard.css";

const API_BASE = import.meta.env.VITE_API_URL || "https://shivram-backend.onrender.com";
const ORDER_STATUSES = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
const EMPTY_PRODUCT = { image: "", Category: "Shirt", Price: "", Discount: "0", CardTitle: "", ItemContent: "" };
const TABS = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "products", label: "Products", icon: "□" },
  { id: "orders", label: "Orders", icon: "▤" },
  { id: "customers", label: "Customers", icon: "♙" },
  { id: "reviews", label: "Reviews", icon: "★" },
];

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [summary, setSummary] = useState({ stats: { products: 0, customers: 0, orders: 0, revenue: 0, pendingOrders: 0 }, recentOrders: [] });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(data.message || "Admin access required. Please sign in with an admin account.");
      }
      throw new Error(data.message || "Request complete nahi ho payi.");
    }
    return data;
  }, [token]);

  const loadDashboard = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const [summaryData, productData, orderData, customerData, reviewData] = await Promise.all([
        request("/api/admin/summary"),
        request("/api/admin/products"),
        request("/api/admin/orders"),
        request("/api/admin/customers"),
        request("/api/admin/reviews"),
      ]);
      setSummary(summaryData);
      setProducts(Array.isArray(productData) ? productData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setCustomers(Array.isArray(customerData) ? customerData : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (err) {
      setError(err.message || "Dashboard load nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return { products, orders, customers, reviews };
    return {
      products: products.filter((p) => `${p.CardTitle} ${p.Category} ${p.productId}`.toLowerCase().includes(term)),
      orders: orders.filter((o) => `${o.orderId} ${o.userId?.name || ""} ${o.userId?.email || ""} ${o.orderStatus}`.toLowerCase().includes(term)),
      customers: customers.filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(term)),
      reviews: reviews.filter((r) => `${r.productTitle} ${r.userName} ${r.comment}`.toLowerCase().includes(term)),
    };
  }, [search, products, orders, customers, reviews]);

  const openNewProduct = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT);
    setShowProductForm(true);
    setNotice("");
  };

  const openEditProduct = (product) => {
    setEditingProductId(product.productId);
    setProductForm({
      image: product.image || "",
      Category: product.Category || "",
      Price: String(product.Price ?? ""),
      Discount: String(product.Discount ?? 0),
      CardTitle: product.CardTitle || "",
      ItemContent: product.ItemContent || "",
    });
    setShowProductForm(true);
    setNotice("");
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const path = editingProductId
        ? `/api/admin/products/${editingProductId}`
        : "/api/admin/products";
      const result = await request(path, {
        method: editingProductId ? "PUT" : "POST",
        body: JSON.stringify({
          ...productForm,
          Price: Number(productForm.Price),
          Discount: Number(productForm.Discount),
        }),
      });
      setNotice(result.message || "Product saved.");
      setShowProductForm(false);
      await loadDashboard(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`"${product.CardTitle}" ko delete karna hai?`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await request(`/api/admin/products/${product.productId}`, { method: "DELETE" });
      setNotice(result.message || "Product deleted.");
      await loadDashboard(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await request(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setNotice(result.message || "Order status updated.");
      await loadDashboard(false);
    } catch (err) {
      setError(err.message);
      await loadDashboard(false);
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    logout();
    navigate("/Login");
  };

  const stats = summary.stats || {};
  const displayOrders = tab === "overview" ? (summary.recentOrders || []) : filtered.orders;

  return (
    <MainLayout>
      <main className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand"><span className="admin-brand-mark">S</span><div><strong>SHIVRAM</strong><small>ADMIN PANEL</small></div></div>
          <div className="admin-side-label">WORKSPACE</div>
          <nav className="admin-side-nav" aria-label="Admin sections">
            {TABS.map((item) => (
              <button key={item.id} type="button" className={tab === item.id ? "active" : ""} onClick={() => { setTab(item.id); setSearch(""); setNotice(""); }}>
                <span className="admin-nav-icon">{item.icon}</span>{item.label}
                {item.id === "orders" && stats.pendingOrders > 0 && <span className="admin-nav-count">{stats.pendingOrders}</span>}
              </button>
            ))}
          </nav>
          <div className="admin-sidebar-bottom">
            <div className="admin-mini-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div className="admin-mini-user"><strong>{user?.name || "Administrator"}</strong><small>Administrator</small></div>
            <button type="button" title="Logout" onClick={signOut} className="admin-logout">↪</button>
          </div>
        </aside>

        <section className="admin-main">
          <header className="admin-topbar">
            <div><div className="admin-breadcrumb">Workspace <span>/</span> {TABS.find((t) => t.id === tab)?.label}</div><h1>{TABS.find((t) => t.id === tab)?.label}</h1></div>
            <div className="admin-top-actions">
              <span className="admin-live-dot">System active</span>
              <button type="button" className="admin-refresh" onClick={() => loadDashboard()} disabled={loading || busy}>↻ Refresh</button>
            </div>
          </header>

          {error && <div className="admin-alert error" role="alert"><span>!</span><div>{error}<small>Check karein ki backend running hai aur aap admin account se logged in hain.</small></div><button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
          {notice && <div className="admin-alert success" role="status"><span>✓</span><div>{notice}</div><button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}

          {loading ? (
            <div className="admin-loading"><span className="admin-spinner" /> Dashboard data load ho raha hai…</div>
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <div className="admin-welcome"><div><p>OVERVIEW</p><h2>Good to see you, {user?.name?.split(" ")[0] || "Admin"} 👋</h2><span>Here’s what’s happening with your store today.</span></div><div className="admin-welcome-icon">▥</div></div>
                  <div className="admin-stat-grid">
                    <StatCard icon="▧" label="Total Revenue" value={money(stats.revenue)} note="Excludes cancelled orders" tone="purple" />
                    <StatCard icon="▤" label="Total Orders" value={stats.orders || 0} note={`${stats.pendingOrders || 0} need attention`} tone="blue" />
                    <StatCard icon="□" label="Products" value={stats.products || 0} note="In your catalogue" tone="orange" />
                    <StatCard icon="♙" label="Customers" value={stats.customers || 0} note="Registered customers" tone="green" />
                  </div>
                  <div className="admin-panel">
                    <div className="admin-panel-heading"><div><h2>Recent orders</h2><p>Latest activity from your store</p></div><button className="admin-text-button" onClick={() => setTab("orders")}>View all orders →</button></div>
                    <OrdersTable orders={displayOrders} busy={busy} onStatusChange={updateOrderStatus} compact />
                  </div>
                  <div className="admin-overview-bottom">
                    <div className="admin-insight-card"><span className="admin-insight-icon blue">↗</span><div><strong>Product catalogue</strong><p>{stats.products || 0} products currently available.</p></div><button onClick={() => setTab("products")}>Manage products →</button></div>
                    <div className="admin-insight-card"><span className="admin-insight-icon green">♙</span><div><strong>Customer directory</strong><p>{stats.customers || 0} customer accounts.</p></div><button onClick={() => setTab("customers")}>View customers →</button></div>
                  </div>
                </>
              )}

              {tab !== "overview" && (
                <div className="admin-panel admin-data-panel">
                  <div className="admin-panel-heading admin-list-heading">
                    <div><h2>{TABS.find((t) => t.id === tab)?.label} management</h2><p>{tab === "products" ? `${filtered.products.length} products in catalogue` : tab === "orders" ? `${filtered.orders.length} orders found` : tab === "customers" ? `${filtered.customers.length} customer accounts` : `${filtered.reviews.length} customer reviews`}</p></div>
                    <div className="admin-list-actions">
                      <label className="admin-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tab}…`} /></label>
                      {tab === "products" && <button className="admin-primary-button" onClick={openNewProduct}>＋ Add product</button>}
                    </div>
                  </div>
                  {tab === "products" && (
                    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PRODUCT</th><th>ID</th><th>CATEGORY</th><th>PRICE</th><th>DISCOUNT</th><th>RATING</th><th>ACTIONS</th></tr></thead><tbody>
                      {filtered.products.map((p) => <tr key={p.productId}><td><div className="admin-product-cell">{p.image ? <img src={p.image} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /> : <span className="admin-product-placeholder">□</span>}<div><strong>{p.CardTitle}</strong><small>{p.ItemContent}</small></div></div></td><td>#{p.productId}</td><td><span className="admin-category-pill">{p.Category}</span></td><td className="admin-money">{money(p.Price)}</td><td>{Number(p.Discount || 0)}%</td><td>★ {Number(p.Rating || 0).toFixed(1)} <small>({p.Reviews || 0})</small></td><td><div className="admin-row-actions"><button className="admin-edit-button" onClick={() => openEditProduct(p)}>Edit</button><button className="admin-delete-button" onClick={() => deleteProduct(p)} disabled={busy}>Delete</button></div></td></tr>)}
                      {!filtered.products.length && <EmptyRow columns={7} text="No products found." />}
                    </tbody></table></div>
                  )}
                  {tab === "orders" && <OrdersTable orders={filtered.orders} busy={busy} onStatusChange={updateOrderStatus} />}
                  {tab === "customers" && (
                    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CUSTOMER</th><th>PHONE</th><th>LOCATION</th><th>COINS</th><th>JOINED</th></tr></thead><tbody>
                      {filtered.customers.map((c) => <tr key={c._id}><td><div className="admin-customer-cell"><span>{(c.name || "C").charAt(0).toUpperCase()}</span><div><strong>{c.name}</strong><small>{c.email}</small></div></div></td><td>{c.phone || "—"}</td><td>{[c.city, c.state].filter(Boolean).join(", ") || "—"}</td><td><span className="admin-coins-pill">🪙 {Number(c.coins || 0)}</span></td><td>{dateLabel(c.createdAt)}</td></tr>)}
                      {!filtered.customers.length && <EmptyRow columns={5} text="No customers found." />}
                    </tbody></table></div>
                  )}
                  {tab === "reviews" && (
                    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PRODUCT</th><th>CUSTOMER</th><th>RATING</th><th>REVIEW</th><th>DATE</th></tr></thead><tbody>
                      {filtered.reviews.map((r) => <tr key={`${r.productId}-${r._id}`}><td><strong>{r.productTitle}</strong><small className="admin-subline">Product #{r.productId}</small></td><td>{r.userName || "Customer"}</td><td><span className="admin-rating-pill">★ {r.rating}/5</span></td><td className="admin-review-text">{r.comment || <em>No written comment</em>}</td><td>{dateLabel(r.createdAt)}</td></tr>)}
                      {!filtered.reviews.length && <EmptyRow columns={5} text="No customer reviews yet." />}
                    </tbody></table></div>
                  )}
                </div>
              )}
              <footer className="admin-footer"><span>SHIVRAM Admin Console</span><span>Store operations · {new Date().getFullYear()}</span></footer>
            </>
          )}
        </section>
      </main>

      {showProductForm && (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowProductForm(false); }}>
          <section className="admin-product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <header><div><p>CATALOGUE MANAGEMENT</p><h2 id="product-modal-title">{editingProductId ? "Edit product" : "Add new product"}</h2></div><button type="button" onClick={() => setShowProductForm(false)} aria-label="Close">×</button></header>
            <form onSubmit={saveProduct}>
              <label>Product title<input required maxLength={160} value={productForm.CardTitle} onChange={(e) => setProductForm({ ...productForm, CardTitle: e.target.value })} placeholder="e.g. Classic cotton shirt" /></label>
              <div className="admin-form-row"><label>Category<select value={productForm.Category} onChange={(e) => setProductForm({ ...productForm, Category: e.target.value })}>{["Shirt", "T-Shirt", "Trouser", "Watch", "Casual Shoes", "Formal Shoes", "Home", "Other"].map((c) => <option key={c}>{c}</option>)}</select></label><label>Price (₹)<input required type="number" min="0" step="1" value={productForm.Price} onChange={(e) => setProductForm({ ...productForm, Price: e.target.value })} /></label></div>
              <div className="admin-form-row"><label>Discount (%)<input type="number" min="0" max="100" step="1" value={productForm.Discount} onChange={(e) => setProductForm({ ...productForm, Discount: e.target.value })} /></label><label>Image URL<input required type="url" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://…" /></label></div>
              <label>Description<textarea required rows="3" maxLength={1200} value={productForm.ItemContent} onChange={(e) => setProductForm({ ...productForm, ItemContent: e.target.value })} placeholder="Product details…" /></label>
              <div className="admin-modal-actions"><button type="button" className="admin-cancel-button" onClick={() => setShowProductForm(false)}>Cancel</button><button type="submit" className="admin-primary-button" disabled={busy}>{busy ? "Saving…" : editingProductId ? "Save changes" : "Add product"}</button></div>
            </form>
          </section>
        </div>
      )}
    </MainLayout>
  );
}

function StatCard({ icon, label, value, note, tone }) {
  return <article className="admin-stat-card"><div className={`admin-stat-icon ${tone}`}>{icon}</div><p>{label}</p><strong>{value}</strong><small>{note}</small><span className={`admin-stat-decoration ${tone}`} /></article>;
}

function OrdersTable({ orders, busy, onStatusChange, compact = false }) {
  return (
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th>{!compact && <th>PAYMENT</th>}</tr></thead><tbody>
      {orders.map((order) => <tr key={order._id || order.orderId}><td><strong className="admin-order-id">{order.orderId || "—"}</strong><small className="admin-subline">{(order.items || []).length} item(s)</small></td><td><strong>{order.userId?.name || order.shippingDetails?.fullName || "Customer"}</strong><small className="admin-subline">{order.userId?.email || order.userId?.phone || ""}</small></td><td>{dateLabel(order.createdAt)}</td><td className="admin-money">{money(order.totalAmount)}</td><td><select aria-label={`Status for ${order.orderId}`} className={`admin-status-select ${String(order.orderStatus || "").toLowerCase().replaceAll(" ", "-")}`} value={order.orderStatus || "Order Placed"} onChange={(e) => onStatusChange(order.orderId, e.target.value)} disabled={busy}><option value={order.orderStatus || "Order Placed"}>{order.orderStatus || "Order Placed"}</option>{ORDER_STATUSES.filter((status) => status !== order.orderStatus).map((status) => <option key={status} value={status}>{status}</option>)}</select></td>{!compact && <td>{order.shippingDetails?.paymentMethod || "—"}</td>}</tr>)}
      {!orders.length && <EmptyRow columns={compact ? 5 : 6} text="No orders found." />}
    </tbody></table></div>
  );
}

function EmptyRow({ columns, text }) {
  return <tr><td colSpan={columns} className="admin-empty-row"><span>⌕</span><strong>{text}</strong></td></tr>;
}
