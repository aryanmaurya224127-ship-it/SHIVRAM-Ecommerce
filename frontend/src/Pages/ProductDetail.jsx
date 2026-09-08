
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../Style/item.css";

import MainLayout from "../Layout/MainLayout.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/Card.css";

function ProductDetail() {
  const { addToCart } = useCart();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Loading
  if (loading) {
    return (
      <MainLayout>
        <div className="container mt-5 text-center">
          <h3>Loading Product...</h3>
        </div>
      </MainLayout>
    );
  }

  // Product not found
  if (!product) {
    return (
      <MainLayout>
        <div className="container mt-5 text-center">
          <h2 className="text-danger">
            Product Not Found
          </h2>
        </div>
      </MainLayout>
    );
  }

  const finalPrice =
    product.Price -
    (product.Price * product.Discount) / 100;

  return (
    <MainLayout>
      <div
        className="container mt-5"
        style={{
          color: "red",
          background: "white",
          borderRadius: "20px",
        }}
      >
        <div className="row g-5 m-2">

          {/* Product Image */}
          <div className="col-md-6">
            <div className="card shadow border-0">
              <img
                src={product.image}
                alt={product.CardTitle}
                className="img-fluid rounded"
                style={{
                  width: "400px",
                  height: "450px",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">

            <h2 className="fw-bold">
              {product.CardTitle}
            </h2>

            <p className="text-secondary mt-3">
              {product.ItemContent}
            </p>

            {/* Original Price */}
            <p className="text-muted mb-1">
              <del>₹{product.Price}</del>
            </p>

            {/* Final Price */}
            <h3 className="text-success fw-bold">
              ₹{finalPrice}
            </h3>

            {/* Discount */}
            <p>
              <span className="badge bg-danger">
                {product.Discount}% OFF
              </span>
            </p>

            {/* Rating */}
            <p className="fs-5">
              ⭐ {product.Rating}
              <span className="text-muted">
                {" "}
                ({product.Reviews} Reviews)
              </span>
            </p>

            {/* Delivery */}
            <p className="text-success">
              🚚 Free Delivery
            </p>

            <input
              type="text"
              placeholder="Address"
            />

            {/* Buttons */}
            <div className="d-flex gap-3 mt-4">

              <button className="btn btn-success px-4">
                Buy Now
              </button>

              <button
                className="btn btn-warning px-4"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductDetail;
