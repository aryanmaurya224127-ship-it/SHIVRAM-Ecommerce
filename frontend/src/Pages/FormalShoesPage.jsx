import Products from '../Component/Products.jsx';
import MainLayout from "../Layout/MainLayout.jsx";
import { useProducts } from '../context/ProductContext.jsx';

import "../Style/item.css";

function FormalShoesPage() {

  const { products, loading } = useProducts();

  const formalShoes = products.filter(
    (product) => product.productId >= 13 && product.productId <= 24
  );

  if (loading) {
    return <h3 className="text-center mt-5">Loading products...</h3>;
  }

  return (
    <MainLayout>
      <section className="body-section py-5">
        <div className="container">

          <div className="ItemContent">
            <h2 className="fw-bold">Men's Formal Shoes Collection</h2>

            <p className="text-muted">
              Step into elegance with SHIVRAM's premium formal shoes.
              Perfect for office wear, business meetings, weddings,
              and every special occasion.
            </p>
          </div>

          <div className="row g-4">
            <Products products={formalShoes} />
          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default FormalShoesPage;