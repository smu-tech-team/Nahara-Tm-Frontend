import React from "react";
import { Lock, ShieldCheck, CheckCircle } from "lucide-react";

const SecurityBadge = () => {
  return (
    <div className="bg-transparent py-6 text-center mt-8">
      <h3 className="text-lg font-semibold mb-4">🔒 Secured & Protected</h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        {/* SSL Encrypted */}
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-green-500" />
          <span className="text-sm sm:text-base">SSL Encrypted</span>
        </div>

        {/* Firewall Protection */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-blue-500" />
          <span className="text-sm sm:text-base">Firewall Protection</span>
        </div>

        {/* Regular Security Audits */}
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-yellow-500" />
          <span className="text-sm sm:text-base">Regular Security Audits</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadge;
