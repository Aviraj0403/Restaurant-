import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { deliveryFee } from "../Cart/Cart";
import axios from "axios";

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, food_list, token, URL, userId } = useContext(StoreContext);
  const [discount, setDiscount] = useState(0);
  const [data, setData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    numberOfPersons: "",
    tableNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const deliveryFeeApplied = subtotal === 0 ? 0 : deliveryFee;
  const totalAmount = subtotal + deliveryFeeApplied - discount;

  const onChangeHandlers = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!data.name || !data.mobileNumber || !data.email || !data.numberOfPersons || !data.tableNumber) {
      setError("Please fill in all fields.");
      return;
    }

    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      userId,
      bookTableInfo: data,
      items: orderItems,
      amount: totalAmount , // fetch real amount
    };

    try {
      const response = await axios.post(`${URL}/api/order/place`, orderData, {
        headers: { token },
      });

      const { orderId, amount, currency } = response.data;

      const options = {
        key: "rzp_test_oSItdzvqy6kWyb", 
        amount: amount,
        currency: currency,
        name: "BrTech",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response) => {
          const paymentData = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          try {
            const captureResponse = await axios.post(`${URL}/api/order/capture`, paymentData, {
              headers: { token },
            });

            if (captureResponse.data.success) {
              alert("Payment Successful! Your order has been placed.");
              navigate("/thank-you");
            } else {
              alert("Payment failed. Please try again.");
            }
          } catch (error) {
            setError("An error occurred while capturing the payment. Please try again.");
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.mobileNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(`An error occurred while placing the order: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}

      <button className="GoBack w-56" onClick={() => navigate("/cart")}>
        ⬅️ Go Back to Cart Page
      </button>

      <form onSubmit={placeOrder} className="place-order">
        {/* Form Fields */}
        <div className="place-order-left">
          <h2 className="title">Book Table</h2>
          <div className="multi-fields">
            <div className="w-full">
              <input
                type="text"
                onChange={onChangeHandlers}
                value={data.name}
                name="name"
                placeholder="Name"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                name="mobileNumber"
                onChange={onChangeHandlers}
                value={data.mobileNumber}
                placeholder="Mobile Number"
              />
            </div>
          </div>
          <div className="w-full">
            <input
              type="email"
              name="email"
              onChange={onChangeHandlers}
              value={data.email}
              placeholder="Email Id"
            />
          </div>
          <div className="w-full">
            <input
              type="number"
              name="numberOfPersons"
              onChange={onChangeHandlers}
              value={data.numberOfPersons}
              placeholder="Number of Persons"
            />
          </div>
          <div className="w-full">
            <select
              name="tableNumber"
              onChange={onChangeHandlers}
              value={data.tableNumber}
              className="border border-2 p-2 w-full mb-3"
            >
              <option value="">Select Table Number</option>
              <option value="1">Table 1</option>
              <option value="2">Table 2</option>
              <option value="3">Table 3</option>
            </select>
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2 className="title">Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>&#x20b9;{subtotal}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>&#x20b9;{deliveryFeeApplied}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>5% Discount</p>
                <p>&#x20b9;{discount}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>&#x20b9;{totalAmount}</b>
              </div>
            </div>

            <button type="submit" disabled={subtotal === 0}>
              PROCEED TO Payment
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
