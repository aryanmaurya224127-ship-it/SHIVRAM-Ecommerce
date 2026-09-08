import Products from '../Component/Products.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import { useProducts } from '../context/ProductContext.jsx';

import '../Style/item.css';

function TrouserPage() {

  const { products, loading } = useProducts();

  const trouser = products.filter(
    (product) => product.Category === "trouser"
  );

  if (loading) {
    return <h3 className="text-center mt-5">Loading products...</h3>;
  }

  return (
    <MainLayout>
      <section className='body-section'>
        <div className='container'>

          <div className="ItemContent">
            <h2>Men's Trouser Collection</h2>

            <p>
              Discover SHIVRAM's premium collection of men's trousers.
              Perfect for office wear, casual outings, and every occasion,
              offering comfort, durability, and modern style.
            </p>
          </div>

          <div className="row">
            <Products products={trouser} />
          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default TrouserPage;