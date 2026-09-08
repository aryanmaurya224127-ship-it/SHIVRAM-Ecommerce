import Products from '../Component/Products.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import { useProducts } from '../context/ProductContext.jsx';

import '../Style/item.css';

function CasualShoesPage() {

  const { products, loading } = useProducts();

  const casualShoes = products.filter(
    (product) => product.productId >= 1 && product.productId <= 12
  );

  if (loading) {
    return <h3 className="text-center mt-5">Loading products...</h3>;
  }

  return (
    <MainLayout>
      <section className='body-section'>
        <div className='container'>

          <div className="ItemContent">
            <h2>Men's Casual Shoes Collection</h2>
            <p>
              Discover SHIVRAM's premium casual shoes designed for everyday
              comfort, modern style, and long-lasting durability.
            </p>
          </div>

          <div className="row">
            <Products products={casualShoes} />
          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default CasualShoesPage;