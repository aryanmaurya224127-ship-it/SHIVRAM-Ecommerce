
import { Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage.jsx";
import ShirtPage from "../Pages/ShirtPage.jsx";
import TShirtPage from "../Pages/TShirtPage.jsx";
import TrouserPage from "../Pages/TrouserPage.jsx";
import WatchPage from "../Pages/WatchPage.jsx";
import CasualShoesPage from "../Pages/CasualShoesPage.jsx";
import FormalShoesPage from "../Pages/FormalShoesPage.jsx";
import BuyButton from "../Pages/BuyButton.jsx";
import Login from '../Pages/Login.jsx'
import Cart from '../Pages/Cart.jsx'
import ProductDetail from "../Pages/ProductDetail.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/App.css'


function Body() {
 

  return (
    <>
      <Routes className="container">
        <Route path="/" element={<HomePage />} />
        <Route path="/ShirtPage" element={<ShirtPage/>} />
        <Route path="/TShirtPage" element={<TShirtPage/>} />
        <Route path="/TrouserPage" element={<TrouserPage />} />
        <Route path="/WatchPAge" element={<WatchPage/>} /> 
        <Route path="/CasualShoesPage" element={<CasualShoesPage/>} />
        <Route path="FormalShoesPage" element={<FormalShoesPage />} />
        <Route path="BuyButton" element={<BuyButton/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Cart" element={<Cart/>} />
        
        <Route path="/ProductDetail" element={<ProductDetail/>} />

      </Routes>
    </>
  )
}

export default Body;

  
