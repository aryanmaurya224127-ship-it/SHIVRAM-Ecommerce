import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import MainLayout from "../Layout/MainLayout.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalCartQuantity,
    totalCartPrice,
    loading,
  } = useCart();

  return (
    <MainLayout>
      <div className="container py-4">

        {/* =====================================================
            PAGE TITLE
        ===================================================== */}

        <h2 className="mb-4">My Cart</h2>


        {/* =====================================================
            EMPTY CART
        ===================================================== */}

        {cart.length === 0 ? (
          <div className="text-center py-5">

            <h4>Your Cart is Empty 🛒</h4>

            <p className="text-secondary">
              Add some products to your cart.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>

          </div>
        ) : (

          <>
            {/* =================================================
                CART PRODUCTS
            ================================================= */}

            <div className="row g-4">

              {cart.map((item) => {

                const price =
                  Number(item.Price || 0);

                const discount =
                  Number(item.Discount || 0);

                const quantity =
                  Number(item.quantity || 1);

                const finalPrice =
                  price -
                  (price * discount) / 100;

                const totalPrice =
                  finalPrice * quantity;


                return (
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    key={item.productId}
                  >

                    <div className="card h-100 shadow-sm">


                      {/* =======================================
                          PRODUCT IMAGE
                      ======================================= */}

                      <div className="text-center p-3">

                        <div
                          style={{
                            width: "200px",
                            height: "200px",
                            margin: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >

                          <img
                            src={item.image}
                            alt={item.CardTitle}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                        </div>

                      </div>


                      {/* =======================================
                          PRODUCT DETAILS
                      ======================================= */}

                      <div className="card-body">

                        <h5 className="card-title">
                          {item.CardTitle}
                        </h5>


                        <p className="card-text text-secondary">
                          {item.ItemContent}
                        </p>


                        {/* Original Price */}

                        <p className="card-text mb-1">

                          Original Price:

                          <del className="ms-2">
                            ₹{price}
                          </del>

                        </p>


                        {/* Discount */}

                        <p className="card-text mb-1">

                          Discount:

                          <span className="text-danger ms-2">
                            {discount}% OFF
                          </span>

                        </p>


                        {/* Price of One Item */}

                        <p className="card-text">

                          Price of one item:

                          <strong className="text-success ms-2">
                            ₹{finalPrice.toFixed(2)}
                          </strong>

                        </p>


                        {/* =====================================
                            QUANTITY CONTROLS
                        ===================================== */}

                        <div className="d-flex align-items-center gap-2 mb-3">

                          <strong>
                            Quantity:
                          </strong>


                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() =>
                              decreaseQuantity(
                                item.productId,
                                quantity
                              )
                            }
                            disabled={
                              quantity <= 1 ||
                              loading
                            }
                          >
                            −
                          </button>


                          <span
                            className="fw-bold"
                            style={{
                              minWidth: "35px",
                              textAlign: "center",
                              fontSize: "18px",
                            }}
                          >
                            {quantity}
                          </span>


                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() =>
                              increaseQuantity(
                                item.productId,
                                quantity
                              )
                            }
                            disabled={loading}
                          >
                            +
                          </button>

                        </div>


                        {/* Total Price */}

                        <h6 className="fw-bold">
                          Total Price: ₹
                          {totalPrice.toFixed(2)}
                        </h6>

                      </div>


                      {/* =======================================
                          BUTTONS
                      ======================================= */}

                      <div className="card-footer bg-white border-0">


                        {/* Remove */}

                        <button
                          type="button"
                          className="btn btn-danger w-100 mb-2"
                          onClick={() =>
                            removeFromCart(
                              item.productId
                            )
                          }
                          disabled={loading}
                        >

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash-fill me-2"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 1a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                          </svg>

                          Remove from Cart

                        </button>


                        {/* Continue */}

                        <button
                          type="button"
                          className="btn btn-success w-100"
                          onClick={() =>
                            navigate(
                              `/ProductDetail/${item.productId}`,
                              {
                                state: {
                                  quantity,
                                },
                              }
                            )
                          }
                        >
                          Continue
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>


            {/* =================================================
                CART SUMMARY
            ================================================= */}

            <div className="row justify-content-end mt-4">

              <div className="col-12 col-md-5 col-lg-4">

                <div className="card shadow-sm">

                  <div className="card-body">

                    <h4 className="mb-3">
                      Cart Summary
                    </h4>


                    <div className="d-flex justify-content-between mb-2">

                      <span>
                        Total Items
                      </span>

                      <strong>
                        {totalCartQuantity}
                      </strong>

                    </div>


                    <hr />


                    <div className="d-flex justify-content-between">

                      <span>
                        Total Amount
                      </span>

                      <strong className="text-success">
                        ₹{Number(totalCartPrice).toFixed(2)}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </>
        )}

      </div>
    </MainLayout>
  );
}

export default Cart;
