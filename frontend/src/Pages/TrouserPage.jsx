
import Products from '../Component/Products.jsx';
import { trouser } from '../data/productsData.js';
import MainLayout from '../Layout/MainLayout.jsx';
import '../Style/item.css'

function TrouserPage() {
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
        <div className="row"><Products products={trouser}/></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default TrouserPage;
