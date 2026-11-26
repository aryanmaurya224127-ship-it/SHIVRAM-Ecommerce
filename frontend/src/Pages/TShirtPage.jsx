import Products from "../Component/Products.jsx";
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";
import { useProducts } from '../context/ProductContext.jsx';

import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css';

function TShirtPage() {

  const { products, loading } = useProducts();

  const tShirt = products.filter(
    (product) => product.Category?.toLowerCase() === "t-shirt"
  );

  if (loading) {
    return <h3 className="text-center mt-5">Loading products...</h3>;
  }

  return (
    <>
      <Navbar />

      <div className="ItemContent">
        <h2>Men's T-Shirt Collection</h2>

        <p>
          Refresh your everyday wardrobe with SHIVRAM's premium collection
          of men's T-Shirts. Choose from trendy, comfortable, and stylish
          designs perfect for casual wear and every season.
        </p>
      </div>

      <section className="body-section">
        <div className="container">
          <div className="row">
            <Products products={tShirt} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default TShirtPage;