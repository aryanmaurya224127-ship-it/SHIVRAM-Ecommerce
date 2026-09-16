import "../Style/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState
} from "react";

import { useAuth } from "../context/AuthContext";

import { useCart } from "../context/CartContext";


function Navbar() {

  const navigate = useNavigate();


  // =========================================
  // AUTH
  // =========================================

  const {
    user,
    isLoggedIn,
    logout
  } = useAuth();


  // =========================================
  // CART
  // =========================================

  const {
    totalCartQuantity
  } = useCart();


  const [search, setSearch] =
    useState("");

  const [profileOpen, setProfileOpen] =
    useState(false);


  const profileRef =
    useRef(null);


  // =========================================
  // SEARCH
  // =========================================

  const handleSearch = (e) => {

    e.preventDefault();


    if (search.trim() === "") {
      return;
    }


    navigate(
      `/Search?query=${encodeURIComponent(
        search
      )}`
    );

  };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    logout();

    setProfileOpen(false);

    navigate("/");

  };


  // =========================================
  // CLOSE PROFILE
  // WHEN CLICKING OUTSIDE
  // =========================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {

          setProfileOpen(false);

        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // =========================================
  // FIRST LETTER
  // =========================================

  const firstLetter =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";


  return (

    <header className="Head">


      {/* =================================
          TOP HEADER
      ================================= */}

      <div className="navbar-top">


        {/* =================================
            LOGO
        ================================= */}

        <div className="logo-name">

          <NavLink
            to="/"
            className="Logo"
          >

            SHIV

            <span className="logo-ram">
              RAM
            </span>

          </NavLink>

        </div>


        {/* =================================
            SEARCH
        ================================= */}

        <form
          className="search-form"
          onSubmit={handleSearch}
        >

          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <button type="submit">
            🔍
          </button>

        </form>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div className="navbar-actions">


          {/* =================================
              USER PROFILE
          ================================= */}

          {isLoggedIn ? (

            <div
              className="profile-wrapper"
              ref={profileRef}
            >


              {/* PROFILE CIRCLE */}

              <button
                type="button"
                className="profile-circle"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                aria-label="Open profile menu"
              >

                {firstLetter}

              </button>


              {/* PROFILE DROPDOWN */}

              {profileOpen && (

                <div className="profile-dropdown">


                  {/* BIG PROFILE CIRCLE */}

                  <div className="profile-avatar-large">

                    {firstLetter}

                  </div>


                  {/* NAME */}

                  <h4>
                    {user?.name}
                  </h4>


                  {/* EMAIL */}

                  <p className="profile-email">

                    {user?.email}

                  </p>


                  {/* PHONE */}

                  {user?.phone && (

                    <p className="profile-phone">

                      {user.phone}

                    </p>

                  )}


                  <hr />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >

                    Logout

                  </button>


                </div>

              )}

            </div>

          ) : (

            /* LOGIN BUTTON */

            <NavLink to="/Login">

              <button
                className="login-nav-btn"
              >

                Login

              </button>

            </NavLink>

          )}


          {/* =================================
              CART
          ================================= */}

          <NavLink
            to="/Cart"
            className="cart-link"
          >

            <button className="cart-btn">


              {/* CART ICON */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="currentColor"
                viewBox="0 0 16 16"
              >

                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0-2-2m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />

              </svg>


              {/* CART TEXT */}

              <span>
                Cart
              </span>


              {/* =================================
                  CART QUANTITY BADGE
              ================================= */}

              {totalCartQuantity > 0 && (

                <span className="cart-count">

                  {totalCartQuantity}

                </span>

              )}

            </button>

          </NavLink>


        </div>

      </div>


      {/* =================================
          CATEGORY NAVIGATION
      ================================= */}

      <nav className="icons">


        <NavLink to="/">
          Home
        </NavLink>


        <NavLink to="/TShirtPage">
          T-Shirt
        </NavLink>


        <NavLink to="/TrouserPage">
          Trouser
        </NavLink>


        <NavLink to="/CasualShoesPage">
          Casual Shoes
        </NavLink>


        <NavLink to="/FormalShoesPage">
          Formal Shoes
        </NavLink>


        <NavLink to="/ShirtPage">
          Shirt
        </NavLink>


        <NavLink to="/WatchPage">
          Watch
        </NavLink>


      </nav>


    </header>

  );

}


export default Navbar;