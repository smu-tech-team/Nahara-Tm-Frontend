import React, { useEffect, useState } from 'react';
import Modal from "./Modal";

const CheckEligibility = ({ onClose }) => {
  const [eligible, setEligible] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check eligibility logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 No token found in localStorage");
      setEligible(false);
      return;
    }

    setLoading(true);
    console.log("🔄 Sending request to check eligibility...");

    fetch("https://nahara-production.up.railway.app/api/earnings/check-eligibility", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("📥 Response received:", res);
        if (!res.ok) throw new Error("Failed to check eligibility");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Eligibility Data:", data);
        setEligible(data.eligible);
      })
      .catch((error) => {
        console.error("❌ Fetch error:", error);
        setEligible(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Modal isOpen={true} onClose={onClose} title="Eligibility Check">
      <div className="space-y-6 text-center">
        {loading ? (
          <p className="text-gray-500 animate-pulse">🔍 Checking your eligibility...</p>
        ) : eligible ? (
          <div className="flex flex-col items-center text-green-600">
            <span className="text-5xl">🎉</span>
            <p className="text-2xl font-bold">You are eligible!</p>
            <p className="text-sm text-gray-500 mt-1">Congratulations! You meet the requirements.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-red-500">
            <span className="text-5xl">😞</span>
            <p className="text-2xl font-bold">Not Eligible</p>
            <p className="text-sm text-gray-500 mt-1">Follow the steps below to qualify:</p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Eligibility Requirements
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            To be eligible for earning on <span className="font-bold text-red-600">SMU</span>, you need:
          </p>
          <ul className="list-disc list-inside text-left mt-2 text-gray-600 dark:text-gray-400">
            <li>At least <strong>1,000 followers</strong></li>
            <li>Minimum of <strong>3,000 views</strong></li>
          </ul>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={onClose}
          >
            Close
          </button>
          {!eligible && (
            <a
              href="/help"
              className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Learn How to Qualify
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CheckEligibility;
