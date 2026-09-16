import { Routes, Route } from "react-router-dom";

import HomePage from "../Pages/HomePage.jsx";
import ShirtPage from "../Pages/ShirtPage.jsx";
import TShirtPage from "../Pages/TShirtPage.jsx";
import TrouserPage from "../Pages/TrouserPage.jsx";
import WatchPage from "../Pages/WatchPage.jsx";
import CasualShoesPage from "../Pages/CasualShoesPage.jsx";
import FormalShoesPage from "../Pages/FormalShoesPage.jsx";
import BuyButton from "../Pages/BuyButton.jsx";
import Login from "../Pages/Login.jsx";
import Cart from "../Pages/Cart.jsx";
import Search from "../Pages/Search.jsx";
import ProductDetail from "../Pages/ProductDetail.jsx";
import Register from "../Pages/Register.jsx";
import ForgotPassword  from "../Pages/ForgoyPassword.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/App.css";

function Body() {
  return (
    <>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        <Route path="/ShirtPage" element={<ShirtPage />} />
        <Route path="/TShirtPage" element={<TShirtPage />} />
        <Route path="/TrouserPage" element={<TrouserPage />} />
        <Route path="/WatchPage" element={<WatchPage />} />
        <Route path="/CasualShoesPage" element={<CasualShoesPage />} />
        <Route path="/FormalShoesPage" element={<FormalShoesPage />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/BuyButton" element={<BuyButton />} />

        {/* Protected Cart */}
        <Route
          path="/Cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Protected Product Detail */}
        <Route
          path="/ProductDetail/:productId"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

      

      </Routes>
    </>
  );
}

export default Body;
