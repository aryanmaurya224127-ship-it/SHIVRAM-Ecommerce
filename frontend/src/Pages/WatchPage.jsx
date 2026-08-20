
import Products from '../Component/Products.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css'
import { watch } from '../data/productsData.js';

function WatchPage() {
  return (
    <MainLayout>
    <section className='body-section'>
      <div className='container'>
        <div className="ItemContent">
        <h2>Men's Watch Collection</h2>
        <p> Complete your look with SHIVRAM's premium collection of men's
              watches. Discover elegant, modern, and stylish timepieces
              designed for every occasion.</p>
              </div>
        <div className="row"><Products products={watch}/></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default WatchPage;
