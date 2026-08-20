
import React from "react";
import "../Style/Card.css";

function HomeStore() {

const products = [
    {
      id:1,
      image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQMU4JRmo_pkXblcOGC2Vb3sr7lgkHpRm8Tpnq17ciDZbGAqqlvCcRXYnjWEeyqomvrFy7FlKpP05qOrHz63NYPWTkyYkNlAa9Xh4MkuEoiKWclrKweK0gPTQ"  ,
    
      Rating:4.4,
      Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Man's  casual trouser",
    },
  
    {
      id:2,
      image:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTkbgr8EI4nLMGfmYB0RZfY5yv9rnYNfaGLuq9M-zYIZFKw-fFkmhBkqfHDf2BAwF6oMbWvPAlTkOZ0XEmIBag08p-h0SP5-Id0VoUT7qCJ" ,
      Rating:4.4,
      Reviews:125,
      Price: 3000,
      Discount: 40,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:3,
      image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS_IsYB3UIraepj7HQ1sTeQLCsnDH78rDLwgh9-nwbPCATn_JGAQxom5ZSvB8b0CrSrWlRZMkNfA-TrmRovDLXoy8esIBlCF_zLfBZ_h9o" ,
      Rating:4.4,
      Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Bumchums",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:4,
      image:
        "https://images.meesho.com/images/products/17778570/kaobe_1200.jpg" ,
      Rating:4.4,
        Reviews:125,
      Price: 2500,
      Discount: 38,
      CardTitle: "Bumchums",
      ItemContent: "Man's  black  casual trouser",
    },

    {
      id:5,
      image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTCOGjSytrDwLUwRi1Y98p-thSUJ3_RZ-T2suFVKXYWGabHkWQb8xw-wsdxkkyLz4-m_wljC_GmmFobHvbFq7pOzWUws8fu9WGaQVofTgJlQBYYnWnD2_0H1w",
      Rating:4.4,
        Reviews:125,
      Price: 2300,
      Discount: 30,
      CardTitle: "OPLOT",
      ItemContent: "Men's  blue casual trouser",
    },

    {
      id:6,
      image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQKF26EZdaCa-p6tgjWhnMawRQhyw5WEuwkmuJXvhOhOJZUtJzydaJyKteP5mavMeB5BfQd1q0Bj07AvStKEcAAsfkRiAzW2INs7OFZoyMi" ,
      Rating:4.4,
        Reviews:125,
      Price: 2700,
      Discount: 50,
      CardTitle: "Spykar",
      ItemContent: "Men's grey slim casual trouser",
    },

    {
      id:7,
      image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRjviXt7HRMesrloIClehkrA8QbB7hF5C0bFonlxDPnzoLoyEXsH9MdtF9Ga7DsUi2eCoAHHMap9Q0xY5ZfEQLd3ByDizAPBJG7qmxQUSp6" ,
      Rating:4.4,
        Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    
    {
      id:8,
      image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ_xeKkYRNmEF__GcuYp1dCXg0iE6UKZ650YEWGn-aTY5Vnf6rg1CUU4Uwew2euampla0_fotsxRtCIednNqlDj9uUzAxtk1ZdU6PP-BwdE7O2C9HZkgxVk" ,
      Rating:4.4,
        Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:9,
      image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSfEYj2I8idyWHpQf8YUUtYsyj6RCG_gt5Sya1ZjBzErXo66xK3ICDtQXDoMmvS2fYzim3rpby3WO_LeCOM8vWkLHUJ7SHa6xPcvsLB9y-p",
      Rating:4.4,
        Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:10,
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSM38g_blGKyO8X6YY25m4hZVS8zQV30xLxVzCOCLcSBCLH2XBlPyKGRxptLzEeDa-NBBjG0mt3RaCe_ejoAAuw9ZbIaDeFSecUAxDyfOpa"  ,
  
  Rating:4.4,
    Reviews:125,    
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:11,
      image:
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQDgDU6yx23skpj75LCVqFIpdwjVxB2M-gYXa5VucETej3gos4sfL5446tuAGJE_Vo7PePvIpDptI0_e4pNit5R0w2cUSYFE0q80YEeVdbwaw_8NnN2Ekgh",
      Rating:4.4,
      Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    {
      id:12,
      image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSZQZwPdnSe2uXH9L8XpeuhR76AeTfaUJnYP1IBOfVU8AXIQ-j2WkWxvSH9h0a70G6UbcEBkM2qUkKLUk4blY2pyFa891BDKFY8ZBCGFrg",
      Rating:4.4,
        Reviews:125,
      Price: 3000,
      Discount: 50,
      CardTitle: "Shri Ram",
      ItemContent: "Men's  Formal Trousers",
    },

    
    
  ];

return(
  <>
  </>
);
}

export default HomeStore;