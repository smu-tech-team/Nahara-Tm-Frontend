import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import WithdrawEarnings from "../components/Withdraw";
import CheckEligibility from "../components/CheckEligibility";
import LockEarnings from "../components/LockEarning";

const EarningsDashboard = ({ totalEarnings }) => {
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [earnings, setEarnings] = useState(0); // Initialize state


  const openModal = (type) => {
    setActiveModal(type);
    setIsMainModalOpen(false); // Close the main modal when another one opens
  };

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please log in.");
      }
  
      const response = await fetch("https://nahara-production.up.railway.app/api/earnings/calculate", {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired token.");
      }
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch earnings");
      }
  
      setEarnings(data.totalEarnings);
    } catch (err) {
      console.error("Error fetching earnings:", err.message);
      alert(err.message);
    }
  };
  useEffect(() => {
    fetchEarnings();
  }, []); 
  

  return (
    <div className=" rounded-lg shadow-lg bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Click to manage</h1>

      {/* Earnings Box (Clickable) */}
      <div
        className="p-4 text-green-500 dark:bg-gray-800 rounded-lg text-center cursor-pointer hover:bg-green-100 dark:hover:bg-gray-700 transition"
        onClick={() => setIsMainModalOpen(true)}
      >
        <p className="text-lg font-semibold">${earnings}</p>
        </div>

      {/* Main Popup with Three Buttons */}
      <Modal isOpen={isMainModalOpen} onClose={() => setIsMainModalOpen(false)} title="Manage Earnings">
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-2" onClick={() => openModal("withdraw")}>
          Withdraw Earnings
        </button>
        <button className="w-full bg-yellow-500 text-white py-2 rounded mt-2" onClick={() => openModal("check")}>
          Check Eligibility
        </button>
        <button className="w-full bg-red-500 text-white py-2 rounded mt-2" onClick={() => openModal("lock")}>
          Lock Earnings
        </button>
      </Modal>

      {/* Individual Modals */}
      {activeModal === "withdraw" && <WithdrawEarnings balance={totalEarnings} onClose={() => setActiveModal(null)} />}
      {activeModal === "check" && <CheckEligibility onClose={() => setActiveModal(null)} />}
      {activeModal === "lock" && <LockEarnings onClose={() => setActiveModal(null)} />}
    </div>
  );
};

export default EarningsDashboard;
