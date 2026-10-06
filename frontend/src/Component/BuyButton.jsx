import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuyButton = ({ product, quantity = 1 }) => {
  const navigate = useNavigate();

  const handleBuy = (e) => {
    e.stopPropagation();

    if (!product) {
      alert("Product details available nahi hain!");
      return;
    }

    // Date aur Time generate karein
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = currentDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Order detail page par saara data state ke through pass karein
    // BuyButton.jsx
navigate('/order', {
  state: {
    product: product,
    quantity: quantity || 1,
    orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    orderTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    totalAmount: (product.price || 0) * (quantity || 1),
  },
});
  };

  return (
    <button
      onClick={handleBuy}
      style={{
        backgroundColor: '#ff9f00',
        color: '#ffffff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      Buy Now
    </button>
  );
};

export default BuyButton;