
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home.jsx";
import Shirt from "../Pages/Shirt.jsx";
import TShirt from "../Pages/TShirt.jsx";
import Trouser from "../Pages/Trouser.jsx";
import Watch from "../Pages/Watch.jsx";
import CasualShoes from "../Pages/CasualShoes.jsx";
import FormalShoes from "../Pages/FormalShoes.jsx";
import BuyButton from "../Pages/BuyButton.jsx";
import Login from '../Pages/Login.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import '../Style/App.css'


function Body() {
 

  return (
    <>
      <Routes ClassName="container">
        <Route path="/" element={<Home />} />
        <Route path="/Shirt" element={<Shirt/>} />
        <Route path="/TShirt" element={<TShirt/>} />
        <Route path="/Trouser" element={<Trouser />} />
        <Route path="/Watch" element={<Watch/>} /> 
        <Route path="/CasualShoes" element={<CasualShoes/>} />
        <Route path="FormalShoes" element={<FormalShoes />} />
        <Route path="BuyButton" element={<BuyButton/>} />
        <Route path="/Login" element={<Login/>} />
        
      </Routes>
    </>
  )
}

export default Body;

  
