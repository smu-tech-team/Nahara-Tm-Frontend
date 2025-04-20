import { useEffect, useState } from "react";
import Modal from "./Modal";

const LockEarnings = ({ onClose }) => {
  const [lockExpiry, setLockExpiry] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCountdownModal, setShowCountdownModal] = useState(false);

  // Fetch lock status
  const fetchLockStatus = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/earnings/lock-status", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch lock status");

      const data = await response.json();
      if (data.locked) {
        setLockExpiry(new Date(data.lockExpiry));
      } else {
        setLockExpiry(null);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockStatus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!lockExpiry) return;

    const updateCountdown = () => {
      const now = new Date();
      const timeLeft = lockExpiry - now;

      if (timeLeft <= 0) {
        setRemainingTime("Unlocked");
        setLockExpiry(null);
        fetchLockStatus();
        clearInterval(interval);
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lockExpiry]);

  // Lock earnings function
  const lockEarnings = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/earnings/lock", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Locking failed");

      alert("Earnings locked for 30 days!");
      setLockExpiry(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} title="Lock Earnings">
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Lock your earnings to secure them for a specified duration. Once locked, they will be unavailable for withdrawal for <strong>30 days</strong>.
          </p>

          {/* Status Section */}
          {loading ? (
            <p className="text-gray-500">Fetching lock status...</p>
          ) : lockExpiry ? (
            <div>
              <p className="text-red-500 font-bold">Locked Until: {lockExpiry.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-green-500">Earnings are not currently locked.</p>
          )}

          {/* Lock Button */}
          <button
            className={`w-full px-4 py-2 mt-4 text-white rounded-lg ${
              lockExpiry ? "bg-gray-500 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-600"
            }`}
            onClick={lockEarnings}
            disabled={!!lockExpiry}
          >
            {lockExpiry ? "Already Locked" : "Lock Earnings"}
          </button>

          {/* Countdown Modal Trigger */}
          {lockExpiry && (
            <button
              className="w-full mt-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600"
              onClick={() => setShowCountdownModal(true)}
            >
              Show Countdown Timer
            </button>
          )}
        </div>
      </Modal>

      {/* Countdown Modal */}
      {showCountdownModal && (
        <Modal isOpen={true} onClose={() => setShowCountdownModal(false)} title="Countdown Timer">
          <p className="text-xl font-bold text-blue-500">Time Remaining: {remainingTime}</p>
        </Modal>
      )}
    </>
  );
};

export default LockEarnings;
