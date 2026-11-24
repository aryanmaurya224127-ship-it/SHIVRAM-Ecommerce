import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layout/MainLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import "../Style/ProductCheckout.css";
import "../Style/ProductDetailSimple.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://shivram-backend.onrender.com";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products/${productId}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Product could not be loaded.");
        return data;
      })
      .then((data) => { if (active) setProduct(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId]);

  const requireLogin = () => {
    if (isLoggedIn) return true;
    navigate("/Login", { state: { from: `/ProductDetail/${productId}` } });
    return false;
  };

  const price = Number(product?.Price || 0);
  const discount = Math.min(100, Math.max(0, Number(product?.Discount || 0)));
  const finalPrice = Math.max(0, Math.round(price * (1 - discount / 100)));

  const handleAddToCart = async () => {
    if (!requireLogin()) return;
    setAdding(true); setError(""); setMessage("");
    const result = await addToCart({ ...product, quantity });
    if (result?.success) setMessage("Product added to your cart.");
    else setError(result?.message || "Could not add product to cart.");
    setAdding(false);
  };

  const handleBuyNow = () => {
    if (!requireLogin()) return;
    navigate("/Checkout", {
      state: {
        fromCart: false,
        items: [{ ...product, productId: Number(product.productId), quantity }],
      },
    });
  };

  if (loading) return <MainLayout><div className="simple-product-state">Loading product…</div></MainLayout>;
  if (!product) return <MainLayout><div className="simple-product-state error-text">{error || "Product not found."}</div></MainLayout>;

  return (
    <MainLayout>
      <main className="simple-product-page">
        <div className="simple-product-card">
          <div className="simple-product-image"><img src={product.image} alt={product.CardTitle} /></div>
          <section className="simple-product-info">
            <span className="simple-product-category">{product.Category}</span>
            <h1>{product.CardTitle}</h1>
            <p className="simple-product-description">{product.ItemContent}</p>
            <div className="simple-product-rating">★ {Number(product.Rating || 0).toFixed(1)} <span>({product.Reviews || 0} reviews)</span></div>
            <div className="simple-product-price"><strong>₹{finalPrice.toLocaleString("en-IN")}</strong>{discount > 0 && <><del>₹{price.toLocaleString("en-IN")}</del><span>{discount}% OFF</span></>}</div>
            <p className="simple-product-delivery">✓ Secure checkout · ✓ Easy order tracking · ✓ Customer support</p>
            <div className="simple-quantity"><span>Quantity</span><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))}>+</button></div>
            {error && <p className="simple-product-message error-text">{error}</p>}
            {message && <p className="simple-product-message success-text">{message}</p>}
            <div className="simple-product-actions">
              <button type="button" className="add-to-cart-action" onClick={handleAddToCart} disabled={adding || cartLoading}>{adding ? "Adding…" : "Add to cart"}</button>
              <button type="button" className="buy-now-action" onClick={handleBuyNow}>Buy now · ₹{(finalPrice * quantity).toLocaleString("en-IN")}</button>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
}

export default ProductDetail;
