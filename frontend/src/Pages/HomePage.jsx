import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";
import Products from '../Component/Products.jsx';
import { home } from "../data/productsData.js";

function HomePage() {
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
            <Products products={home}/>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;