import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);


// =====================================================
// API URL
// =====================================================

const API_URL = `${
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
}/api/cart`;


// =====================================================
// CART PROVIDER
// =====================================================

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ===================================================
  // GET AUTH TOKEN
  // ===================================================

  const getToken = useCallback(() => {

    return localStorage.getItem("shivram_token");

  }, []);


  // ===================================================
  // GET AUTH HEADERS
  // ===================================================

  const getHeaders = useCallback(() => {

    const token = getToken();

    return {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };

  }, [getToken]);


  // ===================================================
  // HANDLE API RESPONSE
  // ===================================================

  const handleResponse = useCallback(
    async (response) => {

      let data = null;

      try {

        data = await response.json();

      } catch {

        data = null;

      }


      if (!response.ok) {

        throw new Error(
          data?.message ||
            "Something went wrong. Please try again."
        );

      }

      return data;

    },
    []
  );


  // ===================================================
  // LOAD CART
  // ===================================================

  const loadCart = useCallback(
    async () => {

      const token = getToken();


      // -----------------------------------------------
      // USER NOT LOGGED IN
      // -----------------------------------------------

      if (!token) {

        setCart([]);

        setError("");

        return [];

      }


      setLoading(true);

      setError("");


      try {

        const response = await fetch(
          API_URL,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );


        const data =
          await handleResponse(response);


        const updatedCart =
          Array.isArray(data)
            ? data
            : [];


        setCart(updatedCart);


        return updatedCart;

      } catch (err) {

        console.error(
          "Cart load error:",
          err
        );


        setCart([]);

        setError(err.message);


        return [];

      } finally {

        setLoading(false);

      }

    },
    [
      getToken,
      getHeaders,
      handleResponse,
    ]
  );


  // ===================================================
  // LOAD CART WHEN APP STARTS
  // ===================================================

  useEffect(() => {

    loadCart();

  }, [loadCart]);


  // ===================================================
  // LOGIN / LOGOUT EVENT
  // ===================================================

  useEffect(() => {

    const handleAuthChange = () => {

      loadCart();

    };


    window.addEventListener(
      "auth-change",
      handleAuthChange
    );


    return () => {

      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );

    };

  }, [loadCart]);


  // ===================================================
  // TOTAL CART QUANTITY
  // ===================================================

  const totalCartQuantity = useMemo(() => {

    return cart.reduce(
      (total, item) => {

        return (
          total +
          Number(item.quantity || 0)
        );

      },
      0
    );

  }, [cart]);



// ===================================================
// TOTAL CART PRICE
// ===================================================

