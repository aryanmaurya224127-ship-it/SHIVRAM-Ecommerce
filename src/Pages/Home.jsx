import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Products from '../Component/Products.jsx';

function Home() {
  return (
    <>
      <Navbar />

      
    

    
      <section className="body-section py-5">
        <div className="container">

          <div className="Item Content">
            <h2 className="fw-bold">Welcome to SHIVRAM</h2>

            <p className="text-muted">
              Discover premium men's fashion with our exclusive collection of
              Shirts, T-Shirts, Trousers, Watches, Casual Shoes, and Formal Shoes.
              Upgrade your style with SHIVRAM.
            </p>
          </div>

          <div className="row g-4">
            <Products/>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;