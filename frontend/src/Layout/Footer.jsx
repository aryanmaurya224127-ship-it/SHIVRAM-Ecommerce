import "../Style/Footer.css";

function Footer() {
  return (
    <footer className="container-fluid bg-dark text-light mt-5 py-5">
    <div className="container">
  <div className="row">

      <div className="col-lg-4 col-md-6 mb-4">
            <h3 className="text-warning fw-bold">SHIVRAM</h3>
        <p>
            SHIVRAM is your trusted destination for premium men's fashion.
          Explore stylish Shirts, T-Shirts, Trousers, Watches, Casual Shoes,
        and Formal Shoes designed for comfort, confidence, and everyday elegance.
      </p>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-warning">Categories</h5>
            <ul className="nav flex-column">
          <li className="nav-item"><a href="/shirt" className="nav-link text-light">Shirts</a></li>
            <li className="nav-item"><a href="/tshirt" className="nav-link text-light">T-Shirts</a></li>
            <li className="nav-item"><a href="/trouser" className="nav-link text-light">Trousers</a></li>
          <li className="nav-item"><a href="/watch" className="nav-link text-light">Watches</a></li>
            <li className="nav-item"><a href="/CasualShoes" className="nav-link text-light">Casual Shoes</a></li>
      <li className="nav-item"><a href="/FormalShoes" className="nav-link text-light">Formal Shoes</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-lg-2 col-md-6 mb-4">
    <h5 className="text-warning">Support</h5>
          <ul className="nav flex-column">
      <li className="nav-item"><a href="#" className="nav-link text-light">My Account</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-light">Orders</a></li>
    <li className="nav-item"><a href="#" className="nav-link text-light">Returns</a></li>
        <li className="nav-item"><a href="#" className="nav-link text-light">FAQs</a></li>
        <li className="nav-item"><a href="#" className="nav-link text-light">Contact Us</a></li>
          </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6 mb-4">
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