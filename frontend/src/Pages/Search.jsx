
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Products from "../Component/Products.jsx";
import MainLayout from "../Layout/MainLayout.jsx";

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const searchText = query.toLowerCase().trim();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Products fetch failed");
        }

        const data = await response.json();

        setAllProducts(data);
      } catch (error) {
        console.error("Search Products Error:", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter((product) =>
    product.CardTitle?.toLowerCase().includes(searchText) ||
    product.ItemContent?.toLowerCase().includes(searchText) ||
    product.Category?.toLowerCase().includes(searchText)
  );

  return (
    <MainLayout>
      <div className="container mt-4">

        {/* Loading */}
        {loading ? (
          <h4 className="text-center mt-4">
            Loading Products...
          </h4>
        ) : filteredProducts.length > 0 ? (

          <Products products={filteredProducts} />

        ) : (

          <h4
            className="text-danger mt-4"
            style={{
              width: "2000px",
              height: "80px",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            404 No Product Found
          </h4>

        )}

      </div>
    </MainLayout>
  );
}

export default Search;
