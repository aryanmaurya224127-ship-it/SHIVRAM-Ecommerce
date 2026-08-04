import { NavLink } from "react-router-dom";
import React from "react";
import "../Style/Card.css";

function CasualShoesStore() {

const products = [
    {
      id:1,
      image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNmKQhfWZSIdIZGBE_GMyzla2pmTuXuV6Y8w&s" ,
    Rating:4.4,
      Reviews:125,
      Price: 3049,
      Discount: 50,
      CardTitle: "Campus",
      ItemContent: "Man's Black casual Shoes",
    },
  
    {
      id:2,
      image:
            "https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/23120120/2023/7/18/f4cb0edf-38fa-452a-bb32-d049099b34ae1689679241939-BERSACHE-Men-Non-Marking-Running-Shoes-8891689679241542-1.jpg" ,
      Rating:4.4,
      Reviews:125,
      Price: 2739,
      Discount: 60,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:3,
      image:
      "https://assets.ajio.com/medias/sys_master/root/20231025/f2Xa/6538463cafa4cf41f55c4cf9/-1117Wx1400H-466742972-grey-MODEL.jpg",
      Rating:4.4,
      Reviews:125,
      Price: 3369,
      Discount: 50,
      CardTitle: "Bumchums",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:4,
      image:
        "https://assets.ajio.com/medias/sys_master/root/20231130/CAFK/6568b7a1ddf7791519a86ec3/-473Wx593H-466839233-blue-MODEL2.jpg",
       Rating:4.4,
      Reviews:125,
      Price: 2549,
      Discount: 38,
      CardTitle: "Bumchums",
      ItemContent: "Man's  black  casual trouser",
    },

    {
      id:5,
      image:
        "https://rukminim2.flixcart.com/image/300/300/xif0q/shoe/c/u/7/-original-imahfueasggzagyh.jpeg" ,
      Rating:4.4,
      Reviews:125,Rating:4.4,
      Reviews:125,
      Price: 2399,
      Discount: 50,
      CardTitle: "OPLOT",
      ItemContent: "Men's  blue casual trouser",
    },

    {
      id:6,
      image:
        "https://assets.ajio.com/medias/sys_master/root/20240308/IQ6k/65ea510a16fd2c6e6a4557d1/-1117Wx1400H-467142978-grey-MODEL4.jpg",
       Rating:4.4,
      Reviews:125,
      Price: 2789,
      Discount: 40,
      CardTitle: "Spykar",
      ItemContent: "Men's grey slim casual trouser",
    },

    {
      id:7,
      image:
      "https://assets.ajio.com/medias/sys_master/root/20211012/xjuG/616518b8f997dd3ed469a742/-473Wx593H-463115384-grey-MODEL2.jpg" ,
    Rating:4.4,
      Reviews:125,
      Price: 3049,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    
    {
      id:8,
      image:
        "https://abrosshoes.com/cdn/shop/files/000A2849.jpg?v=1737962029&width=1500" ,
    Rating:4.4,
      Reviews:125,
      Price: 3679,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:9,
      image:
      "https://abrosshoes.com/cdn/shop/files/AI2NKIDS_0000_000A2949.jpg?v=1737962496&width=1600" ,
    Rating:4.4,
      Reviews:125,
      Price: 2629,
      Discount: 55,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:10,
      image:
        "https://abrosshoes.com/cdn/shop/files/Tango_0001_000A6132.jpg?v=1737962491&width=300" ,

    Rating:4.4,
      Reviews:125,
      Price: 3399,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:11,
      image:
        "https://abrosshoes.com/cdn/shop/products/000A7907_290e1c1c-2e63-4928-95f8-da5e46d276f0.jpg?v=1737964381&width=1000" ,
    Rating:4.4,
      Reviews:125,
      Price: 4099,
      Discount: 60,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:12,
      image:
      "https://m.media-amazon.com/images/I/61lfyJ3q2UL._UY1000_.jpg" ,
    Rating:4.4,
      Reviews:125,
      Price: 3089,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

  

    
  ];

  return (
    
    <div className="products-container">
      {products.map((product, index) => {
        const finalPrice =
          product.Price - (product.Price * product.Discount) / 100;

        return (

          <div className="product-card" key={product.id}>
  <div className="image-box">
    <img
      src={product.image}
      alt={product.CardTitle}
      className="product-image"
    />

    <span className="offer-badge">
      {product.Discount}% OFF
    </span>
  </div>

  <h3>{product.CardTitle}</h3>
  <p>{product.ItemContent}</p>

  <p className="old-price">₹{product.Price}</p>
  <h3 className="new-price">
    ₹{finalPrice}
  </h3>
  <p className="rating">
    ⭐ {product.Rating} | ({product.Reviews} Reviews )
</p> 
<p className="delivery">
    🚚 Free Delivery
</p>
  <button className="buy-btn">Buy Now</button>
</div>
        );
      })}
    </div>
  );
}

export default CasualShoesStore;