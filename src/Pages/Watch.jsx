
import Products from '../Component/Products.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css'

function Watch() {
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
        <div className="row"><Products/></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default Watch;
