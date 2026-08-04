
import React from "react";
import "../Style/Card.css";

function WatchStore() {

const products = [
    {
      id:1,
      image:
    "https://m.media-amazon.com/images/I/51iZiVjYqcL._AC_.jpg",
      Rating:4.4,
      Reviews:125,
      Price: 5999,
      Discount: 50,
      CardTitle: "OLEVS",
      ItemContent: "Man's  premium watches",
    },
  
    {
      id:2,
      image:
            "https://images-eu.ssl-images-amazon.com/images/I/61PKD67CWsL._AC_UL232_SR232,232_.jpg" ,
      Rating:4.4,
      Reviews:125,
      Price: 5599,
      Discount: 40,
      CardTitle: "OLEVS",
      ItemContent: "Man's  premium watches",
    },

    {
      id:3,
      image:
        "https://m.media-amazon.com/images/I/616jllf33ZL._UY1000_.jpg"  ,
      Rating:4.4,
      Reviews:125,
      Price: 4749,
      Discount: 50,
      CardTitle: "OLEVS",
      ItemContent: "Man's  premium watches",
    },

    {
      id:4,
      image:
        "https://s.alicdn.com/@sc04/kf/H0216d0e69da2496eb8486f288b8a44a80.jpg"  ,
      Rating:4.4,
      Reviews:125,
      Price: 7599,
    Discount: 38,
      CardTitle: "ERNIE KLEIN",
    ItemContent: "Man's  premium watches",
    },

    {
      id:5,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR0maBVrTOtk8DVW-_X9SQedm64GQmBkgwuuTV-AlE6A&s=10 ",
      Rating:4.4,
      Reviews:125,
      Price: 18389,
      Discount: 30,
      CardTitle: "REWARD VIP",
    ItemContent: "Man's  premium watches",
    },

    {
      id:6,
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ5QLdie3c5wcVsI8EtR2ExXij-h1v-zcesVsd03Vj2vBW9NXPhohy3Tw6i92C6w5DYMCy5dmpd-m9NB2k8kO0KQx4JPVFcXq3o6MOtRuqF1eyQ8zU-cdscHA"  ,
      Rating:4.4,
      Reviews:125,
      Price: 4899,
      Discount: 35,
      CardTitle: "KINTUED",
      ItemContent: "Man's  premium watches",
    },

    {
      id:7,
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS_tqnn8Q9EHVn-cT3NUkUq94xZrxbWowNMU24HXUpHjF5daaM0D8C9PQAl_TKVv11tqMPT_656kDIElVfxjlwQ_QHYP0ca89drM_pd0z8",
      Rating:4.4,
      Reviews:125,
      Price: 15499,
      Discount: 30,
      CardTitle: "TITAN",
      ItemContent: "Man's  premium watches",
    },

    
    {
      id:8,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTlOGdSDFJng5jnZqOoLoyGbUhtWRZE-70yEJvzzNup_ayhi0sFzKtMTDwMTjbio_FrQXfnO3C6w9xyRRM0dT_M7EAuS1bN2kKBU3_isDcC" ,
      Rating:4.4,
      Reviews:125,
      Price: 3759,
      Discount: 40,
      CardTitle: "FORSINING",
      ItemContent: "Man's  premium watches",
    },

    {
      id:9,
      image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTIfT4DW5OeT3MfwSya0NCvjPNqZPHZekvse5f7K2IEcmVqBPPG1U77boeBs6nOkqtZbpWFBsATqraAlXSkR1cHR3m4RoUaPLPvUPEPVjLW" ,
      Rating:4.4,
      Reviews:125,
      Price: 4399,
      Discount: 40,
      CardTitle: "KITCONE",
      ItemContent: "Man's  premium watches",
    },

    {
      id:10,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT4QAb4mYtKYNb7rVpaQgvQdryW42PIwK8T8yimQ2OzDWKEFofn-Nc5wdOfJeOM3HbkUk-pyoUffI-NXmdrxFvvQx0k3Z0b5xUaJW-H6sSHqwaGrzrKgziD" ,

      Rating:4.4,
      Reviews:125,
      Price: 3499,
      Discount: 30,
      CardTitle: "KITCONE",
      ItemContent: "Man's  premium watches",
    },

    {
      id:11,
      image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcThhBO4NCaWYZswntj951H9rCSBnH8ZxX8ZBspJbILd0IWRE2w_D8IZrIcmy_LI0D4-pwBRzqpfKq1MZGJtAoXrmAsAy4r9IrkExyR_eWPJ" ,
     Rating:4.4,
      Reviews:125,
      Price: 4249,
      Discount: 45,
      CardTitle: "FORSINING",
      ItemContent: "Man's  premium watches",
    },

    {
      id:12,
      image:
        "https://m.media-amazon.com/images/I/61D06JbkWIS.jpg" ,
      Rating:4.4,
      Reviews:125,
      Price: 3999,
      Discount: 40,
      CardTitle: "ALTURA",
      ItemContent: "Man's  premium watches",
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

export default WatchStore;