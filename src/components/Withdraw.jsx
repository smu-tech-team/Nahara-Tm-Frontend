import React, { useState } from "react";
import Modal from "./Modal";

const WithdrawEarnings = ({ balance, onClose }) => {
  const [amount, setAmount] = useState("");
  const [fullBalance, setFullBalance] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = fullBalance ? balance : parseFloat(amount);
    if (!withdrawAmount || withdrawAmount > balance) return alert("Invalid amount");
  
    const token = localStorage.getItem("token"); // Ensure token is available
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8087/api/earnings/withdraw", {
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
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Withdraw Earnings">
      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Enter amount"
        value={fullBalance ? balance : amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={fullBalance}
      />
      <label className="flex items-center mt-2">
        <input type="checkbox" checked={fullBalance} onChange={() => setFullBalance(!fullBalance)} />
        <span className="ml-2 text-gray-800 dark:text-white">Withdraw Full Balance</span>
      </label>
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded" onClick={handleWithdraw}>
        Confirm Withdrawal
      </button>
    </Modal>
  );
};

export default WithdrawEarnings;
