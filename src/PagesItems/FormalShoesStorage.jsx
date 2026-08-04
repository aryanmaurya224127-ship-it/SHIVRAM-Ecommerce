
import React from "react";
import "../Style/Card.css";
import { NavLink } from "react-router-dom";

function FormalShoesStore() {

const products = [
    {
      id:1,
      image:
      "https://images.meesho.com/images/products/490670815/ltrxo_400.webp" ,
    Rating:4.4,
      Reviews:125,
      Price: 2649,
      Discount: 60,
      CardTitle: "Campus",
      ItemContent: "Man's  Black casual Shoes",
    },
  
    {
      id:2,
      image:
          "https://teakwoodleathers.com/cdn/shop/files/T_SH_ST_LU302_BR.jpg?v=1715677406"  ,
    Rating:4.4,
      Reviews:125,
      Price: 2099,
      Discount: 70,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:3,
      image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJO0HPSG8FFEPjGLgFdHewZnTOc5prZI01RQ&s" ,
    Rating:4.4,
      Reviews:125,
      Price: 2539,
      Discount: 55,
      CardTitle: "Bumchums",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:4,
      image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLsndfwbvv0KL15d1xNRVWM7Y04nMIUKW_6FMEIskzBT0_fsSeGtI_5hY&s"  ,
    Rating:4.4,
      Reviews:125,
      Price: 2569,
      Discount: 48,
      CardTitle: "Bumchums",
      ItemContent: "Man's  black  casual trouser",
    },

    {
      id:5,
      image:
        "https://redtape.com/cdn/shop/files/RTE5631B_1_jpg.jpg?v=1741350251"  ,
       Rating:4.4,
      Reviews:125,
      Price: 2399,
      Discount: 50,
      CardTitle: "OPLOT",
      ItemContent: "Men's  blue casual trouser",
    },

    {
      id:6,
      image:
      "https://redtape.com/cdn/shop/files/RTE5633B_1_jpg.jpg?v=1741350248"  ,
      Rating:4.4,
      Reviews:125,
      Price: 2789,
      Discount: 50,
      CardTitle: "Spykar",
      ItemContent: "Men's grey slim casual trouser",
    },

    {
      id:7,
      image:
        "https://redtape.com/cdn/shop/files/RTE5781_1_9a538f3f-ac1c-4e73-bfc4-2091c8925987.jpg?v=1741350333" ,
       Rating:4.4,
      Reviews:125,
      Price: 2829,
      Discount: 70,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    
    {
      id:8,
      image:
      "https://imagescdn.louisphilippe.com/img/app/product/3/39620728-12688977.jpg?auto=format&w=390" ,
      Rating:4.4,
      Reviews:125,
      Price: 3099,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:9,
      image:
      "https://www.pierrecardinindia.com/wp-content/uploads/2024/08/PC-9074-BLACK-WEB-1.jpg" ,
    Rating:4.4,
      Reviews:125,
      Price: 3299,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:10,
      image:
        "https://www.shutterstock.com/image-photo/leather-laceup-shoes-minimalistic-creative-260nw-2471756315.jpg"  ,
      Rating:4.4,
      Reviews:125,
    
      Price: 3659,
      Discount: 55,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:11,
      image:
        "https://media.istockphoto.com/id/148219720/photo/expensive-man-shoes-wedding-details.jpg?s=612x612&w=0&k=20&c=KeH-xsQ7igdl25-aQZjNBvgjH2Uencabqjqe6tyga0c=" ,
      Rating:4.4,
      Reviews:125,
      Price: 3889,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:12,
      image:
      "https://alonzoshoes.in/cdn/shop/files/DSC_0712-PhotoRoom_1.jpg?v=1703764708" ,
    Rating:4.4,
      Reviews:125,
      Price: 4099,
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

export default FormalShoesStore;