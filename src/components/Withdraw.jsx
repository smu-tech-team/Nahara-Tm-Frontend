import React, { useState } from "react";
import Modal from "./Modal";

const WithdrawEarnings = ({ balance, onClose }) => {
  const [amount, setAmount] = useState("");
  const [fullBalance, setFullBalance] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = fullBalance ? balance : parseFloat(amount);
    if (!withdrawAmount || withdrawAmount > balance) {
      alert("Invalid amount. Please check your balance.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    try {
      setLoading(true); // Show loading state
      const response = await fetch("https://nahara-production.up.railway.app/api/earnings/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token here
        },
        body: JSON.stringify({ amount: withdrawAmount }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Withdrawal failed");

      alert("Withdrawal successful!");
      onClose(); // Close the modal on success
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Withdraw Earnings">
      <div className="space-y-4">
        {/* Current Balance */}
        <div className="flex items-center justify-between text-lg">
          <span className="text-gray-700 dark:text-gray-300">Available Balance:</span>
          <span className="font-bold text-green-600 dark:text-green-400">${balance.toFixed(2)}</span>
        </div>

        {/* Amount Input */}
        <div>
          <input
            type="number"
            className="w-full p-3 border rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Enter amount"
            value={fullBalance ? balance : amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={fullBalance}
          />
        </div>

        {/* Full Balance Checkbox */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-800"
            checked={fullBalance}
            onChange={() => setFullBalance(!fullBalance)}
          />
          <span className="text-gray-800 dark:text-gray-300">Withdraw Full Balance</span>
        </label>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Withdrawal"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawEarnings;
