
import {  useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../Style/item.css";

function Products({ products }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // LOGIN CHECK
  const requireLogin = (action) => {
    if (!isLoggedIn) {
      const shouldLogin = window.confirm(
        `🔐 Login Required\n\nPlease login to ${action}.\n\nClick OK to login.`
      );

      if (shouldLogin) {
        navigate("/Login");
      }

      return false;
    }

    return true;
  };

  // ADD TO CART
  const handleAddToCart = (product) => {
    if (!requireLogin("continue shopping")) {
      return;
    }

    addToCart(product);
  };

  // PRODUCT DETAIL
  const handleProductDetail = (productId) => {
    if (!requireLogin("view product details")) {
      return;
    }

    navigate(`/ProductDetail/${productId}`);
  };

  return (
    <div className="products-container">
      {products.map((product) => {
        console.log("PRODUCT:", product);
        console.log("PRODUCT ID:", product.productId);

        const finalPrice =
          product.Price - (product.Price * product.Discount) / 100;

        return (
          <div className="product-card" key={product.productId}>

            <div className="image-box">

              {/* PRODUCT IMAGE */}
              <button
                type="button"
                className="product-link-button"
                onClick={() => handleProductDetail(product.productId)}
              >
                <img
                  src={product.image}
                  alt={product.CardTitle}
                  className="product-image"
                />
              </button>

              <span className="offer-badge">
                {product.Discount}% OFF
              </span>
            </div>

            <h3>{product.CardTitle}</h3>

            <p>{product.ItemContent}</p>

            <p className="old-price">₹{product.Price}</p>

            <h3 className="new-price">
              ₹{finalPrice}
            </h3>

            <p className="rating">
              ⭐ {product.Rating} | ({product.Reviews} Reviews)
            </p>

            <p className="delivery">
              🚚 Free Delivery
            </p>

            {/* ADD TO CART */}
            <button
              className="btn btn-warning px-4"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>

          </div>
        );
      })}
    </div>
  );
}

export default Products;

