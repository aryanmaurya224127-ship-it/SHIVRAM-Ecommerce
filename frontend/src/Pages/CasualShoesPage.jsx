import Products from '../Component/Products.jsx';

import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";
import { useProducts } from '../context/ProductContext.jsx';

import '../Style/item.css';

function CasualShoesPage() {

  const { products, loading } = useProducts();

  const casualShoes = products.filter(
    (product) => product.Category?.toLowerCase() === "casual shoes"
  );

  if (loading) {
    return <h3 className="text-center mt-5">Loading products...</h3>;
  }

  return (
    <>
      <Navbar />

      <div className="ItemContent">
        <h2>Men's Casual Shoes Collection</h2>
        <p>
          Discover SHIVRAM's premium casual shoes designed for everyday
          comfort, modern style, and long-lasting durability.
        </p>
      </div>

      <section className="body-section">
        <div className="container">
          <div className="row">
            <Products products={casualShoes} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CasualShoesPage;