import { useCart } from '../context/CartContext.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/Card.css';

function Cart() {
  const { cart, removeFromCart } = useCart();

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

            {cart.map((item) => (

              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>

                <div className="card h-100 shadow-sm">

                  <div className="text-center p-3">
                    <img src={item.image}alt={item.CardTitle} tyle={{ width: '150px',height: '150px',objectFit: 'cover'}}/>
                  </div>

                  <div className="card-body">

                    <h5 className="card-title">Brand: {item.CardTitle}</h5>

                    <p className="card-text">Price of one item: ₹{item.Price}</p>

                    <p className="card-text">Quantity: {item.quantity}</p>

                    <h6 className="fw-bold">Total Price: ₹{item.Price * item.quantity}</h6>

                  </div>

                  <div className="card-footer bg-white border-0">

                    <button className="btn btn-danger w-100"onClick={() => removeFromCart(item.id)}>
                      Remove from Cart
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </MainLayout>
  );
}

export default Cart;