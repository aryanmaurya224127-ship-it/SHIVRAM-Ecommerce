import Body from './Component/Body.jsx';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <CartProvider>
      <ProductProvider>
        <Body />
      </ProductProvider>
    </CartProvider>
  )
}

export default App;