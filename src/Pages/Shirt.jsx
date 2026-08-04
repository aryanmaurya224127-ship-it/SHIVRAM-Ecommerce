
import ShirtStore from '../PagesItems/ShirtStore.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/item.css'

function Shirt() {
  return (
    <MainLayout>
    <section className='body-section'>
      <div className='container'>
        <div className="ItemContent">
        <h2>Men's Shirt Collections</h2>
        <p>Explore premium shirts from SHIVRAM. Find the perfect style for
              casual outings, office wear, and special occasions.</p>
      </div>
        <div className="row"><ShirtStore /></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default Shirt;
