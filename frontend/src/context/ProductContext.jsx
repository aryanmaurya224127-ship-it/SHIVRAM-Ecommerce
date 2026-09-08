import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

const API_URL = "http://localhost:5000/api/products";

export function ProductProvider({ children }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Products load failed");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error("Products load error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}