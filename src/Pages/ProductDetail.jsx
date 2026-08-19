
import detailContext from "../context/detailContext.jsx";
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/Card.css'

function ProductDetail() {
  const { cart, removeFromCart } = useCart();

  return (
    <MainLayout>
      <div classNameName="card mb-3" style="max-width: 540px;">
        {cart.map((item) => (
  <div className="row g-0" key={item.id}>
    <div className="col-md-4">
  <img src={item.image}alt={item.CardTitle} tyle={{ width: '150px',height: '150px',objectFit: 'cover'}}/>    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <h5 className="card-title">Brand: {item.CardTitle}</h5>
        <p className="card-text">Price of one item: ₹{item.Price}</p>
        <p className="card-text">Quantity: {item.quantity}</p>
        <h6 className="fw-bold">Total Price: ₹{item.Price * item.quantity}</h6>
      </div>
    </div>
  </div>
))};
</div>
    </MainLayout>
  );
}

export default ProductDetail;
