

import { useCart } from "../context/CartContext";

function Products({products}) {

  const { addToCart } = useCart();

  return (  
    <div className="products-container">
      {products.map((product) => {
        const finalPrice =
          product.Price - (product.Price * product.Discount) / 100;

        return (
          <div className="product-card" key={product.id}>
  <div className="image-box">
    <img
      src={product.image}
      alt={product.CardTitle}
      className="product-image"
    />

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
  <a href="/ProductDetail"><button className="buy-btn">Detail Now</button></a>
   <button className="Card-btn" onClick={() => addToCart(product)}>Add to Card</button>
</div>
        );
      })}
    </div>
  );
}

export default Products;