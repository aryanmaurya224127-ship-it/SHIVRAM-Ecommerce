import { NavLink } from "react-router-dom";
import "../Style/Footer.css";

function Footer() {
  return (
    <footer className="container-fluid bg-dark text-light mt-5 ">
         {/* Customer Support */}
          <div className="icons">
        <NavLink to="/MyAccount">My Account</NavLink>
        <NavLink to="/Orders">Orders</NavLink>
        <NavLink to="/Returns">Returns</NavLink>
        <NavLink to="/FAQs">FAQs</NavLink>
        <NavLink to="/ContactUs">Contact Us</NavLink>
      </div>
    <div className="container">
  <div className="row">

      
              <div className="logo-name ">
          <NavLink to="/" className="Logo"style={{color:"blue"}}>
        SHIV<span id="ANAND" style={{color:"lch(51.09% 96.03 40.51)"}}>RAM</span>
          </NavLink>
        </div>
          <div className="col-lg-4 col-md-6 mb-4">
        <p>
            SHIVRAM is your trusted destination for premium men's fashion.
          Explore stylish Shirts, T-Shirts, Trousers, Watches, Casual Shoes,
        and Formal Shoes designed for comfort, confidence, and everyday elegance.
      </p>
          </div>


         {/* Customer Support */}
          

        

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6 m-4">
            <h5 className="text-warning">Newsletter</h5>
            <p>
              Subscribe to receive updates about new arrivals, offers and
              discounts.
            </p>

            <form>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
                <button className="btn btn-warning" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0">
            © 2026 SHIVRAM  Men's Fashion Store. All Rights Reserved.
          </p>

          <div>
            <a href="#" className="text-light me-3 text-decoration-none">
              Privacy Policy
            </a>

            <a href="#" className="text-light me-3 text-decoration-none">
              Terms & Conditions
            </a>

            <a href="#" className="text-light text-decoration-none">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;