import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const API_URL = "http://localhost:5000/api/cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);


  // Load Cart From Backend
  
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch(API_URL);
  if (!response.ok) {
          throw new Error("Cart load failed");
        }
    const data = await response.json();
        setCart(Array.isArray(data) ? data : []);
      }
       catch (error) {
    console.error("Cart load error:", error);
        setCart([]);
      }
    };
  loadCart();
  }, []);
  
  // Add To Cart
  
  const addToCart = async (product) => {
console.log("PRODUCT SENT:", product);

    try {
      const response = await fetch(API_URL, {
        method: "POST",headers: {
  "Content-Type": "application/json",
},  body: JSON.stringify(product),
      });

console.log("STATUS:", response.status);
const data = await response.json();
console.log("BACKEND RESPONSE:", data);
if (!response.ok) {
console.error("Backend error:", data.message);
  return;
      }

  setCart(Array.isArray(data) ? data : []);
    } 
    catch (error) {
  console.error("Add to cart error:", error);
    }
  };

  
// Increase Quantity
const increaseQuantity = async (productId, currentQuantity) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: currentQuantity + 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Increase quantity error:", data.message);
      return;
    }

    setCart(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Increase quantity error:", error);
  }
};


// Decrease Quantity
const decreaseQuantity = async (productId, currentQuantity) => {

  // Quantity 1 hai to usse neeche nahi jayegi
  if (currentQuantity <= 1) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: currentQuantity - 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Decrease quantity error:", data.message);
      return;
    }

    setCart(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Decrease quantity error:", error);
  }
};



  // Remove From Cart

  const removeFromCart = async (productId) => {
    console.log("REMOVE PRODUCT ID:", productId);

    try {
      const response = await fetch(
        `${API_URL}/${productId}`,
        { method: "DELETE",  }
      );
    const data = await response.json();
  console.log("REMOVE RESPONSE:", data);
if (!response.ok) {  console.error("Remove error:", data.message);
  return;
      }

      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };



  // Clear Cart


  const clearCart = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
      });

      const data = await response.json();

      console.log("CLEAR CART RESPONSE:", data);

      if (!response.ok) {
        console.error("Clear cart error:", data.message);
        return;
      }

      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };


  // Context

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}



// useCart Hook


export function useCart() {
  return useContext(CartContext);
}