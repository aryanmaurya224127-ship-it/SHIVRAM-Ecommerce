
import Products from '../Component/Products.jsx';
import { casualShoes } from '../data/productsData.js';
import MainLayout from '../Layout/MainLayout.jsx';

import '../Style/item.css'

function CasualShoesPage() {
  return (
    <>
        <MainLayout>
          <section className='body-section'>
      <div className='container'>
        <div className="ItemContent">
        <h2>Men's Casual Shoes Collection</h2>
        <p> Discover SHIVRAM's premium casual shoes designed for everyday
              comfort, modern style, and long-lasting durability.</p>
              </div>
        <div className="row"><Products products={casualShoes} /></div>
      
        </div>
    </section>

      </MainLayout>
    
    </>
  );
}

export default CasualShoesPage;