const totalCartPrice = useMemo(() => {

  return cart.reduce(
    (total, item) => {

      const price =
        Number(item.Price || 0);

      const discount =
        Number(item.Discount || 0);

      const quantity =
        Number(item.quantity || 0);


      // Discounted price
      const finalPrice =
        price - (price * discount) / 100;


      return (
        total +
        finalPrice * quantity
      );

    },
    0
  );

}, [cart]);



  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = useCallback(
    async (product) => {

      const token = getToken();


      // -----------------------------------------------
      // LOGIN CHECK
      // -----------------------------------------------

      if (!token) {

        const message =
          "Please login to add products to cart.";


        setError(message);


        return {
          success: false,
          message,
        };

      }


      // -----------------------------------------------
      // PRODUCT VALIDATION
      // -----------------------------------------------

      if (
        !product ||
        product.productId === undefined ||
        product.productId === null
      ) {

        const message =
          "Invalid product.";


        setError(message);


        return {
          success: false,
          message,
        };

      }


      setLoading(true);

      setError("");


      try {

        const response = await fetch(
          API_URL,
          {
            method: "POST",

            headers: getHeaders(),

            body: JSON.stringify(product),
          }
        );


        const data =
          await handleResponse(response);


        const updatedCart =
          Array.isArray(data)
            ? data
            : [];


        setCart(updatedCart);


        return {

          success: true,

          message:
            "Product added to cart.",

          cart: updatedCart,

        };

      } catch (err) {

        console.error(
          "Add to cart error:",
          err
        );


        setError(err.message);


        return {

          success: false,

          message: err.message,

        };

      } finally {

        setLoading(false);

      }

    },
    [
      getToken,
      getHeaders,
      handleResponse,
    ]
  );


  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  const updateQuantity = useCallback(
    async (productId, quantity) => {

      const token = getToken();


      // -----------------------------------------------
      // LOGIN CHECK
      // -----------------------------------------------

      if (!token) {

        const message =
          "Please login first.";


        setError(message);


        return {

          success: false,

          message,

        };

      }


      // -----------------------------------------------
      // PRODUCT VALIDATION
      // -----------------------------------------------

      if (
        productId === undefined ||
        productId === null
      ) {

        const message =
          "Invalid product.";


        setError(message);


        return {

          success: false,

          message,

        };

      }


      // -----------------------------------------------
      // QUANTITY
      // -----------------------------------------------

      const newQuantity =
        Math.max(
          1,
          Number(quantity) || 1
        );


      setLoading(true);

      setError("");


      try {

        const response = await fetch(
          `${API_URL}/${productId}`,
          {
            method: "PUT",

            headers: getHeaders(),

            body: JSON.stringify({
              quantity: newQuantity,
            }),
          }
        );


        const data =
          await handleResponse(response);


        const updatedCart =
          Array.isArray(data)
            ? data
            : [];


        setCart(updatedCart);


        return {

          success: true,

          cart: updatedCart,

        };

      } catch (err) {

        console.error(
          "Update quantity error:",
          err
        );


        setError(err.message);


        return {

          success: false,

          message: err.message,

        };

      } finally {

        setLoading(false);

      }

    },
    [
      getToken,
      getHeaders,
      handleResponse,
    ]
  );


  // ===================================================
  // INCREASE QUANTITY
  // ===================================================

  const increaseQuantity = useCallback(
    async (
      productId,
      currentQuantity
    ) => {

      return updateQuantity(
        productId,
        Number(currentQuantity) + 1
      );

    },
    [updateQuantity]
  );


  // ===================================================
  // DECREASE QUANTITY
  // ===================================================

  const decreaseQuantity = useCallback(
    async (
      productId,
      currentQuantity
    ) => {

      const quantity =
        Number(currentQuantity);


      if (quantity <= 1) {

        return {

          success: false,

          message:
            "Minimum quantity is 1.",

        };

      }


      return updateQuantity(
        productId,
        quantity - 1
      );

    },
    [updateQuantity]
  );


  // ===================================================
  // REMOVE FROM CART
  // ===================================================

  const removeFromCart = useCallback(
    async (productId) => {

      const token = getToken();


      // -----------------------------------------------
      // LOGIN CHECK
      // -----------------------------------------------

      if (!token) {

        const message =
          "Please login first.";


        setError(message);


        return {

          success: false,

          message,

        };

      }


      // -----------------------------------------------
      // PRODUCT VALIDATION
      // -----------------------------------------------

      if (
        productId === undefined ||
        productId === null
      ) {

        const message =
          "Invalid product.";


        setError(message);


        return {

          success: false,

          message,

        };

      }


      setLoading(true);

      setError("");


      try {

        const response = await fetch(
          `${API_URL}/${productId}`,
          {
            method: "DELETE",

            headers: getHeaders(),
          }
        );


        const data =
          await handleResponse(response);


        const updatedCart =
          Array.isArray(data)
            ? data
            : [];


        setCart(updatedCart);


        return {

          success: true,

          message:
            "Product removed from cart.",

          cart: updatedCart,

        };

      } catch (err) {

        console.error(
          "Remove from cart error:",
          err
        );


        setError(err.message);


        return {

          success: false,

          message: err.message,

        };

      } finally {

        setLoading(false);

      }

    },
    [
      getToken,
      getHeaders,
      handleResponse,
    ]
  );


  // ===================================================
  // CLEAR CART
  // ===================================================

  const clearCart = useCallback(
    async () => {

      const token = getToken();


      // -----------------------------------------------
      // USER NOT LOGGED IN
      // -----------------------------------------------

      if (!token) {

        setCart([]);

        setError("");


        return {

          success: true,

          message:
            "Cart cleared.",

        };

      }


      setLoading(true);

      setError("");


      try {

        const response = await fetch(
          API_URL,
          {
            method: "DELETE",

            headers: getHeaders(),
          }
        );


        await handleResponse(response);


        setCart([]);


        return {

          success: true,

          message:
            "Cart cleared successfully.",

        };

      } catch (err) {

        console.error(
          "Clear cart error:",
          err
        );


        setError(err.message);


        return {

          success: false,

          message: err.message,

        };

      } finally {

        setLoading(false);

      }

    },
    [
      getToken,
      getHeaders,
      handleResponse,
    ]
  );


  // ===================================================
  // CHECK PRODUCT IN CART
  // ===================================================

  const isInCart = useCallback(
    (productId) => {

      return cart.some(
        (item) =>
          String(item.productId) ===
          String(productId)
      );

    },
    [cart]
  );


  // ===================================================
  // GET PRODUCT QUANTITY
  // ===================================================

  const getProductQuantity =
    useCallback(
      (productId) => {

        const item =
          cart.find(
            (item) =>
              String(item.productId) ===
              String(productId)
          );


        return item
          ? Number(item.quantity || 0)
          : 0;

      },
      [cart]
    );


  // ===================================================
  // CLEAR ERROR
  // ===================================================

  const clearError = useCallback(() => {

    setError("");

  }, []);


  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const contextValue = useMemo(
    () => ({

      // Cart
      cart,

      // Loading / Error
      loading,
      error,

      // Calculations
      totalCartQuantity,
      totalCartPrice,

      // Cart Operations
      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,

      // Helpers
      isInCart,
      getProductQuantity,

      // Reload
      loadCart,

      // Error
      clearError,

    }),

    [
      cart,
      loading,
      error,

      totalCartQuantity,
      totalCartPrice,

      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,

      isInCart,
      getProductQuantity,

      loadCart,
      clearError,
    ]
  );


  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <CartContext.Provider
      value={contextValue}
    >
      {children}
    </CartContext.Provider>
  );

}


// =====================================================
// useCart HOOK
// =====================================================

export function useCart() {

  const context =
    useContext(CartContext);


  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }


  return context;

}