
import Products from '../Component/Products.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css'

function TShirt() {
  return (
    <MainLayout>
    <section className='body-section'>
      <div className='container'>
        <div className="ItemContent">
        <h2>Men's T-Shirt Collection</h2>
        <p> Refresh your everyday wardrobe with SHIVRAM's premium collection
              of men's T-Shirts. Choose from trendy, comfortable, and stylish
              designs perfect for casual wear and every season.</p>
              </div>
        <div className="row"><Products /></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default TShirt;
