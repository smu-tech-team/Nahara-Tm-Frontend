import React, { useState, useEffect } from "react";
import axios from "axios";

const FloatingCart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`/api/cart?userId=${userId}`);
        setCartItems(res.data.items);
        setSubtotal(res.data.subtotal);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [userId]);

  const handleToggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRemoveFromCart = async (bookId) => {
    try {
      await axios.delete(`/api/cart/remove?userId=${userId}&bookId=${bookId}`);
      const res = await axios.get(`/api/cart?userId=${userId}`);
      setCartItems(res.data.items);
      setSubtotal(res.data.subtotal);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleIncreaseQuantity = async (bookId) => {
    try {
      await axios.post(`/api/cart/increase?userId=${userId}&bookId=${bookId}`);
      const res = await axios.get(`/api/cart?userId=${userId}`);
      setCartItems(res.data.items);
      setSubtotal(res.data.subtotal);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  const handleDecreaseQuantity = async (bookId) => {
    try {
      await axios.post(`/api/cart/decrease?userId=${userId}&bookId=${bookId}`);
      const res = await axios.get(`/api/cart?userId=${userId}`);
      setCartItems(res.data.items);
      setSubtotal(res.data.subtotal);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      const order = await axios.post(`/api/payment/checkout?userId=${userId}`, { totalAmount: total });
      const paystack = window.PaystackPop;
      paystack.newTransaction({
        key: "your_paystack_public_key",
        email: "user@example.com",
        amount: total * 100,
        currency: "NGN",
        reference: order.data.reference,
        onSuccess: () => alert("Payment Successful!"),
        onCancel: () => alert("Payment was cancelled."),
      });
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div>
      <div
        onClick={handleToggleCart}
        className="fixed top-1/2 right-10 transform -translate-y-1/2 bg-blue-800 text-white p-4 rounded-full shadow-lg cursor-pointer hover:scale-105 transition"
      >
        🛒 
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center left-5 items-center bg-black bg-opacity-50 backdrop-blur-lg">
          <div className="bg-gray-800 dark:bg-gray-300 p-6 w-96 shadow-xl rounded-lg transition-opacity duration-300">
            <h3 className="font-semibold text-xl">Your Cart</h3>

            <div className="mt-4">
              {cartItems.map((item) => (
                <div key={item.bookId} className="flex justify-between items-center py-2 border-b">
                  <span>{item.title}</span>
                  <div className="flex items-center">
                    <button onClick={() => handleDecreaseQuantity(item.bookId)} className="px-2 py-1 bg-gray-300 rounded-full">-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(item.bookId)} className="px-2 py-1 bg-gray-300 rounded-full">+</button>
                  </div>
                  <span>${item.price * item.quantity}</span>
                  <button onClick={() => handleRemoveFromCart(item.bookId)} className="px-2 text-red-500 font-bold">✖</button>
                </div>
              ))}
            </div>

            {/* Subtotal & Total */}
            <div className="mt-4 ">
              <div className="flex justify-between ">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between text-white dark:text-gray-800">
              <button onClick={handleToggleCart} className="bg-gray-500 dark:bg-gray-500  py-2 px-4 rounded-full hover:bg-gray-500 transition">
                Continue Shopping
              </button>
              <button onClick={handleCheckout} className="bg-blue-800 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingCart;
