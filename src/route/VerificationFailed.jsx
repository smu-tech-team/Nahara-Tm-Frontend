import React from "react";
import { XCircle } from "lucide-react";

const VerificationFailed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
      {/* Animated error icon */}
      <XCircle className="text-red-600 w-20 h-20 mb-4 animate-pulse" />
      <h1 className="text-4xl font-extrabold text-red-700 mb-4">
        Oops! Verification Failed
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        The verification link is invalid or has expired. Please try again or contact support for further assistance.
      </p>
      <a
        href="/resend-verification"
        className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
      >
        Resend Verification Link
      </a>
      <button
        onClick={() => window.location.href = "/"}
        className="mt-4 text-blue-800 underline hover:text-blue-600"
      >
        Return to Home
      </button>
    </div>
  );
};

export default VerificationFailed;
