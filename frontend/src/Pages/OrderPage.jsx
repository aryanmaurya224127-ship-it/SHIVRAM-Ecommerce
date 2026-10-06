import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route state se order details receive karein
  const orderDetails = location.state;

  if (!orderDetails) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Koi Order Status Nahi Mila!</h2>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '10px 20px', marginTop: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const {
    orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`,
    orderDate,
    orderTime,
    product,
    quantity = 1,
    totalAmount,
    shippingDetails
  } = orderDetails;

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 1. SUCCESS BANNER (Amazon / Flipkart Style) */}
      <div style={{ backgroundColor: '#e6f4ea', border: '1px solid #a8dab5', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '25px' }}>
        <div style={{ fontSize: '40px', color: '#28a745' }}>✓</div>
        <h2 style={{ color: '#1e7e34', margin: '10px 0 5px 0' }}>Order Confirmed!</h2>
        <p style={{ margin: 0, color: '#555' }}>
          Thank you for your order. We have received your order and are processing it.
        </p>
        <p style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '15px' }}>
          Order ID: <span style={{ color: '#007bff' }}>#{orderId}</span>
        </p>
      </div>

      {/* 2. ORDER TRACKING STATUS BAR */}
      <div style={{ border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '25px', backgroundColor: '#fafafa' }}>
        <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Order Status</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          
          {/* Status Step 1 */}
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#28a745', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>✓</div>
            <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#28a745' }}>Order Placed</p>
            <p style={{ fontSize: '11px', color: '#777', margin: 0 }}>{orderDate} ({orderTime})</p>
          </div>

          {/* Line */}
          <div style={{ height: '3px', backgroundColor: '#e0e0e0', flex: 1, marginTop: '-15px' }}></div>

          {/* Status Step 2 */}
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ff9f00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>2</div>
            <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#ff9f00' }}>Processing</p>
            <p style={{ fontSize: '11px', color: '#777', margin: 0 }}>Packed Soon</p>
          </div>

          {/* Line */}
          <div style={{ height: '3px', backgroundColor: '#e0e0e0', flex: 1, marginTop: '-15px' }}></div>

          {/* Status Step 3 */}
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ccc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>3</div>
            <p style={{ fontSize: '13px', margin: '5px 0 0 0', color: '#777' }}>Shipped</p>
          </div>

          {/* Line */}
          <div style={{ height: '3px', backgroundColor: '#e0e0e0', flex: 1, marginTop: '-15px' }}></div>

          {/* Status Step 4 */}
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ccc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>4</div>
            <p style={{ fontSize: '13px', margin: '5px 0 0 0', color: '#777' }}>Delivered</p>
          </div>

        </div>
      </div>

      {/* 3. PRODUCT & DELIVERY DETAILS */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Left: Product Information */}
        <div style={{ flex: '1 1 350px', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Item Ordered</h4>
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            {product?.image && (
              <img 
                src={product.image} 
                alt={product.title || product.name} 
                style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} 
              />
            )}
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{product?.title || product?.name}</h4>
              <p style={{ margin: '3px 0', fontSize: '14px', color: '#555' }}>Quantity: <strong>{quantity}</strong></p>
              <p style={{ margin: '3px 0', fontSize: '14px', color: '#555' }}>Price: ₹{product?.price}</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                Total Paid (COD): ₹{totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Delivery Address & Payment Method */}
        <div style={{ flex: '1 1 300px', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
          <h4 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Delivery Address</h4>
          {shippingDetails ? (
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>{shippingDetails.fullName}</p>
              <p style={{ margin: '0' }}>{shippingDetails.address}</p>
              <p style={{ margin: '0' }}>{shippingDetails.city} - {shippingDetails.pincode}</p>
              <p style={{ margin: '5px 0 0 0' }}><strong>Phone:</strong> {shippingDetails.phone}</p>
              <p style={{ margin: '10px 0 0 0', padding: '6px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', fontSize: '13px', display: 'inline-block' }}>
                <strong>Payment Mode:</strong> {shippingDetails.paymentMethod || 'Cash on Delivery'}
              </p>
            </div>
          ) : (
            <p style={{ color: '#777', fontSize: '14px' }}>Cash on Delivery selected.</p>
          )}
        </div>

      </div>

      {/* 4. HOME BUTTON */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '12px 30px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>

    </div>
  );
};

export default OrderPage;