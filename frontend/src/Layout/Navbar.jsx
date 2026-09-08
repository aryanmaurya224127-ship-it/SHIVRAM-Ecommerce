import "../Style/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [search,setSearch] = useState("") ;
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if(search.trim()===""){
      return;
    }
    navigate(`/Search?query=${encodeURIComponent(search)}`);
  }


   return (
    <header className="Head">
      <div className="c">

        <div className="logo-name ">
          <NavLink to="/" className="Logo"style={{color:"blue"}}>
        SHIV<span id="ANAND" style={{color:"lch(51.09% 96.03 40.51)"}}>RAM</span>
          </NavLink>
        </div>

         <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"onSubmit={handleSearch}>
          <input
            type="search"
            className="form-control form-control-dark text-bg-dark"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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