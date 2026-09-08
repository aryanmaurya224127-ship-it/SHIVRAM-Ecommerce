
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import '../Style/item.css'
function Products({products}) {

  const { addToCart } = useCart();

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
    <Link to={`/ProductDetail/${product.productId}`}>
    <img
      src={product.image}
      alt={product.CardTitle}
      className="product-image"
    />
    </Link>
    

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
    ⭐ {product.Rating} | ({product.Reviews} Reviews )
</p> 
<p className="delivery">
    🚚 Free Delivery
</p>

  <button className="btn btn-warning px-4" onClick={() => addToCart(product)} >
  Add to Cart
</button>

</div>
        );
      })}
    </div>
  );
}

export default Products;