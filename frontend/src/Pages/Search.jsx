
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Products from "../Component/Products.jsx";
import MainLayout from "../Layout/MainLayout.jsx";
import { useProducts } from "../context/ProductContext.jsx";

function Search() {
  const [searchParams] = useSearchParams();
   const query = searchParams.get("query") || ""; const searchText = query.toLowerCase().trim(); const { products, loading } = useProducts(); 

   const filteredProducts = products.filter((product) =>
     product.CardTitle?.toLowerCase().includes(searchText) ||
    product.ItemContent?.toLowerCase().includes(searchText) ||
     product.Category?.toLowerCase().includes(searchText) );

  return (
    <MainLayout>
      <div className="container mt-4">

        {/* Search Heading */}
         {searchText && ( <h3 className="mb-4"> Search Results for: "{query}" </h3> )}

        {/* Loading */}
        {loading ? (
          <h4 className="text-center mt-4">
            Loading Products...
          </h4>
        ) : filteredProducts.length > 0 ? (

          <Products products={filteredProducts} />

        ) : (

          <div className="text-center mt-5"> 
          <h4 className="text-danger">
             404 - No Product Found 
           </h4> 
             <p className="text-secondary">
               Try searching with another product name or category.
              </p>
          </div>

        )}

      </div>
    </MainLayout>
  );
}

export default Search;
