import React, { useEffect, useState } from 'react';
import Modal from "./Modal";

const CheckEligibility = ({ onClose }) => {
  const [eligible, setEligible] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 No token found in localStorage");
      setEligible(false);
      return;
    }
  
    setLoading(true);
    console.log("🔄 Sending request to check eligibility...");
  
    fetch("http://localhost:8087/api/earnings/check-eligibility", {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
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
      {loading ? (
        <p className="text-center text-gray-600">Checking...</p>
      ) : eligible ? (
        <p className="flex items-center justify-center gap-2 text-green-600">✅ You are eligible!</p>
      ) : (
        <p className="text-red-500">❌ Not eligible. Follow the instructions to qualify.</p>
      )}
      <h2><p>To be eligible for earning on <span className="font-bold text-red-600">SMU</span> you need to have aleast 1k followers<br>
      </br> and 3k views</p></h2>
    </Modal>
  );
};

export default CheckEligibility;