import "../Style/Header.css";

import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="Head">
      <div className="c">

        <div className="logo-name">
          <NavLink to="/" className="border">
        SHIV<span id="ANAND">RAM</span>
          </NavLink>
        </div>

        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
      <input
            type="search"
            className="form-control form-control-dark text-bg-dark"
            placeholder="Search..."
          />
        </form>

        <div className="text-end">
          <NavLink to="/Login"><button className="btn btn-outline-light me-2">Login</button></NavLink>
          
        
        <NavLink to="/Cart">  <button className="btn btn-warning">Cart</button></NavLink>
        </div>

      </div>

      <div className="icons">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/TShirtPage">T-Shirt</NavLink>
        <NavLink to="/TrouserPage">Trouser</NavLink>
        <NavLink to="/CasualShoesPage">Casual Shoes</NavLink>
        <NavLink to="/FormalShoesPage">Formal Shoes</NavLink>
        <NavLink to="/ShirtPage">Shirt</NavLink>
        <NavLink to="/WatchPage">Watch</NavLink>
      </div>
    </header>
  );
}

export default Navbar;