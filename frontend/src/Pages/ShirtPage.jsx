import Products from '../Component/Products.jsx';
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";
import { useProducts } from '../context/ProductContext.jsx';

import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css';

function ShirtPage() {

  const { products, loading } = useProducts();

  const shirt = products.filter(
    (product) => product.Category?.toLowerCase() === "shirt"
  );

  if (loading) {
    return <h3 className="text-center mt-5">Loading products...</h3>;
  }

  return (
    <>
      <Navbar />

      <div className="ItemContent">
        <h2>Men's Shirt Collection</h2>

        <p>
          Discover SHIVRAM's premium collection of men's shirts.
          Perfect for office wear, casual outings, and every occasion,
          offering comfort, durability, and modern style.
        </p>
      </div>

      <section className="body-section">
        <div className="container">
          <div className="row">
            <Products products={shirt} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ShirtPage;