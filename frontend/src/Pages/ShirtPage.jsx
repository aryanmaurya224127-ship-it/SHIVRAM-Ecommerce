
import Products from '../Component/Products.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css'
import { shirt } from '../data/productsData.js';

function ShirtPage() {
  return (
    <MainLayout>
    <section className='body-section'>
      <div className='container'>
        <div className="ItemContent">
        <h2>Men's Trouser Collection</h2>
        <p> Discover SHIVRAM's premium collection of men's trousers.
              Perfect for office wear, casual outings, and every occasion,
              offering comfort, durability, and modern style.</p>
              </div>
        <div className="row"><Products products={shirt}/></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default ShirtPage;
