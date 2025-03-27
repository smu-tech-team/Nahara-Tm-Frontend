import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

const SecureBanner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide banner after 30 seconds (30,000ms)
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (!visible) return null; // Hide component when `visible` is false

  return (
    <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2 fixed top-0 left-0 w-full z-50">
      <ShieldCheck size={18} />
      <span>Your connection is secure & encrypted 🔒</span>
    </div>
  );
};

export default SecureBanner;
