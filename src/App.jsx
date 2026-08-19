import Body from './Component/Body.jsx';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Body/>
    </CartProvider>
  )
}

export default App

  
