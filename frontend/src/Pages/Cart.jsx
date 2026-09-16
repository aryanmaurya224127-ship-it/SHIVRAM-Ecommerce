
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import MainLayout from "../Layout/MainLayout.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  return (
    <MainLayout>
      <div className="container py-4">

<h2 className="mb-4">My Cart</h2>

{cart.length === 0 ? (
  <div className="text-center">
    <h4>Your Cart is Empty 🛒</h4>
    <p>Add some products to your cart.</p>
  </div>
) : (

  <div className="row g-4">

  {cart.map((item) => {
    const finalPrice =  item.Price -(item.Price * item.Discount) / 100;
const totalPrice =finalPrice * item.quantity;

return (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3"  key={item.productId}>
<div className="card h-100 shadow-sm">

{/* Product Image */}
  <div className="text-center p-3">

<div style={{width: "200px", height: "200px",  margin: "auto",display: "flex",  alignItems: "center",  justifyContent: "center",  backgroundColor: "#f5f5f5",  borderRadius: "8px",  overflow: "hidden",}}  >
<img  src={item.image}  alt={item.CardTitle}  style={{  width: "100%",height: "100%",  objectFit: "cover",  }}  />
                    
  </div>

  </div>

      {/* Product Details */}
    <div className="card-body">

  <h5 className="card-title">  {item.CardTitle}    </h5>
  <p className="card-text text-secondary">  {item.ItemContent}  </p>

  <p className="card-text mb-1">
  Original Price:
    <del className="ms-2">  ₹{item.Price}</del>
    </p>

  <p className="card-text mb-1">
    Discount:
    <span className="text-danger ms-2">  {item.Discount}% OFF  </span>
  </p>

  <p className="card-text">
  Price of one item:
  <strong className="text-success ms-2">  ₹{finalPrice}  </strong>
</p>

    {/* Quantity Controls */}
    <div className="d-flex align-items-center gap-2 mb-3">

      <strong>Quantity:</strong>

<button  type="button"className="btn btn-outline-danger"  onClick={() =>  decreaseQuantity(  item.productId,  item.quantity  )}disabled={item.quantity <= 1}>
  −  </button>

<span className="fw-bold"style={{minWidth: "35px",textAlign: "center",fontSize: "18px",}}  >
{item.quantity}
</span>

  <button type="button"  className="btn btn-outline-success"onClick={() =>increaseQuantity(item.productId,item.quantity)}  >
    +
  </button>

    </div>
    <h6 className="fw-bold"> Total Price: ₹{totalPrice}  </h6>

  </div>

      {/* Buttons */}
    <div className="card-footer bg-white border-0">

    <button className="btn btn-danger w-100 mb-2"onClick={() =>removeFromCart(item.productId)}  >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg>
    Remove from Cart
</button>


<button
  type="button"
  className="btn btn-success w-100"
  onClick={() =>
    navigate(`/ProductDetail/${item.productId}`, {
      state: {
        quantity: item.quantity,
      },
    })
  }
>
  Continue
</button>



  </div>
      </div>

    </div>
  );
  })}

  </div>

  )}

  </div>
    </MainLayout>
  );
}

export default Cart;

