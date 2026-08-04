
import TrouserStore from '../PagesItems/TrouserStore.jsx';
import MainLayout from '../Layout/MainLayout.jsx';
import '../Style/item.css'

function Trouser() {
  return (
    <MainLayout>
    <section className='body-section'>
      <div className='container'>
        <div clasNAme="ItemContent">
        <h2>Men's Trouser Collection</h2>
        <p> Discover SHIVRAM's premium collection of men's trousers.
              Perfect for office wear, casual outings, and every occasion,
              offering comfort, durability, and modern style.</p>
              </div>
        <div className="row"><TrouserStore /></div>
        </div>
    </section>
    </MainLayout>
  );
}

export default Trouser;
