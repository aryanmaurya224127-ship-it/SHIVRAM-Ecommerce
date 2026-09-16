import Body from "./Component/Body.jsx";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>

          <Body />

        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;